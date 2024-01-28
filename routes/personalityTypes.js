const express = require ('express');
const { ObjectId } = require('mongodb');
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

// nvm scratch that IT'S WORKING commented below out no need this:)
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
// analyst file
router.get('/analysts', (req, res) => {
    console.log('Accessed /analysts route');
    try {
        res.json(Analysts);
    } catch (error) {
        console.error('Error in /analysts route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Send schema collection as json
router.get('/schema/all', async (req, res) => {
    try {
        const schemaData = await getAllSchemaData();
        res.json(schemaData);
    } catch (error) {
        console.error('Error in /schema/all route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Schema collection fn
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
// Return all users fn
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
// Route for user to insert data
// {"name": "Topao",
// "person": "Monk"}   This won't work when posting data, you need name and species.
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
// Create User
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
// Delete user
async function deleteUser(userId) {
    try {
        const client = await connectToDatabase();
        const collection = client.db('personalityTypes').collection('users');
        const result = await collection.deleteOne({ _id: new ObjectId(userId) });
        return result;
    } catch (error) {
        console.error('Error deleting user in MongoDB:', error);
        throw error;
    }
}
// Update a user by its ID
// http://localhost:8000/personalities/users/65b68bd04baec9a6d2b4a1a5 Can use this in postman to test patch , Modifies user 'Ornn' :)
router.patch('/users/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUserData = req.body;

        const result = await updateUser(userId, updatedUserData);
        res.json(result);
    } catch (error) {
        console.error('Error in /users/:userId route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function updateUser(userId, updatedUserData) {
    try {
        const client = await connectToDatabase();
        const collection = client.db('personalityTypes').collection('users');
        
        const objectId = new ObjectId(userId); // Convert userId to ObjectId

        const result = await collection.updateOne(
            { _id: objectId },
            { $set: updatedUserData }
        );

        return result;
    } catch (error) {
        console.error('Error updating user in MongoDB:', error);
        throw error;
    }
}

router.get('/seed', async (req, res) => {
    try {
        // Access the database instance from req object
        const db = req.dbClient.db('personalityTypes');
        const collection = db.collection('schema');

        // Delete existing data
        await collection.deleteMany({});

        // Insert hardcoded data
        const dataToInsert =[
            {
                "_id": "65b338ea5c4a594258d56029",
                "Acronym": "INFJ",
                "description": "Colloquially known as 'the advocate' or 'the idealist' type, the acronym 'INFJ' stands for 'introverted, intuitive, feeling, judging.' Carl Jung, Eleanor Roosevelt, and Martin Luther King, Jr. had INFJ personality types. INFJ types are compassionate, idealistic, and likely to form close bonds with people.",
                "power": "Introspection"
            },
            {
                "_id": "65b4bd507c364f2ed82d2666",
                "Acronym": "INFP",
                "description": "The INFP personality type is Introverted, iNtuitive, Feeling, and Perceiving, which means they are energized by time alone, focused on big picture ideas and concepts, led by their values and feelings, and spontaneous and flexible.",
                "power": "Mediator"
            },
            {
                "_id": "65b4bdc17c364f2ed82d2668",
                "Acronym": "ENFJ",
                "description": "ENFJs have great people skills and are often warm, affectionate, and supportive. ENFJs are great at encouraging others and derive personal satisfaction from helping others. ENFJs are not selfish and are often so interested in devoting their time to others that they can neglect their own needs.",
                "power": "Inspiration"
            },
            {
                "_id": "65b4e1267c364f2ed82d2681",
                "Acronym": "ENFP",
                "description": "ENFP is a personality type with the Extraverted, Intuitive, Feeling, and Prospecting traits. These people tend to embrace big ideas and actions that reflect their sense of hope and goodwill toward others. Their vibrant energy can flow in many directions.",
                "power": "Resonance"
            },
            {
                "_id": "65b4e1a07c364f2ed82d2683",
                "Acronym": "ISTJ",
                "description": "ISTJ (Logistician) is a personality type with the Introverted, Observant, Thinking, and Judging traits. These people tend to be reserved yet willful, with a rational outlook on life. They compose their actions carefully and carry them out with methodical purpose.",
                "power": "Extrapolation"
            },
    
            {
                "id": 1,
                "title": "INTJ",
                "category": "The Architect",
                "views": "Imaginative and strategic thinkers, with a plan for everything."
            },
            {
                "id": 2,
                "title": "INTP",
                "category": "The Logician",
                "views": "Innovative inventors with an unquenchable thirst for knowledge."
            },
            {
                "id": 3,
                "title": "ENTJ",
                "category": "The Commander",
                "views": "Bold, imaginative and strong-willed leaders, always finding a way - or making one."
            },
            {
                "id": 4,
                "title": "ENTP",
                "category": "The Debater",
                "views": "Smart and curious thinkers who cannot resist an intellectual challenge."
            },
        
            {
                "_id": "65b4c0847c364f2ed82d266c",
                "Acronym": "INFJ",
                "Schema": "Treat people as if they were what they ought to be and you help them to become what they are capable of being."
            },
            {
                "_id": "65b4c0b87c364f2ed82d266e",
                "Acronym": "INFP",
                "Schema": "All that is gold does not glitter; not all those who wander are lost; the old that is strong does not wither; deep roots are not reached by the frost."
            },
            {
                "_id": "65b4c0da7c364f2ed82d2670",
                "Acronym": "ENFJ",
                "Schema": "When the whole world is silent, even one voice becomes powerful."
            },
            {
                "_id": "65b4e2377c364f2ed82d2685",
                "Acronym": "ENFP",
                "Schema": "It doesnt interest me what you do for a living. I want to know what you ache for and if you dare to dream of meeting your hearts longing"
            },
            {
                "_id": "65b4e2757c364f2ed82d2687",
                "Acronym": "ISTJ",
                "Schema": "Id be more frightened by not using whatever abilities Id been given. Id be more frightened by procrastination and laziness."
            },
    
            {
                "_id": "65b4c3257c364f2ed82d2673",
                "name": "IE3000",
                "species": "Droid"
            },
            {
                "_id": "65b4c9d9b17934cfe94c738a",
                "name": "LingeringWisdom",
                "species": "Fairy"
            },
            {
                "_id": "65b4cab7b17934cfe94c738b",
                "name": "Poelin",
                "species": "Alchemist"
            },
            {
                "_id": "65b4cb9ca80f1266256f3964",
                "name": "Ornn",
                "species": "Goliath"
            },
            {
                "_id": "65b4ceea62367dd7ed5f6e9b",
                "name": "Topao",
                "species": null
            },
            {
                "_id": "65b4d4f354467ad5c6f4482d",
                "name": "Heale",
                "species": "Angel"
            }
        ];

        await collection.insertMany(dataToInsert);

        res.json({ message: 'Database seeded successfully', data: dataToInsert });
    } catch (err) {
        console.error('Error seeding database:', err);
        res.status(500).send('Something went wrong.');
    }
});

module.exports = router;
