import mongoose from 'mongoose';

import  addressSchema from './schemas.js';
import rentAgreementSchema from './schemas.js';
import upiDetailsSchema from './schemas.js';

const propertySchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: addressSchema, required: true },
    propertyType: {
      type: String,
      enum: ["residential", "commercial"],
      required: true,
    },
    startDate :{
      type: Date,
      default: Date.now,
    },
    endDate :{
      type: Date,
      required: true,
    },
    rentAmount: { type: Number, required: true },
    depositAmount: { type: Number, required: true },
    propertyArea :{ type: Number, required: true },
    noOfRooms: { type: Number, required: true },
    rentAgreement: { type: rentAgreementSchema, required: false },
    
    isAvailable: { type: Boolean, default: true },
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Landlord",
      required: true,
    },

    location: {
      latitude: { type: Number },
      longitude: { type: Number, },
    },
    image: { type: String },
    documentHash: { type: String },
  });
  
  const Property = mongoose.model("Property", propertySchema);

  export default Property;
  
  // module.exports = mongoose.model('Property', propertySchema);