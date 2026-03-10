
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
        }

        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Verify password
        if (!user.password) {
            return NextResponse.json({ message: "Please reset your password or register again." }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Block terminated users
        if (user.status === 'Terminated') {
            return NextResponse.json({
                message: "Your account has been terminated.",
                contact: "gautham@digitalsouth.co.in",
                terminated: true
            }, { status: 403 });
        }

        // Return user info (without password)
        const userObj = user.toObject();
        delete userObj.password;

        return NextResponse.json({
            message: "Login successful",
            user: userObj
        }, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
    }
}
