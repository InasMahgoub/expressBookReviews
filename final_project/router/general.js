const express = require("express");
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
let booksArray = Object.entries(books).map((e) => e[1]);

// Check if a user with the given username already exists

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
    // Check if the user does not already exist
    if (!isValid(username)) {
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
  // return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
async function getAll() {
  return books;
}

public_users.get("/", async function (req, res) {
  return res.status(300).json(await getAll());
});

// Get book details based on ISBN
const getByISBN = (isbn) =>
  Promise.resolve(booksArray.filter((book) => book.isbn === isbn));

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  getByISBN(isbn)
    .then((result) => res.status(300).json({ books: result }))
    .catch((err) => res.status(500).send(err));
});

// Get book details based on author
async function getByAuthor(author) {
  return booksArray.filter((book) => book.author === author);
}

public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  return res.status(300).json(await getByAuthor(author));
});

// Get all books based on title
const getByTitle = (title) =>
  Promise.resolve(booksArray.filter((book) => book.title === title));

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;

  getByTitle(title)
    .then((result) => res.status(300).json({ books: result }))
    .catch((err) => res.status(500).send(err));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = booksArray.filter((book) => book.isbn === isbn);
  let review = book?.review;
  return res.status(300).json({ review: review });
});

module.exports.general = public_users;
