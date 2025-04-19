import express from "express";
import mongoose from "mongoose";
import { google } from "googleapis";
import { ethers } from "ethers";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js"; // Replace require with importt
import createDocsRoute from "./controllers/CreateDoc.js";
dotenv.config();
import crypto from "crypto";
import bodyParser from "body-parser";
import Payment from "./models/PaymentModel.js";
import User from "./models/UserModel.js";
import Landlord from "./models/LandlordModel.js";
import Property from "./models/PropertyModel.js";
import Tenant from "./models/TenantModel.js";

import contractABI from "./RentSure.json" assert { type: "json" };

import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
// Uncomment the following line if you want to connect to MongoDB
// connect();
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.use("/auth", authRouter);

// Google Pay API Setup (Mocked for simplicity)

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const auth = new google.auth.GoogleAuth({
  keyFile: "./service-account.json",
  scopes: [
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
  ],
});

// // Google Docs API Setup
// const auth = new google.auth.GoogleAuth({

//   keyFile: './service-account.json', // Replace with your Google API credentials
//   scopes: ['https://www.googleapis.com/auth/documents'],
// });
const docs = google.docs({ version: "v1", auth });

// app.use("/api/docs", createDocsRoute);

app.post("/api/docs/create", async (req, res) => {
  console.log("Request body:", req.body); // Log the request body for debugging
  try {
    const {
      propertyName,
      address,
      city,
      state,
      zip,
      tenantEmail,
      startDate,
      endDate,
      monthlyRent,
      securityDeposit,
      description,
    } = req.body;

    const authClient = await auth.getClient();
    const docs = google.docs({ version: "v1", auth: authClient });
    const drive = google.drive({ version: "v3", auth: authClient });

    const title = `Rental Agreement - ${propertyName}`;
    const formattedStartDate = new Date(startDate).toDateString();
    const formattedEndDate = new Date(endDate).toDateString();

    // Step 1: Check or create 'MyGeneratedDocs' folder
    const folderQuery = await drive.files.list({
      q: `mimeType='application/vnd.google-apps.folder' and name='MyGeneratedDocs' and trashed=false`,
      fields: "files(id)",
    });

    let folderId = folderQuery.data.files[0]?.id;

    if (!folderId) {
      const folder = await drive.files.create({
        resource: {
          name: "MyGeneratedDocs",
          mimeType: "application/vnd.google-apps.folder",
        },
        fields: "id",
      });
      folderId = folder.data.id;
    }

    // Step 2: Create document inside that folder
    const docMeta = await drive.files.create({
      resource: {
        name: title,
        mimeType: "application/vnd.google-apps.document",
        parents: [folderId],
      },
      fields: "id",
    });

    const documentId = docMeta.data.id;

    // Step 3: Insert formatted content into the document
    await docs.documents.batchUpdate({
      documentId,
      requestBody: {
        requests: [
          {
            insertText: {
              location: { index: 1 },
              text: `${title}\n\n`,
            },
          },
          {
            updateParagraphStyle: {
              range: {
                startIndex: 1,
                endIndex: title.length + 1,
              },
              paragraphStyle: { namedStyleType: "TITLE" },
              fields: "namedStyleType",
            },
          },
          {
            insertText: {
              location: { index: title.length + 2 },
              text:
                `Date: ${new Date().toDateString()}\n\n` +
                `Property Name: ${propertyName}\n` +
                `Address: ${address}, ${city}, ${state} ${zip}\n\n` +
                `Tenant Email: ${tenantEmail}\n` +
                `Lease Period: ${formattedStartDate} to ${formattedEndDate}\n\n` +
                `Monthly Rent: $${monthlyRent}\n` +
                `Security Deposit: $${securityDeposit}\n\n` +
                `Additional Terms:\n${description || "None"}\n\n\n` +
                `Landlord Signature: ______________________\n\n` +
                `Tenant Signature: ______________________`,
            },
          },
        ],
      },
    });

    res.status(200).json({
      message: "Document created successfully",
      documentId,
      url: `https://docs.google.com/document/d/${documentId}`,
    });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ error: "Failed to create document" });
  }
});

