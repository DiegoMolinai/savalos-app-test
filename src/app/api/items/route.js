import dbConnect from "@/lib/dbConnect";
import Item from "@/models/Item";

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);

  // Construcción dinámica del filtro
  const filter = {};

  if (searchParams.has("title")) {
    filter.title = { $regex: searchParams.get("title"), $options: "i" };
  }

  if (searchParams.has("category")) {
    filter["category.name"] = { $regex: searchParams.get("category"), $options: "i" };
  }

  if (searchParams.has("priceMin") || searchParams.has("priceMax")) {
    filter.price = {};
    if (searchParams.has("priceMin")) {
      filter.price.$gte = parseFloat(searchParams.get("priceMin"));
    }
    if (searchParams.has("priceMax")) {
      filter.price.$lte = parseFloat(searchParams.get("priceMax"));
    }
  }

  if (searchParams.has("tag")) {
    filter.tags = searchParams.get("tag");
  }

  const items = await Item.find(filter);

  return Response.json(items);
}

export async function POST(request) {
  await dbConnect();
  const body = await request.json();

  try {
    const item = await Item.create(body);
    return Response.json(item, { status: 201 });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 400 });
  }
}
