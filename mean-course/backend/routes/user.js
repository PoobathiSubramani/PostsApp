/* */
const express = require("express");
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 8) //the number here represents the complexity of the encryption algorithm
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      //once got the password encrypted, save the user
    console.log("in the user module", req.body.email);
    user.save()
      //when the save is done asynchronously, display the results on the console
      .then( result => {
        res.status(201).json({
          message: "user created",
          result: result
        })
      })
      .catch( err => {
        res.status(500).json({
          message: "user did not created",
          error: err
        })
      })
    });
  console.log(user);
});


module.exports = router;
