import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function POST(request) {
    try {
        await dbConnect();
        const data = await request.json();

        // Validate data (In production, replace with proper validation library like Zod)
        if (!data.email || !data.name) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Generate Auto Password
        const tempPassword = Math.random().toString(36).slice(-8);

        // Create User in DB
        const user = await User.create({
            name: data.name,
            email: data.email,
            password: tempPassword, // In production, hash this password!
            address: data.address,
            phone: data.phone,
            dob: new Date(data.dob),
            gender: data.gender,
            track: data.track,
            subTrack: data.subTrack,
            courseDuration: data.duration,
            courseMode: data.mode
        });

        // Simulate SMTP Email Sending
        console.log('--- SIMULATED EMAIL ---');
        console.log(`To: ${user.email}`);
        console.log(`Subject: Your Internship Account Credentials`);
        console.log(`Body: Hello ${user.name}, welcome abroad! Your temporary password is: ${tempPassword}. Please change it on first login.`);
        console.log('-----------------------');

        return NextResponse.json({
            message: 'Registration successful',
            userId: user._id,
            tempPassword // Only for demo; never return passwords in real API
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
