const express = require('express')
const personalityRoutes = require('./routes/personalityTypes');
const PORT = 8000;
const app = express();

// Middleware that logs requests
function logger (req,res, next) {
    console.log(`[${Date.now()}] ${req.method} ${req.url}`); next();
}

app.use('/personalities', personalityRoutes);
app.use(logger);













app.listen(PORT, () => console.log(`Server up at ${PORT}`))