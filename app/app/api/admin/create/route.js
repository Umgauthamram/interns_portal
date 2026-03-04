
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const existing = await User.findOne({ email: body.email });
        if (existing) {
            return NextResponse.json({ message: "User already exists" }, { status: 400 });
        }

        const hashedPassword = body.password ? await bcrypt.hash(body.password, 10) : undefined;

        // Force role to admin
        const adminUser = await User.create({
            ...body,
            password: hashedPassword,
            role: 'admin'
        });

        return NextResponse.json({ message: "Admin created successfully", user: adminUser }, { status: 201 });
    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json({ message: "Error creating admin", error: error.message }, { status: 500 });
    }
}
