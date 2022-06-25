const utils = require('../utils/utils');
const { v4: uuid } = require("uuid");
const BooksModel = require('../utils/booksModel')
const _ = require('lodash');
const validBook = ['id', 'name', 'authors', 'publisher', 'yop', 'summary', 'format'];
//Get all Books
const getAllBooks = async (req, res) => {
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

        res.status(200).json({ "status": "ok", "data": booksModelData });
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    }
}
const addBooks = async (req, res) => {
    try {
        req.body.id = uuid();
        if (req.body && req.body.qty < 0) {
            throw new Error('Book Inventory cannot be negative');
        }
        let qty = req.body.qty || 0;
        let bookItem = req.body;
        let bookInventoriesItem = {
            "id": uuid(),
            "bookId": bookItem.id,
            "qty": qty,
        }
        delete bookItem.qty;
        let booksModelData = await utils.getBookData();
        let booksInventoryModelData = await utils.getBooksInventoryData();
        if (!Array.isArray(booksModelData) || !Array.isArray(booksInventoryModelData)) {
            throw new Error('Error occour while fetching the data');
        }
        // check if Book with same Name already exist in database
        if (_.find(booksModelData, { name: bookItem.name })) {
            throw new Error(`Book with name \' ${bookItem.name} \' is already in Database`)
        }

        booksModelData.push(bookItem);
        await utils.saveBookData(booksModelData);
        await utils.saveBookToInventory(bookInventoriesItem);

        res.status(200).json({ "status": "ok", "data": bookItem });
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    };
}
const getBooksByAuthorsPublisher = (req, res) => {
    console.log("req.params", req.params);
    res.json({ "message": "getBooksByAuthorsPublisher" });
}
const getBooksByIDName = async (req, res) => {
    // Both Id and Name are required
    // FUll text search implemented on name field so only if part of name is given it will search with it
    try {
           if(!req.params.id || !req.params.name) {
            throw new Error('Both ID and Name of book Required to search');
            }
            let booksModelData = await utils.getBookData();
            let booksInventoryModelData = await utils.getBooksInventoryData();
            if (!Array.isArray(booksModelData) || !Array.isArray(booksInventoryModelData)) {
                throw new Error('Error occour while fetching the data');
            }
                let matchCondition = { id: req.params.id, name: req.params.name }

                // Adding Book qty from booksInventory.
                booksModelData = _.each(booksModelData, (bookItem) => {
                    let findInventory = _.find(booksInventoryModelData, { bookId: bookItem.id });
                    (findInventory && findInventory.qty) ? bookItem.qty = findInventory.qty : bookItem.qty = 0;
                });

                let result = _.filter(booksModelData, (bookItem) => {
                    return (bookItem.id == matchCondition.id && _.includes(bookItem.name, matchCondition.name)
                    )
                });

                res.status(200).json({ "status":"ok","data": result });
             
        
    
            } catch (error) {
                res.status(400).json({ "status":"Failed","message": error });
            }
}
const getBooksBySearch = async (req, res) => {
    // It will accept query string and search on basis of them 
    // Full text search is implemented on name field only
}
module.exports = {
    getAllBooks: getAllBooks,
    addBooks: addBooks,
    getBooksByIDName: getBooksByIDName,
    getBooksByAuthorsPublisher: getBooksByAuthorsPublisher,
}