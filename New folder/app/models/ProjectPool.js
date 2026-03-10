import mongoose from 'mongoose';

const ProjectPoolSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    track: { type: String, required: true },
    difficulty: { type: String, default: 'Intermediate' },
    type: { type: String, default: 'Coding Project' },
    description: { type: String, required: true },
    realWorld: String,
    matters: String,
    existingSolutions: String,
    objectives: String,
    features: String,
    techStack: String,
    apis: String,
    dataset: String,
    researchBackground: String,
    hypothesis: String,
    innovation: String,
    relevance: String,
    researchOutput: String,
    startDate: String,
    endDate: String,
    milestones: String,
    status: { type: String, default: 'Active' },
    deadline: { type: String, default: '1 Month' },
    enrolled: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.ProjectPool || mongoose.model('ProjectPool', ProjectPoolSchema);
