const utils = require('../utils/utils');
const _ = require('lodash');

/* ==============================================================================================*/

 // modify Book Inventory By Inventory Id - Inventory Id is required in req.params and  in req.body we will send Book qty that need to be modified.
const modifyBookInventory = async (req, res) => {
    try {
        let { booksModelData, booksInventoryModelData } = req.bookModelDetails;
        if (!req.params.id) {
            throw new Error(' Inventory Id is required');
        }
        if (req.body && req.body.qty < 0) {
            throw new Error('Book Inventory cannot be negative');
        }
        let bookInventoryId = req.params.id;
        // check if id already exist in database
        let BookInventoryIndex = _.findIndex(booksInventoryModelData, { id: bookInventoryId });
        if (BookInventoryIndex == -1) {
            throw new Error(`Book inventory not found for id ${bookInventoryId}`)
        }
        // Book Id is optional so if user trying to pass correct Inventory Id but incorrect Book.

        if (req.body.bookId && booksInventoryModelData[BookInventoryIndex].BookId != req.body.bookId) {
            throw new Error('Book Id is incorrect');
        }
        let bookInventoriesItem = {
            "id": bookInventoryId,
            "qty": req.body.qty,
        }
        booksInventoryModelData[BookInventoryIndex] = { ...booksInventoryModelData[BookInventoryIndex], ...bookInventoriesItem };
        await utils.saveBookToInventory(booksInventoryModelData);
        res.status(200).json({ "status": "ok", "data": bookInventoriesItem });
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    };
}


/* ==============================================================================================*/

 // modify Book Inventory By Book Id - Book Id is required in req.params and  in req.body we will send Book qty that need to be modified.

const modifyBookInventoryByBookId = async(req,res) =>{
    console.log('modify book quantity',req.params.id)
    try {
        let { booksModelData, booksInventoryModelData } = req.bookModelDetails;
        if (!req.params.id) {
            throw new Error(' Inventory Id is required');
        }
        if (req.body && req.body.qty < 0) {
            throw new Error('Book Inventory cannot be negative');
        }
        let bookItemId = req.params.id;
        // check if id already exist in database
        let BookInventoryIndex = _.findIndex(booksInventoryModelData, { bookId: bookItemId });
        if (BookInventoryIndex == -1) {
            throw new Error(`Book inventory not found for Book id ${bookItemId}`)
        }

        
        let bookInventoriesItem = {
            "qty": req.body.qty,
        }
        booksInventoryModelData[BookInventoryIndex] = { ...booksInventoryModelData[BookInventoryIndex], ...bookInventoriesItem };
        await utils.saveBookToInventory(booksInventoryModelData);
        res.status(200).json({ "status": "ok", "data": bookInventoriesItem });
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    };
}

/* ==============================================================================================*/
// Delete Book Inventory By Inventory Id - Book Id is required in req.params 

const deleteBooksInventory = async (req, res) => {
    try {
        let { booksModelData, booksInventoryModelData } = req.bookModelDetails;
        if (!req.params.id) {
            throw new Error('Book Id is required');
        }
        let bookInventoryId = req.params.id;
        let BookInventoryIndex = _.findIndex(booksInventoryModelData, { id: bookInventoryId });
        if (BookInventoryIndex == -1) {
            throw new Error(`Book inventory not found for id ${bookInventoryId}`)
        }
        if (booksInventoryModelData[BookInventoryIndex] && booksInventoryModelData[BookInventoryIndex].qty) {
            throw new Error('Book with positive Inventory qty can not be deleted use patch request to set inventory qty to 0 then delete from book inventory');
        } else {
            _.remove(booksInventoryModelData, { id: bookInventoryId });
            await utils.saveBookToInventory(booksInventoryModelData);
            res.status(200).json({ "status": "ok", "message": "Book Deleted" });
        }
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    }
}

module.exports = {
    modifyBookInventoryByBookId:modifyBookInventoryByBookId,

    modifyBookInventory: modifyBookInventory,
    deleteBooksInventory: deleteBooksInventory,
}