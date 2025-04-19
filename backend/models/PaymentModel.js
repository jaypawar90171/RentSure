import mongoose from 'mongoose';
const PaymentSchema = new mongoose.Schema({
    amount: {
        type: Number,
        // required: true,
    },
    propertyId : {
        type: String,
        // required : true
    },
    tenantId: {
        type: String,
        // ref: 'Tenant',
        // required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Payment = mongoose.model('Payment', PaymentSchema);

export default Payment;
// module.exports = mongoose.model('Payment', PaymentSchema);