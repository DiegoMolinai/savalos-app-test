// src/app/api/visits/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visit from "@/models/Visit";

// GET /api/visits?status=Confirmada&region=Metropolitana
export async function GET(req) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  // const region = searchParams.get("region");
  // const assignedTo = searchParams.get("assignedTo");
  // const date = searchParams.get("date");
  // const clientName = searchParams.get("clientName");
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName")
  const commune = searchParams.get("commune");

  const query = {};

  if (status) query.status = status;
  // if (region) query["address.region"] = region;
  // if (assignedTo) query["assignedTo.userId"] = assignedTo;
  // if (clientName) query["client.fullName"] = { $regex: clientName, $options: 'i' };
  
  if (firstName) query["client.firstName"] = { $regex: firstName, $options: 'i' };
  
  if (lastName) query["client.lastName"] = { $regex: lastName, $options: 'i' };

  if (commune) query["address.commune"] = { $regex: commune, $options: 'i' };
  // if (date) {
  //   const dayStart = new Date(date);
  //   const dayEnd = new Date(date);
  //   dayEnd.setDate(dayEnd.getDate() + 1);
  //   query.scheduledDate = { $gte: dayStart, $lt: dayEnd };
  // }

  try {
    const visits = await Visit.find(query).sort({ scheduledDate: 1 });
    return NextResponse.json(visits);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener visitas" }, { status: 500 });
  }
}


// POST /api/visits
export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json();
    const newVisit = new Visit(data);
    const saved = await newVisit.save();
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear visita" },
      { status: 400 }
    );
  }
}
