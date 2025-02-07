import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();

// Update CORS configuration to be more permissive
app.use(cors({
    origin: '*', // Be careful with this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({
    limit: '10mb' // Increase payload limit if needed
}));

const uri = "mongodb+srv://aymenbtr33:aymenisnumber01@cluster0.e5tdt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
}

connectDB();

// On your server
app.post('/api/contacts', async (req, res) => {
    try {
        console.log('Received request:', req.body); // Log incoming request
        
        const { full_name, email, subject, message } = req.body;
        
        // Validate required fields
        if (!full_name || !email || !subject || !message) {
            console.log('Missing required fields:', { full_name, email, subject, message });
            return res.status(400).json({
                status: 'error',
                message: 'All fields are required'
            });
        }

        const database = client.db('user');
        const contacts = database.collection('contact');

        const contact = {
            full_name,
            email,
            subject,
            message,
            created_at: new Date(),
            user_agent: req.headers['user-agent'], // Log user agent
            ip_address: req.ip // Log IP address
        };

        console.log('Attempting to save contact:', contact);

        const result = await contacts.insertOne(contact);
        console.log('Save result:', result);

        res.json({
            status: 'success',
            message: 'Message sent successfully',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to send message',
            error: error.message
        });
    }
});
