import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    profilePicUrl: {
        type: String,
        required: false,
    },
    clerkUserId: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
        required: false,
    },
}, {timestamps:true} );


// check if model already exists
if(mongoose.models["users"]) {
    delete mongoose.models["users"];
}

const User = mongoose.model("users", userSchema);
export default User;