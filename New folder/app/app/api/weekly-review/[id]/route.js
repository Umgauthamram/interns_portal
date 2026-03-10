import dbConnect from "@/lib/mongodb";
import WeeklyReview from "@/models/WeeklyReview";
import { NextResponse } from "next/server";

// PUT - Update a weekly review (progress status, feedback, meeting status)
export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        const updated = await WeeklyReview.findByIdAndUpdate(id, body, { new: true });
        if (!updated) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 });
        }

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("Error updating weekly review:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// DELETE - Remove a weekly review
export async function DELETE(req, { params }) {
    try {
        await dbConnect();
        const { id } = await params;

        await WeeklyReview.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting weekly review:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
