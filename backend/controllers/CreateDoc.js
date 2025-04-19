import express from "express";
import { google } from "googleapis";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "../service-account.json"),
  scopes: [
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/drive",
  ],
});

router.post("/create", async (req, res) => {
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

export default router;
