import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    img: {
        type: String,
        default: "https://firebasestorage.googleapis.com/v0/b/video-e2c0b.appspot.com/o/Screenshot%202023-04-01%20at%2020.41.09.png?alt=media&token=025428fe-43e8-48b0-a926-46565e9c0aaa"
    },
    subscribers: {
        type: Number,
        default: 0
    },
    subscribedUsers: {
        type: [String]
    },
    fromGoogle: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default mongoose.model("User", UserSchema);