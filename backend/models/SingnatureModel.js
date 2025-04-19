import mongoose from "mongoose";

const signatureSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  signatureImage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.model("Signature", signatureSchema);