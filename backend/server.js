import express from 'express';
import mongoose from 'mongoose';
import { google } from 'googleapis';
import { ethers } from 'ethers';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/authRouter.js'; // Replace require with import
import connect from './DB/db.js'; // Replace require with import

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
// Uncomment the following line if you want to connect to MongoDB
// connect();
mongoose.connect(process.env.DB_URL || 'mongodb://localhost:27017/RentSure')
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/auth', authRouter);

// Google Pay API Setup (Mocked for simplicity)
const googlePay = {
  verifyPayment: async (transactionId) => {
    // Replace with actual Google Pay API call
    return { status: 'SUCCESS', amount: 5000, transactionId };
  },
};

// Google Docs API Setup
const auth = new google.auth.GoogleAuth({
  keyFile: './credentials.json', // Replace with your Google API credentials
  scopes: ['https://www.googleapis.com/auth/documents'],
});
const docs = google.docs({ version: 'v1', auth });

// Ethereum Setup for Sepolia
const provider = new ethers.JsonRpcProvider(
  'https://sepolia.infura.io/v3/f16ab483c27145c29bff4a31842b2cf0'
); // Use Sepolia RPC URL
const wallet = new ethers.Wallet(
  '4813c75d1f1775ebc0a7dde2a28eb79ea4b092829afb645ece60ab105577e853',
  provider
);
const contractABI = [
  {
    inputs: [
      { internalType: 'address', name: '_landlord', type: 'address' },
      { internalType: 'address', name: '_tenant', type: 'address' },
      { internalType: 'uint256', name: '_rentAmount', type: 'uint256' },
      { internalType: 'uint256', name: '_leaseDuration', type: 'uint256' },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'tenant', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'PaymentReceived',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'landlord', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'timestamp', type: 'uint256' },
    ],
    name: 'PaymentReleased',
    type: 'event',
  },
  {
    inputs: [],
    name: 'endLease',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'isActive',
    outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'landlord',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'leaseEnd',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'payRent',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'releasePayment',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'rentAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tenant',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
]; // Replace with your contract's ABI
const contractAddress = '0x7E2789AD9C98E0655Ca335376b161bdE71Dbd4e9'; // Use the deployed contract address on Sepolia
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// MongoDB Schema
const transactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  tenantAddress: { type: String, required: true },
  landlordAddress: { type: String, required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  contractCid: { type: String },
  status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
});
const Transaction = mongoose.model('Transaction', transactionSchema);

// API Endpoints
app.post('/api/pay-rent', async (req, res) => {
  const { transactionId, tenantAddress, landlordAddress } = req.body;

  try {
    // Verify Google Pay transaction
    const payment = await googlePay.verifyPayment(transactionId);
    if (payment.status !== 'SUCCESS') {
      return res.status(400).json({ error: 'Payment verification failed' });
    }

    // Store transaction in MongoDB
    const transaction = new Transaction({
      transactionId,
      tenantAddress,
      landlordAddress,
      amount: payment.amount,
      status: 'SUCCESS',
    });
    await transaction.save();

    // Trigger smart contract payment (assumes funds converted to ETH/stablecoin)
    await contract.payRent({ value: ethers.parseEther((payment.amount / 100000).toString()) });

    res.json({ message: 'Payment processed', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/create-agreement', async (req, res) => {
  const { tenantName, landlordName, rentAmount, leaseDuration } = req.body;

  if (!tenantName || !landlordName || !rentAmount || !leaseDuration) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  console.log(tenantName, landlordName, rentAmount, leaseDuration);

  try {
    // Create Google Doc
    const doc = await docs.documents.create({
      requestBody: {
        title: `Rental Agreement - ${tenantName}`,
      },
    });

    // Update Doc with content
    await docs.documents.batchUpdate({
      documentId: doc.data.documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: `Rental Agreement\nTenant: ${tenantName}\nLandlord: ${landlordName}\nRent: ${rentAmount}\nDuration: ${leaseDuration} days`,
            },
          },
        ],
      },
    });

    // Store doc link or upload to IPFS (mocked here)
    const contractCid = `ipfs://mock-cid-${doc.data.documentId}`;

    res.json({ documentId: doc.data.documentId, contractCid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));