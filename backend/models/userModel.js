import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['tenant', 'landlord'],
        required: true,
    },

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        
    }
 });

const User = mongoose.model('User', UserSchema);

export default User;
//  module.exports = mongoose.model('User', UserSchema);