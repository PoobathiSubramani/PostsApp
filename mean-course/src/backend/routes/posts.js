const express = require('express');

const router = express.Router();

const Post = require('../models/post');

router.post("",(req, res, next) => {
  //const post = req.body; //this will take the post found in the body of the request and assigns to post variable
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save()
    .then (createdPost => { //createdPost is the name of the placeholder which contains the results
      console.log(createdPost);
      res.status(201).json({
        message: "post added succesfully",
        postID: createdPost._id
      });
  //console.log(post);

  }); // 201 - everything was ok and new resource was created; 200 - is everything is ok
//install boby-parser (npm install -save body-parser) module to help parse incoming requests and make it easier for furthur usage
});

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post)
    .then( result => {
      console.log(result);
      res.status(200).json({message: 'post updated successfully'});
    })
})

router.delete('/:postID', (req, res, next) => {
  Post.deleteOne({_id: req.params.postID}) //this will delete the document in the db
    .then(result => {
      console.log(result);
      //console.log(req.params.postID);
      res.status(200).json({message: 'App Message: Post deleted!'});
    })
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if(post) {
        res.status(200).json(post);
      } else {
        res.status(401).json({message: 'post does not exists'});
      }
    })
})

router.use('',(req, res, next) => {
  /*const posts = [
    {id: 'PID1234',
    title: '1st post',
    content: 'thi is my first post' },
  ];*/

  Post.find()
    .then (document => {
      res.status(200).json({
        messages: "post fetched from db",
        posts: document
      });
      //console.log(posts);
    });

});

  //since this is the last statement in the code, this will be returned automatically so no need to explicityly add 'return'
  /*
  return res.status(200).json({ //the status 200 will be sent only when it is success.
    message: 'posts fetched succesfully',
    posts: posts //this sends the post array in here
  });
});*/

module.exports=router;
