import mongoose from 'mongoose';
import upiDetailsSchema   from './schemas.js';


const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  upiDetails: { type: upiDetailsSchema, required: true },
  previousProperties: [
    {
      property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
    },
  ],
  requestedProperties: [
    {
      property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Property",
      },
      status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
      },
      requestedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Tenant = mongoose.model("Tenant", tenantSchema);

export default Tenant;
// module.exports = mongoose.model("Tenant", tenantSchema);
