import mongoose from "mongoose";

const shareFileSchema = new mongoose.Schema({
    email: {type: String},
    code: {type: String},
    id: {type: String, required: true, unique: true},
    lang: {type: String, required: true},
    date: {type: Date},
    title: {type: String},
    desc: {type: String},
});

const shareFileModel = mongoose.models.shareFile || mongoose.model('shareFile', shareFileSchema);

export default shareFileModel;
