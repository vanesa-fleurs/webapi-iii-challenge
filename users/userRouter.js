const express = require('express');

const userDB = require('./userDb.js');
const postDB = require('../posts/postDb.js');
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




//**********************POST**********************
router.post('/', (req, res) => {
    const newUser = req.body;
    if(!newUser.name){
     res.status(400).json({ errorMessage: "Please provide the new user's name" });
    }
    else{
        userDB.insert(newUser)
        .then(u => {
            res.status(201).json(u);
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "There was an error while saving the new user to the database" });
        });
    }
});

//**********************POST**********************
router.post('/:id/posts', (req, res) => {
   const { id } = req.params;
   const postInfo = {...req.body, user_id: id}
   console.log("postInfo = req.body", postInfo);
//    if(!post.text){
//     res.status(400).json({ message: "Please provide title and contents for the post." });
//     }

    // else {
    postDB.insert(postInfo)
    .then(user => {
        console.log("user in POST for /:id/posts", user)
        res.status(210).json(user);
        // if (user){
        //     //then look add post:
        //     userDB.update(id, post)
        //         .then(newPost => {
        //             console.log("newPosts", newPost);
        //             if(newPosts > 0) {
        //                 res.status(201).json(newPost);
        //             }
        //             else{
        //                 res.status(404).json({message: `please insert a text for user ${id}s new post!`})
        //             }
        //         })
        //         .catch(error => {
        //             console.log("error in making a post", error);
        //             res.status(500).json({message: `error in CATCH for POSTS entering the post for ${id} `})
        //         });

        // } 
        // else{
        //     res.status(404).json({ message: "The user with the specified ID does not exist." });
        // }
    })
    .catch(error => {
        console.log("error!!",error)
        res.status(500).json({error: `error getting the specific user with ID:${id}`})
    });

    // }

//************************************************************************************

    // userDB.getById(id)
    // .then(user => {
    //     console.log("user in POST for /:id/posts", user)

    //     if (user){
    //         //then look add post:
    //         userDB.update(id, posts)
    //             .then(newPost => {
    //                 console.log("newPosts", newPost);
    //                 if(posts > 0) {
    //                     res.status(201).json(newPost);
    //                 }
    //                 else{
    //                     res.status(404).json({message: `please insert a text for user ${id}s new post!`})
    //                 }
    //             })
    //             .catch(error => {
    //                 res.status(500).json({message: `error in CATCH for POSTS entering the post for ${id} `})
    //             });

    //     } 
    //     else{
    //         res.status(404).json({ message: "The user with the specified ID does not exist." });
    //     }
    // })
    // .catch(error => {
    //     res.status(500).json({error: `error getting the specific user with ID:${id}`})
    // });

    //******************************************************************************************************************************
});


//**********************GET**********************
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

//**********************GET**********************
router.get('/:id', (req, res) => {
    const { id } = req.params;
    validId(id, res);
});

//**********************GET**********************
router.get('/:id/posts', validateUserId, (req, res) => {
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

//**********************DELETE**********************
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    userDB.remove(id)
        .then(change => {
            if(change){
                res.status(200).json(change);
            }
            else{
                res.status(404).json({ message: `The user with the specified ID ${id} does not exist.` });
            }
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({ error: "The user's information could not be deleted." });
        });
});

//**********************PUT**********************
router.put('/:id', (req, res) => {

});


//**********************CUSTOM MIDDLEWARE**********************


function validateUserId(req, res, next) {
    const { id } = req.params
    userDB.getById(id) 
    if(id) {
        next();
     }
     else{
        res.status(401).json({message: `error, user doesn't exist`})
     }
    
};

function validateUser(req, res, next) {

};

function validatePost(req, res, next) {

};

module.exports = router;
