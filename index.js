const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
const personalityRoutes = require('./routes/personalityTypes');
const Analysts = require('./routes/analystType')
// const Analysts = require('./routes/analystType')
const PORT = 8000;
const app = express();






// Middleware that logs requests
const logger = (req, res, next) => {
    const time = new Date();

    console.log(
    `${time.toLocaleTimeString()}`
    );
    console.log(`Request was made at${req.method} ${req.url}`);
    console.log(1);
    next();
};

// Couldn't load JSON data without this before I think
// Content Security Policy
// app.use((req, res, next) => {
//     res.setHeader('Content-Security-Policy', 'default-src \'self\'; img-src \'self\' data:;');
//     next();
// });
app.use((req, res, next) => {
    // Set a very permissive CSP header
    res.setHeader('Content-Security-Policy', 'default-src *');
    next();
});


app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // express.json allows us to send json data 
// Logger middleware
app.use(logger);


// Routes 
// // http://localhost:8000/personalities this just says Personalities :P
// http://localhost:8000/personalities/all  Reveals collection data for three types within it
// http://localhost:8000/analysts  to get all analyst types
// http://localhost:8000/personalities/schema/all to see the types schemas of mind
// http://localhost:8000/personalities/users/all use this URL for accessing user data
// http://localhost:8000/personalities/users use this URL for POST requests
// http://localhost:8000/personalities/users/65b4d59d8b15106264eb8ad2 use this URL for deleting a user (change the example numbers to user ID)

app.use('/personalities', personalityRoutes);

app.get('/analysts', (req, res) => {
    console.log('Accessed /analysts route');
    try {
        res.json(Analysts);
    } catch (error) {
        console.error('Error in /analysts route:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

















app.listen(PORT, () => console.log(`Server up at ${PORT}`))