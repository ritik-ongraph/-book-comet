const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');
const booksValidators = require('../validators/books/booksValidators');

router.get('/books',booksController.getAllBooks);
router.get('/books/id/:id/name/:name',booksController.getBooksByIDName);
router.get('/books/author/:author/publisher/:publisher',booksController.getBooksByAuthorsPublisher);
router.post('/books',booksValidators.BookValidation,booksController.addBooks); 
router.put('/books/:id',booksValidators.BookValidation,booksController.updateBooks); 
router.patch('/books/:id',booksValidators.BookValidation,booksController.modifyBooks); 
router.delete('/books/:id',booksController.deleteBooks); 







module.exports = router;