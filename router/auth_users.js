const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  let checkUser = users.filter((user)=>{
    return user.username === username
  });
  if(checkUser.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ 
  let verifUser = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(verifUser.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 100 * 100 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn/", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  let use_r = users.filter(user => user.password == req.user.data)[0];
  books[isbn].reviews[use_r.username] = review;
  return res.status(200).json({message: `The review for the ISBN ${isbn} has been added/Updated`});
});

// Add a book review
regd_users.delete("/auth/deletereview/:isbn/", (req, res) => {
  const isbn = req.params.isbn;
  let use_r = users.filter(user => user.password == req.user.data)[0];
  delete books[isbn].reviews[use_r.username];
  return res.status(200).json({message: `The review for the ISBN ${isbn} has been deleted`});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;