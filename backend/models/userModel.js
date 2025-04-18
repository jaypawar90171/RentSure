import mongoose from "mongoose";

const userSchema = mongoose.Schema({

    name : {
        type : String,
    },
    email : {
        type : String,
    },
    image : {
        type : String,
    }
})

const UserModel = mongoose.model('UserModel', userSchema);

export default UserModel;