import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomId: {type: String, required: true},
    admin: {type: String, required: true},
    blocked: [String]
})

const roomModel = mongoose.model.room || mongoose.model('room', roomSchema);

export default roomModel;