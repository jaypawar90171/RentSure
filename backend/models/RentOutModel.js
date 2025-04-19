import mongoose  from "mongoose";


const rentOutSchema = new mongoose.Schema({ 
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },
    landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "Landlord" },

    createdAt: { type: Date, default: Date.now },
})


export default mongoose.model("RentOut", rentOutSchema);