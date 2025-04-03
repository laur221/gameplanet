const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configurare conexiune MongoDB
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/mangobank";
console.log("Connecting to database...");

// Opțiuni conexiune MongoDB pentru mai multă stabilitate cu Atlas
const clientOptions = {
    connectTimeoutMS: 30000, // 30 secunde
    socketTimeoutMS: 45000,  // 45 secunde
    retryWrites: true,
    retryReads: true,
    serverSelectionTimeoutMS: 5000 // 5 secunde
};

const client = new MongoClient(uri, clientOptions);
let db;

// Conectare la baza de date MongoDB
async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db("mangobank");
        console.log("Connected to MongoDB database.");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1);
    }
}

connectToDatabase();

// Endpoint de testare pentru a verifica conexiunea la baza de date
app.get('/api/health', async (req, res) => {
    try {
        // Verifică conexiunea executând o comandă simplă
        await db.command({ ping: 1 });
        res.status(200).json({ 
            status: 'success',
            message: 'Connected to MongoDB',
            time: new Date()
        });
    } catch (err) {
        res.status(500).json({ 
            status: 'error',
            message: 'Database connection error',
            error: err.message
        });
    }
});

// Înregistrare utilizator
app.post('/api/register', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) return res.status(400).send('All fields are required.');

        // Verifică dacă utilizatorul există deja
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) return res.status(400).send('User already exists with this email.');

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({
            fullName,
            email,
            password: hashedPassword,
            isAdmin: false,
            balance: 1000, // Sold inițial de 1000
            createdAt: new Date()
        });

        res.status(201).send('User registered successfully.');
    } catch (err) {
        res.status(500).send('Error registering user: ' + err.message);
    }
});

// Autentificare utilizator
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email });
        
        if (!user) return res.status(404).send('User not found.');
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).send('Invalid credentials.');

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, 
                              process.env.JWT_SECRET || 'secretKey', 
                              { expiresIn: '1h' });
        
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).send('Database error: ' + err.message);
    }
});

// Obține datele utilizatorului
app.get('/api/user', async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).send('Access denied.');

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
        const user = await db.collection('users').findOne(
            { _id: new ObjectId(decoded.id) },
            { projection: { password: 0 } } // excludem parola din răspuns
        );
        
        if (!user) return res.status(404).send('User not found.');
        res.status(200).json(user);
    } catch (err) {
        res.status(400).send('Invalid token or database error: ' + err.message);
    }
});

// Transferă bani între conturi
app.post('/api/transfer', async (req, res) => {
    try {
        const { senderEmail, recipientEmail, amount, note } = req.body;
        const amountNum = parseFloat(amount);
        
        if (!senderEmail || !recipientEmail || isNaN(amountNum) || amountNum <= 0) {
            return res.status(400).send('Invalid transfer data.');
        }

        const session = client.startSession();
        
        try {
            session.startTransaction();
            
            // Găsim utilizatorii
            const sender = await db.collection('users').findOne({ email: senderEmail });
            const recipient = await db.collection('users').findOne({ email: recipientEmail });
            
            if (!sender || !recipient) {
                await session.abortTransaction();
                return res.status(404).send('Sender or recipient not found.');
            }
            
            if (sender.balance < amountNum) {
                await session.abortTransaction();
                return res.status(400).send('Insufficient funds.');
            }
            
            // Actualizăm soldurile
            await db.collection('users').updateOne(
                { _id: sender._id },
                { $inc: { balance: -amountNum } }
            );
            
            await db.collection('users').updateOne(
                { _id: recipient._id },
                { $inc: { balance: amountNum } }
            );
            
            // Înregistrăm tranzacția
            await db.collection('transactions').insertOne({
                senderEmail,
                recipientEmail,
                amount: amountNum,
                note,
                timestamp: new Date()
            });
            
            await session.commitTransaction();
            res.status(200).send('Transfer completed successfully.');
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    } catch (err) {
        res.status(500).send('Error processing transfer: ' + err.message);
    }
});

// Obține istoricul tranzacțiilor pentru un utilizator
app.get('/api/transactions/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const transactions = await db.collection('transactions')
            .find({ 
                $or: [
                    { senderEmail: email },
                    { recipientEmail: email }
                ]
            })
            .sort({ timestamp: -1 })
            .toArray();
        
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).send('Error fetching transactions: ' + err.message);
    }
});

// Pornire server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// Gestionează închiderea elegantă
process.on('SIGINT', async () => {
    await client.close();
    console.log('MongoDB connection closed.');
    process.exit(0);
});
