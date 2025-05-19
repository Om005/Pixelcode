import mongoose from "mongoose";

const shareFileSchema = new mongoose.Schema({
    code: {type: String},
    id: {type: String, required: true, unique: true},
    lang: {type: String, required: true},
});

const shareFileModel = mongoose.models.shareFile || mongoose.model('shareFile', shareFileSchema);

export default shareFileModel;