// require("dotenv/config");
// const express = require('express');
// const multer = require('multer');
// const { BlobServiceClient } = require('@azure/storage-blob');

// // Set up Multer to handle file uploads (store in memory)
// const upload = multer({ storage: multer.memoryStorage() });

// app.post('/upload', upload.single('file'), async (req, res) => {
//     const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
//     const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_BLOB_CONTAINER);
//     const blockBlobClient = containerClient.getBlockBlobClient(req.file.originalname);

//     try {
//         // Upload the blob to Azure Blob Storage
//         await blockBlobClient.uploadData(req.file.buffer, {
//             blobHTTPHeaders: { blobContentType: req.file.mimetype }
//         });

//         console.log(`Recording uploaded successfully. Blob URL: ${blockBlobClient.url}`);
//         res.status(200).json({ message: 'File uploaded successfully', fileUrl: blockBlobClient.url });
//     } catch (err) {
//         console.error('Error uploading to Azure Blob Storage:', err);
//         res.status(500).json({ message: 'Error uploading file to Azure Blob Storage' });
//     }
// });

