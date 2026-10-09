import seedData from '@/data/seed-data.json';
import type { BookWithDetails } from '@/lib/types';

function getTotalStock(bookId: string): number {
  return seedData.inventory
    .filter((i) => i.bookId === bookId)
    .reduce((sum, i) => sum + i.stockDisponible, 0);
}

export function enrichBook(book: (typeof seedData.books)[0]): BookWithDetails {
  const authors = seedData.bookAuthors
    .filter((ba) => ba.bookId === book.id)
    .sort((a, b) => a.order - b.order)
    .map((ba) => {
      const author = seedData.authors.find((a) => a.id === ba.authorId);
      if (!author) return null;
      return {
        authorId: author.id,
        order: ba.order,
        author: { id: author.id, name: author.name, nationality: author.nationality ?? null },
      };
    })
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  const categories = seedData.bookCategories
    .filter((bc) => bc.bookId === book.id)
    .map((bc) => {
      const cat = seedData.categories.find((c) => c.id === bc.categoryId);
      if (!cat) return null;
      return {
        categoryId: cat.id,
        category: { id: cat.id, name: cat.name, slug: cat.slug },
      };
    })
    .filter((c): c is NonNullable<typeof c> => Boolean(c));

  const publisher = book.publisherId
    ? seedData.publishers.find((p) => p.id === book.publisherId)
    : null;

  return {
    ...book,
    authors,
    categories,
    publisher: publisher
      ? { id: publisher.id, name: publisher.name, country: publisher.country ?? null }
      : null,
    totalStock: getTotalStock(book.id),
  };
}

export function getAllBooks(): BookWithDetails[] {
  return seedData.books.filter((b) => b.isActive).map(enrichBook);
}

export function getBookBySlug(slug: string): BookWithDetails | null {
  const decodedSlug = decodeURIComponent(slug);
  const raw = seedData.books.find(
    (b) => (b.slug === decodedSlug || b.slug === slug) && b.isActive
  );
  if (!raw) return null;
  return enrichBook(raw);
}

export function getRelatedBooks(book: BookWithDetails, limit = 4): BookWithDetails[] {
  const categoryIds = new Set(book.categories.map((c) => c.categoryId));
  const sameAuthor = book.authors[0]?.authorId;

  return getAllBooks()
    .filter((b) => b.id !== book.id)
    .map((b) => {
      let score = 0;
      if (sameAuthor && b.authors.some((a) => a.authorId === sameAuthor)) score += 3;
      if (b.categories.some((c) => categoryIds.has(c.categoryId))) score += 2;
      if (book.series && b.series === book.series) score += 4;
      return { book: b, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.book);
}
