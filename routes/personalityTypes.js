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

module.exports = router;
