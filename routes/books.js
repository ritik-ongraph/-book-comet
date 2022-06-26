const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');
const booksValidators = require('../validators/books/booksValidators');
const {getBookDetails} = require('../middleware/getBooksDetais');
const authentication = require('../middleware/authenticationUser')

router.get('/books',authentication.authenticate,getBookDetails,booksController.getAllBooks);
router.get('/books/id/:id/name/:name',authentication.authenticate,getBookDetails,booksController.getBooksByIDName);
router.get('/books/author/:author/publisher/:publisher',authentication.authenticate,getBookDetails,booksController.getBooksByAuthorsPublisher);
router.post('/books',authentication.authenticate,booksValidators.BookValidation,getBookDetails,booksController.addBooks); 
router.put('/books/:id',authentication.authenticate,booksValidators.BookValidation,getBookDetails,booksController.updateBooks); 
router.patch('/books/:id',authentication.authenticate,booksValidators.BookValidation,getBookDetails,authentication.authenticate,booksController.modifyBooks); 
router.delete('/books/:id',authentication.authenticate,getBookDetails,booksController.deleteBooks); 






module.exports = router;