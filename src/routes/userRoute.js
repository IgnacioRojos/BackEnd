const express = require('express'); const router = express.Router(); const User = require('../models/user');

router.post('/users', async (req, res) => { 
    try { 
        const user = new User(req.body); 
        await user.save(); 
        res.status(201).send(user); 

    } catch (err) { 
        res.status(400).send(err); 
    } 
});

router.get('/users', async (req, res) => { 
    try { 
        const users = await User.find(); 
        res.status(200).send(users); 
    } catch (err) { 
        res.status(500).send(err); 
    } 
});

router.put('/users/:id', async (req, res) => { 
    try { 
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); 
            if (!user) { 
                return res.status(404).send(); 
            } res.send(user); 
    } catch (err) { 
        res.status(400).send(err); 
    } 
});

router.delete('/users/:id', async (req, res) => { 
    try { 
        const user = await User.findByIdAndDelete(req.params.id); 
        if (!user) { return res.status(404).send(); } res.send(user); 
    } catch (err) { 
        res.status(500).send(err); 
    } 
});

module.exports = router;