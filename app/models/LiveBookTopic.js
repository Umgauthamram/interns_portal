import mongoose from 'mongoose';

const LiveBookTopicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    status: { type: String, default: 'Draft' }, // 'Draft' or 'Published'
    course: { type: String, required: true },
    module: { type: String, required: true },
    blocks: [{
        type: { type: String, required: true },
        content: { type: String }
    }]
}, { timestamps: true });

export default mongoose.models.LiveBookTopic || mongoose.model('LiveBookTopic', LiveBookTopicSchema);
