
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { scheduleMonthlyReviews } from "@/lib/scheduleReviews";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        // Check if user already exists
        const existingUser = await User.findOne({ email: body.email });
        if (existingUser) {
            return NextResponse.json({ message: "User already registered with this email" }, { status: 400 });
        }

        const hashedPassword = body.password ? await bcrypt.hash(body.password, 10) : undefined;
        const newUser = await User.create({ ...body, password: hashedPassword });

        // Auto-schedule 4 weekly reviews starting from today
        if (newUser.role === 'intern' || !newUser.role) {
            scheduleMonthlyReviews(newUser, new Date())
                .then(created => console.log(`Auto-scheduled ${created.length} reviews for ${newUser.fullName}`))
                .catch(e => console.error('Auto-schedule on register failed:', e.message));
        }

        return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({ message: "Error registering user", error: error.message }, { status: 500 });
    }
}
