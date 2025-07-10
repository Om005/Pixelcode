import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    email: {type: String, required: true},
    title: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    description: {type: String}
})

const projectModel = mongoose.models.project || mongoose.model('project', projectSchema);

export default projectModel;