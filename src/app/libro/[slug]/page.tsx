import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllBooks, getBookBySlug, getRelatedBooks } from '@/lib/books';
import { BookDetailView } from '@/components/book-detail-view';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const books = getAllBooks();
  return books.map((book) => ({
    slug: book.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    return {
      title: 'Libro no encontrado | Editorial Horizonte',
      description: 'El libro solicitado no se encuentra en el catálogo de Editorial Horizonte.',
    };
  }

  const authors = book.authors.map((a) => a.author.name).join(', ') || 'Editorial Horizonte';
  const description =
    book.synopsis?.slice(0, 160) ||
    `Obra destacada de ${authors} publicada por Editorial Horizonte (Lima, Perú).`;

  const coverUrl = book.coverUrl ? `${book.coverUrl}` : '/hero-desktop.webp';

  return {
    title: `${book.title} — ${authors} | Editorial Horizonte`,
    description,
    keywords: [
      book.title,
      authors,
      'Editorial Horizonte',
      'libros peruanos',
      'literatura peruana',
      book.isbn || '',
      book.series || '',
    ].filter(Boolean),
    openGraph: {
      title: `${book.title} — ${authors}`,
      description,
      type: 'book',
      images: [
        {
          url: coverUrl,
          width: 800,
          height: 1200,
          alt: `Portada de ${book.title}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${book.title} — ${authors}`,
      description,
      images: [coverUrl],
    },
  };
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  const book = getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const relatedBooks = getRelatedBooks(book, 4);

  return <BookDetailView book={book} relatedBooks={relatedBooks} />;
}
