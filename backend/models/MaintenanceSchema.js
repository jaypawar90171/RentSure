import { create } from "domain";
import mongoose from "mongoose";

const maintananceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    urgency: { type: String,  },
    landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord", required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    createdAt: { type: Date, default: Date.now },
});

const Maintanance = mongoose.model("Maintanance", maintananceSchema);
export default Maintanance;