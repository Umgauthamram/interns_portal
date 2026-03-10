import dbConnect from "@/lib/mongodb";
import ProjectRequest from "@/models/ProjectRequest";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const email = searchParams.get('email');
        const role = searchParams.get('role');

        let query = {};
        if (email) {
            query.internEmail = email;
        } else if (role !== 'admin') {
            return NextResponse.json({ message: "Email query parameter required" }, { status: 400 });
        }

        const projects = await ProjectRequest.find(query).sort({ requestedAt: -1 });
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const { internEmail, title, description, colorHex, techStack, repoLink, deployLink, solution, progress, track, isPreset } = body;

        if (!internEmail || !title || !description) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const user = await User.findOne({ email: internEmail });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const newProject = await ProjectRequest.create({
            internId: user._id,
            internName: user.fullName,
            internEmail: user.email,
            track,
            projectName: title,
            description,
            colorHex,
            techStack,
            repoLink,
            deployLink,
            solution,
            progress: progress || 10,
            status: 'Pending',
            projectType: isPreset ? 'preset' : 'custom'
        });

        return NextResponse.json({ message: "Project created successfully", project: newProject }, { status: 201 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ message: "Error creating project", error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, title, description, colorHex, techStack, repoLink, deployLink, solution, progress, status, adminFeedback } = body;

        if (!id) {
            return NextResponse.json({ message: "Project ID required" }, { status: 400 });
        }

        const updateData = { projectName: title, description, colorHex, techStack, repoLink, deployLink, solution, progress };
        if (status) updateData.status = status;
        if (adminFeedback !== undefined) updateData.adminFeedback = adminFeedback;

        const project = await ProjectRequest.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json({ message: "Error updating project" }, { status: 500 });
    }
}
