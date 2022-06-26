const express = require('express');
const router = express.Router();
const bookInventoriesValidators = require('../validators/bookInventories/booksInventoriesValidators');

const bookInventoriesController = require('../controllers/bookInventories');
const {getBookDetails} = require('../middleware/getBooksDetais');


router.patch('/books/inventory/:id',bookInventoriesValidators.BookInventoriesValidation,getBookDetails,bookInventoriesController.modifyBookInventory);
router.delete('/books/inventory/:id',getBookDetails,bookInventoriesController.deleteBooksInventory);

module.exports = router;

