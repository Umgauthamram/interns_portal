import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(req) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            email,
            fullName
        } = await req.json();

        // 1. Verify Signature
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json(
                { error: "Payment verification failed" },
                { status: 400 }
            );
        }

        // 2. Generate Credentials
        const username = email.split('@')[0] + Math.floor(Math.random() * 1000);
        const password = Math.random().toString(36).slice(-8) + "!Aa1";

        // 3. Send Email
        // Configure transporter (Using Gmail example, requires App Password)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Internship Portal Registration - Credentials',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #000;">Welcome to Internship Portal, ${fullName}!</h2>
                    <p>Your payment was successful and your account has been created.</p>
                    <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Username:</strong> ${username}</p>
                        <p><strong>Password:</strong> ${password}</p>
                    </div>
                    <p>Please log in at <a href="${process.env.NEXT_PUBLIC_APP_URL}/login">Internship Portal Login</a>.</p>
                    <p>Best regards,<br/>The Team</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({
            success: true,
            message: "Payment verified and credentials sent",
        });

    } catch (error) {
        console.error("Error in verify-payment:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
