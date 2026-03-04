import mongoose from 'mongoose';

const LiveBookCourseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    desc: { type: String },
    modules: [{
        id: String,
        title: String
    }]
}, { timestamps: true });

export default mongoose.models.LiveBookCourse || mongoose.model('LiveBookCourse', LiveBookCourseSchema);
