const express = require ('express');



// Router
const router = express.Router();

// http://localhost:8000/personalities
router.get('/', (req,res) => {
    res.send('Personalities')
});

router.get('/of:type', (req, res) => {
    res.send(`Schema of ${req.params.type}`);
});




// i forgot to make a repo oops
module.exports = router;
