import mongoose from 'mongoose';

const WeeklyReviewSchema = new mongoose.Schema({
    internId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    internEmail: {
        type: String,
        required: true,
    },
    weekLabel: {
        type: String,
        required: true, // e.g. "Week 1", "Week 2"
    },
    meetingDate: {
        type: String,
        required: true, // YYYY-MM-DD
    },
    meetingTime: {
        type: String,
        required: true, // e.g. "10:00 AM"
    },
    meetingLink: {
        type: String,
        required: true,
    },
    progressStatus: {
        type: String,
        enum: ['On Track', 'Needs Attention', 'Behind Schedule', 'Excellent', 'Completed'],
        default: 'On Track',
    },
    progressNote: {
        type: String,
        default: '',
    },
    adminFeedback: {
        type: String,
        default: '',
    },
    meetingStatus: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled',
    },
}, { timestamps: true });

export default mongoose.models.WeeklyReview || mongoose.model('WeeklyReview', WeeklyReviewSchema);
