const express = require('express');

const userDB = require('./userDb.js');
const router = express.Router();

//**********************Vanesa's functions********************** 
function validId(id, res) {
    return userDB.getById(id)
    .then(user => {
        if (user){
            res.status(200).json(user);
        } 
        else{
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    })
    .catch(error => {
        console.log("error in GET users/:id", error);
        res.status(500).json({error: `error getting the specific user with ${id}`})
    })  
}
//**********************Vanesa's functions**********************

router.post('/', (req, res) => {

});

router.post('/:id/posts', (req, res) => {

});

router.get('/', (req, res) => {
    userDB.get(req.query)
        .then(users => {
            res.status(200).json(users)
        })
        .catch(error => {
            console.log("error in user GET", error);
            res.status(500).json({error: "error retrieving all users"})
        })
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    validId(id, res);
});

router.get('/:id/posts', (req, res) => {
    const { id } = req.params;
    userDB.getUserPosts(id)
        .then(userPosts => {
           if(userPosts.length){
               res.status(200).json(userPosts);
           }
           else {
                res.status(404).json({ message: "The user with the specified ID does not exist." });
           }
                
         
            
        })
        .catch(error => {
            console.log("error in GET users/id/posts", error);
            res.status(500).json({error: `error getting user ${id}'s posts!`});
        });

});

router.delete('/:id', (req, res) => {

});

router.put('/:id', (req, res) => {

});

//custom middleware

function validateUserId(req, res, next) {

};

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
