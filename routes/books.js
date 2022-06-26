const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');
const booksValidators = require('../validators/books/booksValidators');
const {getBookDetails} = require('../middleware/getBooksDetais');

router.get('/books',getBookDetails,booksController.getAllBooks);
router.get('/books/id/:id/name/:name',getBookDetails,booksController.getBooksByIDName);
router.get('/books/author/:author/publisher/:publisher',getBookDetails,booksController.getBooksByAuthorsPublisher);
router.post('/books',booksValidators.BookValidation,getBookDetails,booksController.addBooks); 
router.put('/books/:id',booksValidators.BookValidation,getBookDetails,booksController.updateBooks); 
router.patch('/books/:id',booksValidators.BookValidation,getBookDetails,booksController.modifyBooks); 
router.delete('/books/:id',getBookDetails,booksController.deleteBooks); 







module.exports = router;