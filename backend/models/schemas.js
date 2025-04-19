import mongoose from 'mongoose';

const upiDetailsSchema = new mongoose.Schema({
    upiId: { type: String, required: true },
    name: { type: String, required: true }
  });
  
  const addressSchema = new mongoose.Schema({
    street: String,
    city: String,
    state: String,
    zipcode: String
  });
  
  const rentAgreementSchema = new mongoose.Schema({
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    rentAmount: { type: Number, required: true },
    deposit: { type: Number, required: true },
    rules: [String],
    additionalTerms: String
  });


  export default {
    upiDetailsSchema,
    addressSchema,
    rentAgreementSchema
  };
