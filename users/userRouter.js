const express = require('express');

const userDB = require('./userDb.js');
const router = express.Router();

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
    userDB.getById(id)
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

});

router.get('/:id/posts', (req, res) => {

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
