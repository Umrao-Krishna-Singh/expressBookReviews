const express = require("express");
let books = require("./booksdb.js");
const { default: axios, Axios } = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!doesExist(username)) {
      // Add the new user to the users array
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  // Return error if username or password is missing
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get the book list available in the shop - axios async await
public_users.get("/async/", async function (req, res) {
  let data = {};
  try {
    data = (await axios.get("http://127.0.0.1:5000/")).data;
  } catch (error) {
    console.error("axios error: ", error);
    return res.status(500).send("Internal Server Error");
  }

  return res.status(200).json(data);
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  return res.status(200).send(books[isbn]);
});

// Get book details based on ISBN
public_users.get("/async/isbn/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let data = {};

  new Promise((resolve) => {
    resolve(axios.get(`http://localhost:5000/isbn/${isbn}`));
  })
    .then((resolve) => {
      data = resolve.data;
      return res.status(200).send(data);
    })
    .catch((rej) => {
      console.error("axios error: ", rej);
      return res.status(500).send("Internal Server Error");
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  const author = req.params.author;

  const book = Object.values(books).filter((item) => item.author === author);
  return res.status(200).json({ booksByAuthor: book });
});

//Get all books by author - async function3
public_users.get("/async/author/:author", async function (req, res) {
  //Write your code here
  const author = req.params.author;

  let data = {};
  try {
    data = (await axios.get(`http://127.0.0.1:5000/author/${author}`)).data;
  } catch (error) {
    console.error("axios error: ", error);
    return res.status(500).send("Internal Server Error");
  }

  return res.status(200).json(data);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  const title = req.params.title;

  const book = Object.values(books).filter((item) => item.title === title);

  return res.status(200).json({ booksByTitle: book });
});

// Get all books based on title - async function
public_users.get("/async/title/:title", async function (req, res) {
  //Write your code here
  const title = req.params.title;

  let data = {};
  try {
    data = (await axios.get(`http://127.0.0.1:5000/title/${title}`)).data;
  } catch (error) {
    console.error("axios error: ", error);
    return res.status(500).send("Internal Server Error");
  }

  return res.status(200).json(data);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;

  return res.status(200).send(review);
});

module.exports.general = public_users;
