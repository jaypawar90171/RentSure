
import mongoose from 'mongoose';
import upiDetailsSchema  from './schemas.js';

const landlordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  
  upiDetails: { type: upiDetailsSchema, required: true },
  properties: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

// module.exports = mongoose.model('Landlord', landlordSchema);

const Landlord = mongoose.model('Landlord' , landlordSchema)

export default Landlord;