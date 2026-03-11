
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide ur name.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        unique: true,
    },
    dob: {
        type: String,
    },
    phone: {
        type: String,
        required: [true, 'Please provide a phone number.'],
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    address: {
        type: String,
    },
    track: {
        type: String,
        required: [true, 'Please select a track.'],
    },
    duration: {
        type: String,
        required: [true, 'Please select duration.'],
    },
    mode: {
        type: String, // 'Remote', 'In-office', etc.
        default: 'Remote',
    },
    joinDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        default: 'Active',
    },
    password: {
        type: String,
        select: false, // Don't return password by default
    },
    role: {
        type: String,
        enum: ['intern', 'admin'],
        default: 'intern',
    },
    profilePicture: {
        type: String,
    },
    aadhaarNumber: { type: String },
    passportPhoto: { type: String }, // Storing as base64 or URL
    aadhaarCard: { type: String },
    educationQualification: {
        type: String,
        enum: ['Pursuing', 'Completed', 'None'],
    },
    courseName: { type: String },
    collegeName: { type: String },
    workingDetails: { type: String },
    resumeDocument: { type: String },
    avatarSeed: {
        type: String,
    },
    assignedAdmin: {
        type: String, // email of the admin assigned to this intern
        default: 'gauthamram.um@gmail.com',
    },
    missedMeetings: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
