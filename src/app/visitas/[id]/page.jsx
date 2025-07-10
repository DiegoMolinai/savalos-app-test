'use client'

import EditVisit from '@/components/visitComponents/editVisit/EditVisit'

export default function EditVisitPage({ params }) {
  return <EditVisit visitId={params.id} />
}
