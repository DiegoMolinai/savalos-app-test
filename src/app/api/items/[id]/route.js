import dbConnect from "@/lib/dbConnect";
import Item from "@/models/Item";

export async function GET(_, { params }) {
  await dbConnect();
  const item = await Item.findById(params.id);
  if (!item) return Response.json({ error: "No encontrado" }, { status: 404 });
  return Response.json(item);
}

export async function PUT(request, { params }) {
  await dbConnect();
  const data = await request.json();
  const updated = await Item.findByIdAndUpdate(params.id, data, { new: true });
  return Response.json(updated);
}

export async function DELETE(_, context) {
  await dbConnect();
  const params = await context.params;
  const { id } = params;
  await Item.findByIdAndDelete(id);
  return new Response(null, { status: 204 });
}
