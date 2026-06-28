// ============================================================================
//  ADMIN SHEET CLIENT WRAPPER
//  Bridge entre el server component (page.tsx) y el client AdminSheet.
// ============================================================================
'use client'

import { useUI } from '@/lib/store'
import { AdminSheet } from '@/components/admin/admin-sheet'

interface AdminSheetClientProps {
  metrics: any
}

export function AdminSheetClient({ metrics }: AdminSheetClientProps) {
  const { adminOpen, setAdminOpen } = useUI()
  return (
    <AdminSheet
      open={adminOpen}
      onOpenChange={setAdminOpen}
      metrics={metrics}
    />
  )
}
