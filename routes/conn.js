const { MongoClient } = require('mongodb');
// i dont upload this to github right ... my mongo acc stuff
const mongoURI = 'mongodb+srv://iconocam0713:dkBZHwp9NGnjhJh3@cluster01.jfj1uyy.mongodb.net/personalityTypes';
const client = new MongoClient(mongoURI);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const db = client.db('personalityTypes');

        // validation rule for the 'users' collection
        await db.command({
            collMod: 'users',
            validator: {
                $jsonSchema: {
                    bsonType: 'object',
                    required: ['name', 'species'],
                    properties: {
                        name: {
                            bsonType: 'string',
                            description: 'Name must be a string and is required',
                        },
                        species: {
                            bsonType: 'string',
                            description: 'Species must be a string and is required',
                        },
                        
                    },
                },
            },
        });
        // creating an ascending index on 'name' field in users collection -1 would be descending while 1 indicates ascending

        // db.users.find({ name: "IE3000" }).explain("executionStats"); in mongoDB shell to check index query statistics,  it is working
        // added species on there to make it efficient and dynamic search query
        await db.collection('users').createIndex({ name: 1, species: 1 });

        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}
// Query for names('IE3000', 'Poelin', 'LingeringWisdom', 'Ornn', Topao, Heale)
async function performDatabaseOperations() {
    try {
    
        const client = await connectToDatabase();

    
        const db = client.db('personalityTypes');
        const result = await db.collection('users').find({ name: 'LingeringWisdom' }).toArray();
        
        
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
        
    }
}

// Call the function to perform database operations
performDatabaseOperations();
module.exports = { connectToDatabase };