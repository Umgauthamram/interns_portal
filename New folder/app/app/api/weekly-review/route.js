import dbConnect from "@/lib/mongodb";
import WeeklyReview from "@/models/WeeklyReview";
import { NextResponse } from "next/server";

// GET all weekly reviews (filter by internId or internEmail via query params)
export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const internId = searchParams.get("internId");
        const internEmail = searchParams.get("internEmail");

        const filter = {};
        if (internId) filter.internId = internId;
        if (internEmail) filter.internEmail = internEmail;

        const reviews = await WeeklyReview.find(filter).sort({ createdAt: -1 });
        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.error("Error fetching weekly reviews:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

// POST - Create a new weekly review / meeting
export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const { internId, internEmail, weekLabel, meetingDate, meetingTime, meetingLink, progressStatus, progressNote, adminFeedback } = body;

        if (!internId || !internEmail || !weekLabel || !meetingDate || !meetingTime || !meetingLink) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const review = await WeeklyReview.create({
            internId,
            internEmail,
            weekLabel,
            meetingDate,
            meetingTime,
            meetingLink,
            progressStatus: progressStatus || 'On Track',
            progressNote: progressNote || '',
            adminFeedback: adminFeedback || '',
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error("Error creating weekly review:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
