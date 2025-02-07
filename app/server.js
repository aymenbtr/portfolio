import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

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

app.post('/api/contacts', async (req, res) => {
    try {
        const { full_name, email, subject, message } = req.body;
        
        // Validate required fields
        if (!full_name || !email || !subject || !message) {
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
            created_at: new Date()
        };

        const result = await contacts.insertOne(contact);

        res.json({
            status: 'success',
            message: 'Message sent successfully',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Error saving contact:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to send message'
        });
    }
});

// Add the GET /api/contacts route
app.get('/api/contacts', async (req, res) => {
    try {
        const database = client.db('user');
        const contacts = database.collection('contact');
        const allContacts = await contacts.find().sort({ created_at: -1 }).toArray();
        res.json(allContacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Failed to fetch contacts' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
