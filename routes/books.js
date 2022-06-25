const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books');

router.get('/books',booksController.getAllBooks);
router.get('/books/id/:id/name/:name',booksController.getBooksByIDName);
router.get('/books/author/:author/publisher/:publisher',booksController.getBooksByAuthorsPublisher);
router.post('/books',booksController.addBooks); 
router.put('/books/:id',booksController.updateBooks); 
router.patch('/books/:id',booksController.modifyBooks); 
router.delete('/books/:id',booksController.deleteBooks); 







module.exports = router;