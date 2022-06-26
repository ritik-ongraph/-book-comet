const express = require('express');
const router = express.Router();
const bookInventoriesValidators = require('../validators/bookInventories/booksInventoriesValidators');

const bookInventoriesController = require('../controllers/bookInventories');

router.patch('/books/inventory/:id',bookInventoriesValidators.BookInventoriesValidation,bookInventoriesController.modifyBookInventory);
router.delete('/books/inventory/:id',bookInventoriesController.deleteBooksInventory);

module.exports = router;

