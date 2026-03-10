
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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

        return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json({ message: "Error registering user", error: error.message }, { status: 500 });
    }
}
