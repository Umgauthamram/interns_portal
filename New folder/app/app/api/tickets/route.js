
import dbConnect from "@/lib/mongodb";
import Ticket from "@/models/Ticket";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        // Basic validation
        if (!body.type || !body.description) {
            return NextResponse.json({ message: "Type and Description are required" }, { status: 400 });
        }

        const ticket = await Ticket.create(body);
        return NextResponse.json({ message: "Ticket created successfully", ticket }, { status: 201 });
    } catch (error) {
        console.error("Error creating ticket:", error);
        return NextResponse.json({ message: "Error creating ticket", error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await dbConnect();
        // Fetch most recent first
        const tickets = await Ticket.find({}).sort({ createdAt: -1 });
        return NextResponse.json(tickets, { status: 200 });
    } catch (error) {
        console.error("Error fetching tickets:", error);
        return NextResponse.json({ message: "Error fetching tickets" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ message: "ID and Status required" }, { status: 400 });
        }

        const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });

        if (!ticket) {
            return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
        }

        return NextResponse.json(ticket, { status: 200 });
    } catch (error) {
        console.error("Error updating ticket:", error);
        return NextResponse.json({ message: "Error updating ticket" }, { status: 500 });
    }
}
