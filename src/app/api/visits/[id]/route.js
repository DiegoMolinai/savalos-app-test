import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Visit from '@/models/Visit'

// GET /api/visits/:id
export async function GET(req, context) {
  await dbConnect()
  const { params } = context

  try {
    const visit = await Visit.findById(params.id)
    if (!visit) {
      return NextResponse.json({ error: 'Visita no encontrada' }, { status: 404 })
    }
    return NextResponse.json(visit)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener visita' }, { status: 500 })
  }
}

// PUT /api/visits/:id
export async function PUT(req, context) {
  await dbConnect()
  const { params } = context

  try {
    const data = await req.json()
    const updatedVisit = await Visit.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true
    })

    if (!updatedVisit) {
      return NextResponse.json({ error: 'Visita no encontrada' }, { status: 404 })
    }

    return NextResponse.json(updatedVisit)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error al actualizar visita' }, { status: 400 })
  }
}

// DELETE /api/visits/:id
export async function DELETE(req, context) {
  await dbConnect()
  const { params } = context

  try {
    const deletedVisit = await Visit.findByIdAndDelete(params.id)

    if (!deletedVisit) {
      return NextResponse.json({ error: 'Visita no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Visita eliminada correctamente' })
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar visita' }, { status: 500 })
  }
}
