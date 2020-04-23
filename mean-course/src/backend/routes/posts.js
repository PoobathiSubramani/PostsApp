const express = require('express');

const router = express.Router();

const Post = require('../models/post');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const multer = require('multer');
const storage = multer.diskStorage ({//tell where multer to put files
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid mime type error');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images');
    //the above path is relative to the server.js file not to the post.js
  },
  filename: (req, file, cb) => {

    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);

  }
}

)

router.post("", multer({storage: storage}).single('image'), (req, res, next) => {

  //creating the url for the server
  const url = req.protocol + '://' + req.get('host'); //protocol -> to know if it is http or https;

  const post = new Post({
  //const post = req.body; //this will take the post found in the body of the request and assigns to post variable
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' +  req.file.filename
  });
  post.save()
    .then (createdPost => { //createdPost is the name of the placeholder which contains the results
      console.log(createdPost);
      res.status(201).json({
        message: "post added succesfully",
        post: {
          id: createdPost._id,
          title: createdPost.title,
          content: createdPost.content,
          imagePath: createdPost.imagePath
          //replaceing the title, content and imagepath can be done simply by replacing
          //the three variables and using the ...createdPost.
        }
      });
  //console.log(post);

  }); // 201 - everything was ok and new resource was created; 200 - is everything is ok
//install boby-parser (npm install -save body-parser) module to help parse incoming requests and make it easier for furthur usage
});

router.put("/:id", multer({storage: storage}).single('image'), (req, res, next) => {
  console.log(req.file);
  let imagePath;
  if(req.file) {
    //creating the url for the server
  const url = req.protocol + '://' + req.get('host'); //protocol -> to know if it is http or https;
  imagePath = url + '/images/' +  req.file.filename;
  } else {
    imagePath = req.body.imagePath;
  }

  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
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
