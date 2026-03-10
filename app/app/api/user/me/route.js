import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ message: "Email query parameter required" }, { status: 400 });
        }

        const user = await User.findOne({ email }).select('-password');

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const data = await req.json();
        const { email, password, profilePic, avatarSeed } = data;

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }

        const updateData = {};
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }
        // Only update profilePicture if explicitly provided (non-undefined)
        // Use empty string '' or null to clear it; a real base64 to set it
        if (profilePic !== undefined) {
            updateData.profilePicture = (profilePic && profilePic.length > 10) ? profilePic : '';
        }
        // Only update avatarSeed if a real seed string is provided
        if (avatarSeed !== undefined) {
            updateData.avatarSeed = (avatarSeed && avatarSeed.length > 0) ? avatarSeed : null;
        }

        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Profile updated successfully", user: updatedUser }, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
