
import mongoose from 'mongoose';

const ProjectRequestSchema = new mongoose.Schema({
    internId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    internName: String,
    internEmail: String,
    track: String,
    projectName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    projectType: {
        type: String,
        enum: ['custom', 'preset'],
        default: 'custom'
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        default: 'Pending'
    },
    colorHex: { type: String, default: '#8b5cf6' },
    category: String,
    techStack: [String],
    repoLink: String,
    deployLink: String,
    documentFile: String,
    documentLink: String,
    solution: String,
    progress: { type: Number, default: 0 },
    adminFeedback: String,
    requestedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export default mongoose.models.ProjectRequest || mongoose.model('ProjectRequest', ProjectRequestSchema);
