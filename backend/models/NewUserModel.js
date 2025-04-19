import mongoose from 'mongoose';

const newUserSchema = mongoose.Schema({

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

const NewUserModel = mongoose.model('NewUserModel' , newUserSchema)

export default NewUserModel