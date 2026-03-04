
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// ---------------------------------------------------------
// CONFIGURE YOUR INITIAL DEVELOPER CREDENTIALS HERE
// ---------------------------------------------------------
const DEV_USER = {
    fullName: "System Developer",
    email: "gauthamram.um@gmail.com", // Updated by user request
    phone: "9999999999",
    password: "12345678", // CHANGE THIS PASSWORD
    role: "developer", // Must be 'developer' or 'admin'

    // Additional required fields with defaults
    track: "System Administration",
    duration: "Permanent",
    mode: "Remote",
    gender: "Other",
    address: "HQ"
};
// ---------------------------------------------------------

export async function GET(req) {
    try {
        await dbConnect();

        // Check if this developer already exists
        let existing = await User.findOne({ email: DEV_USER.email });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(DEV_USER.password, salt);

        if (existing) {
            // Update existing user to developer and fix missing fields
            existing.role = DEV_USER.role;
            existing.password = hashedPassword;

            // Fix schema drift if any
            if (!existing.fullName) existing.fullName = existing.name || DEV_USER.fullName;
            if (!existing.duration) existing.duration = existing.courseDuration || DEV_USER.duration;
            if (!existing.track) existing.track = DEV_USER.track;
            if (!existing.mode) existing.mode = existing.courseMode || DEV_USER.mode;

            await existing.save();

            return NextResponse.json({
                message: "Existing user upgraded to Developer successfully.",
                user: existing
            }, { status: 200 });
        }

        // Create the developer user with hashed password
        const newUser = await User.create({
            ...DEV_USER,
            password: hashedPassword
        });

        // Don't return the password in response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        return NextResponse.json({
            message: "Developer user created successfully!",
            user: userResponse
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating developer user:", error);
        return NextResponse.json({
            message: "Error creating developer user",
            error: error.message
        }, { status: 500 });
    }
}
