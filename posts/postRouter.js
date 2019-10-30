const express = require('express');

const router = express.Router();

const db = require('./postDb')
const Posts = require('../posts/postDb.js');

// router.get('/', (req, res) => {

// });

// router.get('/:id', (req, res) => {

// });

// router.delete('/:id', async(req, res) => {

// });

// router.put('/:id', (req, res) => {

// });

// // custom middleware

// function validatePostId(req, res, next) {

// };




// router.get('/', async )

router.get('/:id', validateUserId, async(req,res) => {
    //can get req.user b/c it's being passed in validateUserId!
    res.status(200).json(req.user);
    //error handling done in validateUserId!
})


router.post('/', validateUser, async (req,res) => {
    try{
        //try replaces .then but it includes success and what you want to do wihtin the try
        const newUser = await db.insert(req.body); //this is not possible in .then but now we can save the callback from async into a variable
        //if successful, send info to client. Note, we don't need to check in this ex., since we have the catch. But makes it 
        //easier to read! :) 
        if(newUser) {
            res.status(201).json(newUser);
        }
    }
    catch(error){
        //constraint for new user needing to be unique! so still need catch
        res.status(500).json({message: `error creating the user`})
    }
})


router.delete('/:id', validateUserId, async(req,res) => {
    const {id} = req.params;
    try {
        //getting user
        const user = await db.getById(id);
        //if else IS IMPORTANT:
        if(user) {
            const deleted = await db.remove(id);
            if(deleted){
                res.status(200).json(user)
            } 
           
        }
        else{
            //what if invalid user ID. Don't want that to be in catch b/c it's 
            //not a 500 error by the server
            res.status(404).json({message: `invalid user ID`})

        }

        //can send msg back to user (i.e. a 1)
        //or if need to send the user you just deleted, can't send user back
        //since it's gone. If wanted to do this: need to fetch user first & THEN delete it.
    }
    catch(error){
        res.status(500).json({message: `error deleting the user`})
    }
})

router.put('/:id', validateUserId, async (req,res) => {
    const {id} = req.params;
    const user = req.body;
    try{
        const updated = await db.update(id, user);
        if(updated){
            const newUser = await db.getById(id)
            res.status(200).json(newUser)
        }
        else{
            res.status(404).json({message: `invalid user ID`})
        }
    }
    catch(error){
         res.status(500).json({message: `error putting new user`})
    }
})
//***************middleware */
async function validateUserId(req,res,next) {
    const { id } = req.params;
    try{
        const user = await db.getById(id);
        if(user){
            //key: uer and value: new user you got from getById
            //only 1 reference to an object in memory!!
            req.user = user;
            //allow us to go to next middleware
            next();
        }
        else{
            res.status(400).json({message: `invalid user ID`})
        }
    }
    catch(error){
        res.status(500).json({message: `error putting new user`})
    }
}

async function validateUser(req,res,next) {
    //one route you'll call this middleware on: POST 

    //check if it's an empty object first
    //(!req.body) doesn't work because: 

    //want to check the length but objects aren't arrays. 
    //if we access value of keys, we don't know what the keys are!
    //therefore, we check length of object by seeing if it's empty or not:
    if(Object.keys(req.body).legth === 0){
        //i.e. req. body is missing
        res.status(400).json({message: "Missing user data"})
    }
    //else if assumes the first if passed
    else if(!req.body.name){
        res.status(400).json({message: "missing name of user!"});
    }
    //means we passed both conditions
    else{
        next();
    }
}

router.post('/:id/posts', validateUserId, validatePost, async (req,res) => {
    try {
        const post = await Posts.insert(req.body)
        if(post){
            res.status(201).json(post)
        }

    }
    catch(error){
        res.status(500).json({message: `error putting new user`})
    }
})

router.get('/:id/posts', validateUserId, async (req,res) => {
    const {id} = req.params;
    try{
        //put helper for getting post in user methods (in the future!)
        const userPosts = await Posts.getUserPosts(id);
        if(userPosts){
            res.status(200).json(userPosts)
        }
    }
    catch(error){
        res.status(500).json({message: `error find that user's posts`})
    }
})

//like validate user
async function validatePost(req,res,next) {
    if(Object.keys(req.body).legth === 0){
        //i.e. req. body is missing
        res.status(400).json({message: "Missing post data"})
    }
    //else if assumes the first if passed
    else if(!req.body.text){
        res.status(400).json({message: "missing TEXT of user!"});
    }
    //means we passed both conditions
    else{
        next();
    }
}

module.exports = router;