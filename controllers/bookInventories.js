
const utils = require('../utils/utils');
const _ = require('lodash');

const modifyBookInventory = async(req,res,next) =>{
    console.log("qty", req.body);console.log("qty", req.body);
    try {
        if (!req.params.id) {
            throw new Error('Id is required');
        }
        if (req.body && req.body.qty < 0) {
            throw new Error('Book Inventory cannot be negative');
        }
        let booksInventoryModelData = await utils.getBooksInventoryData();
        if ( !Array.isArray(booksInventoryModelData)) {
            throw new Error('Error occour while fetching the data');
        }

        let bookInventoryId = req.params.id;
        
        

        // check if id already exist in database
        let BookInventoryIndex = _.findIndex(booksInventoryModelData, { id: bookInventoryId });
        if (BookInventoryIndex == -1) {
            throw new Error(`Book inventory not found for id ${bookInventoryId}`)
        }
        
        if( req.body.bookId && booksInventoryModelData[BookInventoryIndex].BookId != req.body.bookId){
            throw new Error('Book Id is incorrect');
        }

        let bookInventoriesItem = {
            "id": bookInventoryId,
            "qty": req.body.qty,
        }
        booksInventoryModelData[BookInventoryIndex] = {...booksInventoryModelData[BookInventoryIndex],...bookInventoriesItem};
        await utils.saveBookToInventory(booksInventoryModelData);
        res.status(200).json({ "status": "ok", "data": bookInventoriesItem });
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    };
    
}

const deleteBooksInventory = async(req,res,next) => {
    try {
        if (!req.params.id) {
            throw new Error('Book Id is required');
        }
        let booksInventoryModelData = await utils.getBooksInventoryData();
        if (!Array.isArray(booksInventoryModelData)) {
            throw new Error('Error occour while fetching the data');
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

module.exports ={
    modifyBookInventory:modifyBookInventory,
    deleteBooksInventory:deleteBooksInventory,

}