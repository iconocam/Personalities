const { MongoClient } = require('mongodb');
// i dont upload this to github right ... my mongo acc stuff
const mongoURI = 'mongodb+srv://iconocam0713:dkBZHwp9NGnjhJh3@cluster01.jfj1uyy.mongodb.net/personalityTypes';
const client = new MongoClient(mongoURI);

async function connectToDatabase() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = { connectToDatabase };