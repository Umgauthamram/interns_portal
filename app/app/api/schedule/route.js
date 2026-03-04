import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectMongo from '@/lib/mongodb';
import Schedule from '@/models/Schedule';
import User from '@/models/User';

export async function POST(req) {
    try {
        await connectMongo();
        const body = await req.json();
        const { userId, adminEmail, date, time, meetingLink, description } = body;

        console.log("SCHEDULE DEBUG: CREATING MEETING FOR", userId);

        const newSchedule = new Schedule({
            userId,
            adminEmail,
            date,
            time,
            meetingLink,
            description
        });

        await newSchedule.save();

        return NextResponse.json({ message: "Schedule created successfully!", schedule: newSchedule }, { status: 201 });
    } catch (error) {
        console.error("Failed to create schedule:", error);
        return NextResponse.json({ message: "Failed to create schedule" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectMongo();

        const url = new URL(req.url);
        const email = url.searchParams.get('email');
        const role = url.searchParams.get('role'); // e.g., 'admin' or 'intern'

        if (!email && role !== 'admin') {
            return NextResponse.json({ message: "Missing email parameter" }, { status: 400 });
        }

        let schedules = [];

        if (role === 'admin') {
            // Admin can see everything they scheduled
            schedules = await Schedule.find({ adminEmail: email }).populate('userId', 'fullName email track').sort({ date: 1, time: 1 });
        } else {
            // Intern needs their ID
            const user = await User.findOne({ email });
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }
            schedules = await Schedule.find({ userId: user._id }).populate('userId', 'fullName').sort({ date: 1, time: 1 });
        }

        return NextResponse.json(schedules, { status: 200 });
    } catch (error) {
        console.error("Failed to fetch schedules:", error);
        return NextResponse.json({ message: "Failed to fetch schedules" }, { status: 500 });
    }
}
