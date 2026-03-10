
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { verifyAdmin } from "@/lib/auth";

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        // Verify that the requesting user is an admin
        const adminEmail = body.requestedBy;
        if (adminEmail) {
            const adminUser = await User.findOne({ email: adminEmail });
            if (!adminUser || adminUser.role !== 'admin') {
                return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
            }
        }

        // Validate required fields
        if (!body.email || !body.fullName || !body.password) {
            return NextResponse.json({ message: "Email, name, and password are required" }, { status: 400 });
        }

        const existing = await User.findOne({ email: body.email });
        if (existing) {
            return NextResponse.json({ message: "User already exists with this email" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(body.password, 10);

        // Force role to admin
        const adminUser = await User.create({
            fullName: body.fullName,
            email: body.email,
            phone: body.phone || "N/A",
            password: hashedPassword,
            role: 'admin',
            track: body.track || 'Administration',
            duration: body.duration || 'Indefinite',
            mode: body.mode || 'Remote',
            gender: body.gender || 'Other',
            address: body.address || 'N/A'
        });

        // Don't return password
        const userResponse = adminUser.toObject();
        delete userResponse.password;

        return NextResponse.json({ message: "Admin created successfully", user: userResponse }, { status: 201 });
    } catch (error) {
        console.error("Error creating admin:", error);
        return NextResponse.json({ message: "Error creating admin", error: error.message }, { status: 500 });
    }
}
