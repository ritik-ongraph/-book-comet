const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');

router.get('/books',booksController.getAllBooks);
router.get('/books/id/:id/name/:name',booksController.getBooksByIDName);
router.get('/books/authors/:authors/publisher/:publisher',booksController.getBooksByAuthorsPublisher);
router.post('/books',booksController.addBooks); 




module.exports = router;