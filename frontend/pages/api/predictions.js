// /pages/api/predictions.js
import { MongoClient } from 'mongodb';

// MongoDB connection URI
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Connect to the MongoDB cluster
    await client.connect();
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
  } finally {
    // Close the connection when done
    await client.close();
  }
}
