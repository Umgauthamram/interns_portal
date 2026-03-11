import mongoose from 'mongoose';

const TrackSchema = new mongoose.Schema({
    category: {
        type: String,
        required: true,
        enum: ['CODING', 'RESEARCH']
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, { timestamps: true });

export default mongoose.models.Track || mongoose.model('Track', TrackSchema);
