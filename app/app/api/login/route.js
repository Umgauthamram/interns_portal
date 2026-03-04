
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        // Check password if exists, otherwise fallback (for old users without password?)
        // If user has no password (registered before), we might need logic. 
        // But assuming new flow or seed users.
        if (user.password) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
            }
        } else {
            // For legacy users without password, maybe allow or fail? 
            // Fail for security. They must register again or reset?
            return NextResponse.json({ message: "Please reset your password or register again." }, { status: 401 });
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