app.get("/generate-hash", async (req, res) => {
  console.log("Hello from hash generation endpoint");
  try {
    const docs = google.docs({ version: "v1", auth });
    const fileId = req.body.documentId; // Replace with your Google Doc ID

    // Fetch document content using Google Docs API
    const document = await docs.documents.get({
      documentId: fileId,
    });

    // Extract plain text content
    const content = document.data.body.content
      .map((block) =>
        block.paragraph?.elements?.map((el) => el.textRun?.content).join("")
      )
      .join("\n");

    // Generate SHA-256 hash
    const hash = crypto.createHash("sha256");
    hash.update(content);
    const hexHash = hash.digest("hex");
    console.log("Hash generated:", hexHash);
    res.json({ hash: hexHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("", async (req, res) => {
  console.log("Hello");
  res.status(201).json("hello");
});

app.post("/api/haveAccount", async (req, res) => {
  console.log("Hello", req.body);
  try {
    const user = await User.find(req.body);
    console.log("User found", user);
    if (!user) {
      return res.status(200).json({
        haveAccount: false,
        message: "User not found",
        user: { email: req.body.email },
      });
    } else if (user.length === 0) {
      return res.status(200).json({
        haveAccount: false,
        message: "User not found",
        user: { email: req.body.email },
      });
    }

    console.log("User found", user);
    return res
      .status(200)
      .json({ haveAccount: true, message: "User found", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//  app.post('api/createUser', async (req, res) => {
//   console.log("Hello")

//   try {
//     // const landlord = new Landlord( { req.body. } );
//     const user = new User(req.body);
//     await user.save();
//       res.status(200).send({ message: 'User created' });

//   } catch (error) {
//     // console.error('Error processing payment:', error);
//     res.status(500).send({ message: 'Internal server error', error });
//   }
//  });

app.post("/api/orders", async (req, res) => {
  const { amount, tenantId } = req.body;

  try {
    
    const payment = new Payment({
      propertyId : req.body.propertyId,
      tenantId: req.body.tenantId,
      amount: req.body.amount,
      status: req.body.status,
    });

    console.log(payment)
    await payment.save();
    res.status(200).send({ message: "Payment successful" });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// // Create Landlord
app.post("/api/landlords", async (req, res) => {
  try {
    // const landlord = new Landlord(req.body);
    const landlord = new Landlord({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      upiDetails: req.body.upiDetails,
    });
    await landlord.save();
    const user = new User({
      email: req.body.email,
      role: "landlord",
      userId: landlord._id,
    });
    await user.save();
    res.status(201).json(landlord);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get("/api/transactions" , async (req, res) =>{
  console.log("Fetching transaction")
  try {
    const transactions = await Payment.find()
    .sort({ createdAt: -1 });
    res.json(transactions)
  } catch (error) {
    console.error("Error ")
  }
}) 
 
// // Create Property for a Landlord
app.post("/api/properties", async (req, res) => {
  try {
    // const property = new Property(req.body);
    console.log("Properties", req.body);
    const property = new Property({
      name: req.body.propertyName,
      address: req.body.address,
      propertyType: req.body.propertyType,
      propertyArea: req.body.propertyArea,
      noOfRooms: req.body.noOfRooms,
      landlord: req.body.landlord,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      rentAmount: req.body.rentAmount,
      depositAmount: req.body.depositAmount,
      image: req.body.image,
      location: req.body.location,
    });
    await property.save();

    // Add property to landlord's properties array
    console.log("Property", property._id);
    await Landlord.findByIdAndUpdate(property.landlord, {
      $push: { properties: property._id },
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Landlords with their properties populated
app.get("/api/landlords", async (req, res) => {
  try {
    const landlords = await Landlord.find()
      .populate("properties")
      .sort({ createdAt: -1 });
    res.json(landlords);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get all Properties with landlord details
app.get("/api/properties", async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("landlord", "email upiDetails")
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/propertiesByLandlord", async (req, res) => {
  try {
   
    const properties = await Property.find({landlord : req.body.landlord});
 
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Update Rent Agreement for a Property
app.put("/api/properties/:id/agreement", async (req, res) => {
  try {
    const updateFields = {};

    // Construct update fields dynamically
    for (const key in req.body) {
      if (Object.keys(rentAgreementSchema.paths).includes(key)) {
        updateFields[`rentAgreement.${key}`] = req.body[key];
      }
    }

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Single Property with Agreement Details
app.get("/api/properties/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "landlord",
      "email upiDetails"
    );

    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }

    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Create Tenant
app.post("/api/tenants", async (req, res) => {
  try {
    // const tenant = new Tenant({req.body.email});
    // const tenant = new Tenant(req.body);
    const tenant = new Tenant({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      upiDetails: req.body.upiDetails,
    });
    await tenant.save();
    const user = new User({
      email: req.body.email,
      role: "tenant",
      userId: tenant._id,
    });
    await user.save();
    res.status(201).json(tenant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Tenants with populated data
app.get("/api/tenants", async (req, res) => {
  try {
    const tenants = await Tenant.find()
      .populate({
        path: "previousProperties.property",
        select: "address description",
      })
      .populate({
        path: "requestedProperties.property",
        select: "address description isAvailable",
      })
      .sort({ createdAt: -1 });

    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Handle property requests
app.post("/api/tenants/:id/requests", async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      { $push: { requestedProperties: req.body } },
      { new: true, runValidators: true }
    ).populate("requestedProperties.property");

    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    res.json(tenant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update request status
app.patch("/api/tenants/:tenantId/requests/:requestId", async (req, res) => {
  try {
    const tenant = await Tenant.findOneAndUpdate(
      {
        _id: req.params.tenantId,
        "requestedProperties._id": req.params.requestId,
      },
      { $set: { "requestedProperties.$.status": req.body.status } },
      { new: true }
    ).populate("requestedProperties.property");

    if (!tenant) {
      return res.status(404).json({ error: "Tenant or request not found" });
    }

    res.json(tenant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// /// BLockchain connectivity

// // Initialize Ethereum provider
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(
  process.env.SERVER_WALLET_PRIVATE_KEY,
  provider
);

// // Load RentSure contract ABI (generated from Solidity compilation)

const rentSureContract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

// // ========== API Endpoints ========== //

// /**
//  * 1. Store/Update Agreement Hash (Only Server can call)
//  */
app.post("/api/agreement", async (req, res) => {
  try {
    const { propertyId, documentHash } = req.body;

    // Validate input
    if (!propertyId || !documentHash) {
      return res.status(400).json({ error: "Missing parameters" });
    }

    // Call smart contract
    const tx = await rentSureContract.setAgreementHash(
      propertyId,
      ethers.keccak256(ethers.toUtf8Bytes(documentHash))
    );

    await tx.wait();
    res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// /**
//  * 2. Verify Agreement Hash
//  */
app.get("/api/agreement/verify", async (req, res) => {
  try {
    const { propertyId, documentHash } = req.query;
      const hash = ethers.keccak256(ethers.toUtf8Bytes(documentHash));
      
      const isVerified = await rentSureContract.verifyAgreement(propertyId, hash);
      console.log("isVerified", isVerified);
      res.json({ 
        verified: Boolean(isVerified),
        propertyId,
        documentHash: hash
      });
  } catch (error) {
    console.error("Error verifying agreement:", error);
    res.status(500).json({ error: error.message });
  }
});

// /**
//  * 3. Record Payment (Only Server can call)
//  */
app.post("/api/payment", async (req, res) => {
  try {
    const { propertyId, amount, tenantId } = req.body;
    const weiAmount = ethers.parseEther(amount.toString());
    
    const tx = await rentSureContract.recordPayment(propertyId, weiAmount, tenantId);
    const receipt = await tx.wait();
    
    res.json({ 
      success: true, 
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    });
    // res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// /**te
//  * 4. Get Payment History
//  */
app.post("/api/getPaymentsByProperty", async (req, res) => {
  try {
    const { propertyId } = req.body.propertyId;
    const paymentCount = await rentSureContract.getPaymentCount(propertyId);
    const count = Number(paymentCount);
    
    // const payments = [];
    // for (let i = 0; i < count; i++) {
    //   const payment = await rentSureContract.getPaymentDetails(propertyId, i);
    //   payments.push({
    //     amount: ethers.formatEther(payment.amount),
    //     timestamp: new Date(Number(payment.timestamp) * 1000),
    //     payer: payment.payer,
    //     reference: payment.paymentReference
    //   });
    // }
    // const count = 10;
    res.json({ 
      propertyId,
      // payments,
      count
    });
    

   
  } catch (error) {
    console.error( "Error while fetching payments ", error)
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port 5000"));
