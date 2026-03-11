import { NextResponse } from 'next/server';
import connectMongo from '@/lib/mongodb';
import Track from '@/models/Track';

export async function GET() {
    try {
        await connectMongo();
        let tracks = await Track.find({});

        // Auto-seed if empty
        if (tracks.length === 0) {
            const TRACK_CONFIG = {
                CODING: [
                    { name: "Web Development", description: "Design and build modern web applications and interfaces." },
                    { name: "Blockchain / Web3", description: "Develop decentralized applications and smart contracts." },
                    { name: "GenAI", description: "Explore and implement generative AI models and tools." },
                    { name: "AI/ML", description: "Build and train artificial intelligence and machine learning systems." },
                    { name: "App Development", description: "Create native and cross-platform mobile applications." }
                ],
                RESEARCH: [
                    { name: "Cybersecurity", description: "Protect systems and networks from digital attacks and vulnerabilities." },
                    { name: "Robotics", description: "Design, build, and operate automated robotic systems." },
                    { name: "Semiconductor", description: "Research and develop advanced microchips and circuit technologies." },
                    { name: "Biotechnology", description: "Apply biology and technology to develop innovative health and environmental solutions." },
                    { name: "Renewable Energy", description: "Develop and optimize sustainable energy systems and storage." },
                    { name: "Artificial Intelligence", description: "Deep dive into theoretical AI and neural network innovations." },
                    { name: "Quantum Computing", description: "Explore the frontiers of quantum information science and computing." }
                ]
            };

            const initialTracks = [];
            for (const category of ['CODING', 'RESEARCH']) {
                for (const t of TRACK_CONFIG[category]) {
                    initialTracks.push({ category, name: t.name, description: t.description });
                }
            }
            await Track.insertMany(initialTracks);
            tracks = await Track.find({}); // Re-fetch
        }

        // Group by category to match the expected format
        const grouped = {
            CODING: tracks.filter(t => t.category === 'CODING'),
            RESEARCH: tracks.filter(t => t.category === 'RESEARCH')
        };

        return NextResponse.json(grouped, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error fetching tracks' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await connectMongo();
        const { category, name, description } = await req.json();
        const existingTrack = await Track.findOne({ category, name });
        if (existingTrack) {
            return NextResponse.json({ message: 'Track already exists' }, { status: 400 });
        }
        const track = await Track.create({ category, name, description });
        return NextResponse.json(track, { status: 201 });
    } catch (err) {
        return NextResponse.json({ message: 'Error creating track' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await connectMongo();
        const { id, name, description } = await req.json();
        const track = await Track.findByIdAndUpdate(id, { name, description }, { new: true });
        return NextResponse.json(track, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error updating track' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectMongo();
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        await Track.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Track deleted' }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ message: 'Error deleting track' }, { status: 500 });
    }
}
