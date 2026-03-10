import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import ProjectRequest from "@/models/ProjectRequest";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const user = await User.findById(id).select('-password');

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const projects = await ProjectRequest.find({ internId: id }).sort({ createdAt: -1 });

        return NextResponse.json({ user, projects }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user details:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
