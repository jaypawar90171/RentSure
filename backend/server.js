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
import RentOut from "./models/RentOutModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Property from "./models/PropertyModel.js";
import Tenant from "./models/TenantModel.js";
import Signature from "./models/SingnatureModel.js";
import contractABI from "./RentSure.json" assert { type: "json" };
import Maintenance from "./models/MaintenanceSchema.js";
import path from "path";
import { fileURLToPath } from "url";
const API_KEY = process.env.GEMINI_API_KEY;

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

app.get('/', (req, res) => {
  res.json({
    activeStatus: true,
    error: false
  });
});

// Google Pay API Setup (Mocked for simplicity)

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.SERVICE_ACCOUNT,
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

app.post("/generate-hash", async (req, res) => {
  console.log("Hello from hash generation endpoint", req.body); // Log the request body for debugging
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

    await Property.findByIdAndUpdate( req.body.propertyId , { documentHash: hexHash });
    console.log("Hash Added to property")
    res.status(200).json({ hash: hexHash });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("", async (req, res) => {
  console.log("Hello");
  res.status(201).json("hello");
});


app.get("/api/maintenance/:userId", async (req, res) => {

  try {
    const maintenance = await Maintenance.find( { landlordId :req.params.userId });
    res.status(200).json( maintenance );
  }catch(error) {
      res.status(400).json({ error: error.message });
    }


});

app.post("/api/maintenance", async (req, res) => {
  try {

    const maintenance = new Maintenance.create({title : req.body.title , description : req.body.description , propertyId : req.body.propertyId , tenantId : req.body.tenantId }); 
    await maintenance.save();

    res.status(200).json("Hello form saved successfully", maintenance);
  }catch(error) {
      res.status(400).json({ error: error.message });
    }
})


app.post("/api/rentOut", async (req, res) => {
  try {
    // res.status(200).json("Hello from RentOut endpoint");
    console.log("Hello from RentOut endpoint", req.body); // Log the request body for debugging
    const rentOut = new RentOut({
      propertyId: req.body.propertyId,
      tenantId: req.body.tenantId,
      // landlordId: req.body.landlordId,
    });
    await rentOut.save();

    await Property.findByIdAndUpdate(
      req.body.propertyId,
      { isAvailable: false },
    );

    console.log("Property updated to unavailable");
    res.status(200).json("Property updated to unavailable");
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
 })

 app.post("/api/propertiesByLandlord", async (req, res) => { 
  console.log("Hello from getPropertyBylandlord endpoint", req.body); // Log the request body for debugging
  try {
    console.log("User ID", req.body.userId);
    const landlord = await Landlord.findById(req.body.userId);

    console.log(landlord)
      res.status(200).json(landlord.properties);
  }catch (error) {  console.error("Error fetching property by tenant:", error);
    res.status(500).json({ error: "Server error" });
 } });


 app.post("/api/getPropertyByTenantId", async (req, res) => { 
  console.log("Hello from getPropertyByTenant endpoint", req.body); // Log the request body for debugging
  try {
    const rentOut = await RentOut.find({ tenantId: req.body.tenantId })
      .populate("propertyId");

      const property = await Property.findById(rentOut[0].propertyId);
      console.log("Property", property);
      res.status(200).json(property);
  }catch (error) {  console.error("Error fetching property by tenant:", error);
    res.status(500).json({ error: "Server error" });
 } });

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

app.post("/api/payRent", async (req, res) => {
 
  try {
    
    const payment = new Payment({
      propertyId : req.body.propertyId,
      tenantId: req.body.tenantId,
      amount: req.body.amount,
      status: req.body.status,
    });
    console.log("Hello")
    console.log("Payment" , payment)
    await payment.save();
    res.status(200).send({ message: "Payment successful" });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});


app.post("/api/payDeposit", async (req, res) => {
  // const { amount, tenantId } = req.body;

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

app.get("/api/transactions" , async (req , res) => { 
  try{
    const transactions = await Payment.find();
    console.log("Transactions", transactions);
  
    res.json(transactions);
  }catch (error) {
    res.status(500).json({ error: "Server error" });
  }
 
}) 


app.get("/api/transactions/:propertyId/:userId" , async (req , res) => { 
  console.log("Hello from transactions endpoint", req.params); // Log the request body for debugging
  try{
    const transactions = await Payment.find({  propertyId : req.params.propertyId, tenantId : req.params.userId });
    // console.log("Transactions", transactions); 
    
    res.status(200).json(transactions);
  }catch (error) {
    res.status(500).json({ error: "Server error" });
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
    console.log("Property ID", propertyId);
    console.log("Document Hash", documentHash);
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
app.post("/api/agreement/verify", async (req, res) => {
  try {
    const { propertyId, documentHash } = req.body;
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
    console.log("Payment on Blockchain" , req.body); // Log the request body for debugging
    const { propertyId, amount, tenantId } = req.body;
    console.log("Property ID", propertyId);
    console.log("Tenant ID", tenantId);
    console.log("Amount", amount);
    const weiAmount = ethers.parseEther(amount.toString());
    
    const tx = await rentSureContract.recordPayment(propertyId, weiAmount, tenantId);
    const receipt = await tx.wait();
    
    res.status(200).json({ 
      success: true, 
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    });
    // res.json({ success: true, txHash: tx.hash });
  } catch (error) {
    res.status(500).json({ err : error, error: error.message });
  }
});

// /**te
//  * 4. Get Payment History
//  */
app.post("/api/getPaymentsByProperty", async (req, res) => {
  try {
   
    console.log("Property ID", req.body.propertyId);
    const payments = await rentSureContract.getPaymentDetails(req.body.propertyId);
  
    console.log("Payments", payments);

    const parsedPayments = payments.map(p => ({
      amount: p.amount.toString(),   // convert BigInt to string
      tenantId: p.tenantId
    }));

    // res.json(parsedPayments);
   
    res.status(200).json(parsedPayments);
  } catch (error) {
    console.error( "Error while fetching payments ", error)
    res.status(500).json({ error: error.message });
  }
});





app.post('/api/signatures',(req, res) => {
  // const {  userId, signatureImage   } = { userId : req.body.userId, signatureImage : req.body.signatureImage};
  // console.log("Signature data", req.body); // Log the request body for debugging
  // console.log("Signature data", userId, signatureImage); // Log the request body for debugging
  if (!req.body.userId || !req.body.signatureImage) {
    const { userId, signatureImage } = req.body;
    console.log("Signature data", userId, signatureImage); // Log the request body for debugging
    return res.status(400).json({ error: 'User ID and signature image are required' });
    // return res.status(400).json({ error: 'Signature data is required' });
  }
  const newSignature = new Signature({ userId : req.body.userId , signatureImage : req.body.signatureImage });
  newSignature.save()
    .then(() => res.status(201).json(newSignature))
    .catch((error) => res.status(500).json({ error: 'Server error', details: error.message }));

});

app.get('/api/signatures', (req, res) => {
  Signature.find()
    .sort({ createdAt: -1 })
    .then((signatures) => res.json(signatures))
    .catch((error) => res.status(500).json({ error: 'Server error', details: error.message }));
});





//gemini
const genAI = new GoogleGenerativeAI(API_KEY);
const systemInstruction = `
You are RentSure Assistant, an expert in Indian rental regulations. You exclusively:
- Provide information about rental agreements and lease terms under Indian law
- Explain tenant rights and landlord obligations as per Indian regulations
- Clarify rental documentation requirements specific to Indian states
- Reference relevant Indian laws (Rent Control Act, state-specific regulations)
- Offer neutral, factual information without legal counsel
- Politely decline to answer non-rental related queries

*Examples:*

<example>
*User:* What's the maximum security deposit allowed in Maharashtra?
*Response:*  
\\\`json
{
    "text": "In Maharashtra, the security deposit is typically limited to:
    - 3 months' rent for residential properties
    - 6 months' rent for commercial properties
    As per the Maharashtra Rent Control Act 1999. Always verify current limits as regulations may update."
}
\\\`
</example>

<example>
*User:* How to terminate a rental agreement early?
*Response:*  
\\\`json
{
    "text": "Early termination in India typically requires:
    1. Mutual consent between tenant and landlord
    2. Notice period as per agreement (usually 1-2 months)
    3. Valid reasons per agreement clauses
    Review your specific rental agreement and consult the Transfer of Property Act 1882 Section 106."
}
\\\`
</example>

<example>
*User:* Tell me about stock markets
*Response:*  
\\\`json
{
    "text": "I specialize in Indian rental matters. For financial advice, please consult a certified financial expert."
}
\\\`
</example>

*IMPORTANT:* 
- Cite specific Indian laws/acts when possible
- Highlight regional variations between states
- Never provide legal advice - recommend consulting legal professionals
- Maintain neutral, professional tone
`;

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.4
  }
});

app.post('/api/generate', async (req, res) => {
  console.log("Received request body:", req.body); // Log incoming request

  // 1. Get the prompt from the request body
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required in the request body' });
  }

  try {
    // 2. Call the Gemini API
    console.log(`Sending prompt to Gemini: "${prompt}"`);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("Received response from Gemini:", text);

    // 3. Send the response back to the React frontend
    res.json({ response: text });

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Provide a more generic error message to the client
    res.status(500).json({ error: 'Failed to generate content from Gemini API' });
  }
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port 5000"));
