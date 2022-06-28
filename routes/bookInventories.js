const express = require('express');
const router = express.Router();
const bookInventoriesValidators = require('../validators/bookInventories/booksInventoriesValidators');
const authentication = require('../middleware/authenticationUser')
const bookInventoriesController = require('../controllers/bookInventories');
const {getBookDetails} = require('../middleware/getBooksDetails');

router.patch('/books/inventory/bookid/:id',authentication.authenticate,bookInventoriesValidators.BookInventoriesValidation,getBookDetails,bookInventoriesController.modifyBookInventoryByBookId);
router.patch('/books/inventory/:id',authentication.authenticate,bookInventoriesValidators.BookInventoriesValidation,getBookDetails,bookInventoriesController.modifyBookInventory);
router.delete('/books/inventory/:id',authentication.authenticate,getBookDetails,bookInventoriesController.deleteBooksInventory);

module.exports = router;

