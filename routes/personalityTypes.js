const express = require ('express');
const axios = require ('axios');
// trying to connect to mongo database
const { connectToDatabase } = require('./conn');

const Analysts = require('./analystType')





// Router Logic
const router = express.Router();

// Middleware to ensure MongoDB connection for each request
router.use(async (req, res, next) => {
    try {
        req.dbClient = await connectToDatabase();
        next();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.get('/', (req,res) => {
    res.send('Personalities')
});


// tried to load an image to test if json data is the problem but it's not working oh no
// router.get('/image', async (req, res) => {
//     try {
//         const imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpdxvGoi_6REAgpgT9TNfSqcEf_Vfx2vqtRg&usqp=CAU';
//         const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
//         const imageData = Buffer.from(imageResponse.data, 'binary').toString('base64');
//         const dataUrl = `data:image/png;base64,${imageData}`;
        
//         res.send(`<img src="${dataUrl}" alt="External Image">`);
//     } catch (error) {
//         console.error('Error fetching image:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

async function connectAndLog() {
    const connected = await connectToDatabase();
    console.log('Connected to MongoDB');
}


connectAndLog();



async function getAllPersonalities() {
    try {
        const client = await connectToDatabase();
        const collection = client.db('personalityTypes').collection('personalities');
        const allPersonalities = await collection.find().toArray();
        return allPersonalities;
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        throw error;
    }
}
// http://localhost:8000/personalities/all
// Route to get all personalities
router.get('/all', async (req, res) => {
    try {
        const personalityData = await getAllPersonalities();
        res.json(personalityData);
    } catch (error) {
        console.error('Error in /all route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/analysts', (req, res) => {
    console.log('Accessed /analysts route');
    try {
        res.json(Analysts);
    } catch (error) {
        console.error('Error in /analysts route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/schema/all', async (req, res) => {
    try {
        const schemaData = await getAllSchemaData();
        res.json(schemaData);
    } catch (error) {
        console.error('Error in /schema/all route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getAllSchemaData() {
    try {
        const client = await connectToDatabase();
        const collection = client.db('personalityTypes').collection('schema');
        const allSchemaData = await collection.find().toArray();
        return allSchemaData;
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        throw error;
    }
}


router.get('/users/all', async (req, res) => {
    try {
        const userData = await getAllUsers();
        res.json(userData);
    } catch (error) {
        console.error('Error in /users/all route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getAllUsers() {
    try {
        const client = await connectToDatabase();
        const collection = client.db('personalityTypes').collection('users');
        const allUsers = await collection.find().toArray();
        return allUsers;
    } catch (error) {
        console.error('Error fetching data from MongoDB:', error);
        throw error;
    }
}

router.post('/users', async (req, res) => {
    try {
        const { name, species } = req.body;  
        console.log('Received user data:', { name, species });
        const result = await createUser({ name, species });
        console.log('Result of MongoDB post:', result);
        res.json(result);
    } catch (error) {
        console.error('Error in /users route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function createUser(user) {
    try {
        const client = await connectToDatabase();
        const collection = client.db('personalityTypes').collection('users');
        const result = await collection.insertOne(user);
        return result;
    } catch (error) {
        console.error('Error creating user in MongoDB:', error);
        throw error;
    }
}

// userId allows specifying of which user to delete 
router.delete('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const result = await deleteUser(userId);
        res.json(result);
    } catch (error) {
        console.error('Error in /users/:userId route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function deleteUser(userId) {
    try {
        const client = await connectToDatabase();
        const collection = client.db('personalityTypes').collection('users');
        const result = await collection.deleteOne({ _id: ObjectId(userId) });
        return result;
    } catch (error) {
        console.error('Error deleting user in MongoDB:', error);
        throw error;
    }
}
module.exports = router;
