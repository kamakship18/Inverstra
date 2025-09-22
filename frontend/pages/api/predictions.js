// /pages/api/predictions.js
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

let client;
let clientPromise;

if (!uri) {
  throw new Error('Please add your Mongo URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {

  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {

  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  let client;
  try {
    // Connect to the MongoDB cluster
    client = await clientPromise;
    const database = client.db('inverstra');
    const predictions = database.collection('predictions');
    
    // Validate the required fields
    const { 
      predictionText, 
      reasoning, 
      sources, 
      perplexityCheck, 
      createdBy, 
      createdAt 
    } = req.body;
    
    if (!predictionText || !reasoning) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Insert the prediction document
    const prediction = {
      predictionText,
      reasoning,
      sources: sources || [],
      perplexityCheck: perplexityCheck || { summary: '', confidenceLevel: '' },
      createdBy: createdBy || 'Anonymous',
      createdAt: createdAt || new Date().toISOString(),
      status: 'pending' // Additional field for tracking status
    };
    
    const result = await predictions.insertOne(prediction);
    
    return res.status(201).json({ 
      success: true, 
      message: 'Prediction saved to MongoDB',
      id: result.insertedId
    });
  } catch (error) {
    console.error("Error saving prediction to MongoDB:", error);
    return res.status(500).json({ 
      error: 'Error saving prediction',
      details: error.message
    });
  }
}
