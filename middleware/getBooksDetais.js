const fs = require('fs');
const utils = require('../utils/utils');
const _ = require('lodash');

const getBookDetails = async(req, res, next) => {
    try {
        let booksModelData = await utils.getBookData();
        let booksInventoryModelData = await utils.getBooksInventoryData();
        if (!Array.isArray(booksModelData) || !Array.isArray(booksInventoryModelData)) {
            throw new Error('Error occour while fetching the data');
        }
        // Adding Book qty from booksInventory.
        booksModelData = _.each(booksModelData, (bookItem) => {
            let findInventory = _.find(booksInventoryModelData, { bookId: bookItem.id });
            (findInventory && findInventory.qty) ? bookItem.qty = findInventory.qty : bookItem.qty = 0;
        });
        

        let bookModelDetails = {
            booksModelData:booksModelData,
            booksInventoryModelData:booksInventoryModelData
        }

        req.bookModelDetails = bookModelDetails;
        console.log(req.body);
        console.log(req.bookModelDetails);

        next();

    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    }
    
}
module.exports = { getBookDetails:getBookDetails } 
