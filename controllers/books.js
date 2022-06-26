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
    console.log(req.body);
    try {
        const validBook = ['id', 'name', 'authors', 'publisher', 'yop', 'summary', 'format'];
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
        booksInventoryModelData.push(bookInventoriesItem)
        await utils.saveBookToInventory(booksInventoryModelData);
        res.status(200).json({ "status": "ok", "data": bookItem });
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    };
}
const getBooksByAuthorsPublisher = async (req, res) => {
    // Both Authors and Publisher Name are required
    try {
        if (!req.params.author || !req.params.publisher) {
            throw new Error('Both Authors and Publisher Name are required to search');
        }
        let booksModelData = await utils.getBookData();
        let booksInventoryModelData = await utils.getBooksInventoryData();
        if (!Array.isArray(booksModelData) || !Array.isArray(booksInventoryModelData)) {
            throw new Error('Error occour while fetching the data');
        }
        let matchCondition = { author: req.params.author, publisher: req.params.publisher }
        // Adding Book qty from booksInventory.
        booksModelData = _.each(booksModelData, (bookItem) => {
            let findInventory = _.find(booksInventoryModelData, { bookId: bookItem.id });
            (findInventory && findInventory.qty) ? bookItem.qty = findInventory.qty : bookItem.qty = 0;
        });
        let result = _.filter(booksModelData, (bookItem) => {
            // Find author and  publisher 
            return (_.includes(bookItem.publisher, matchCondition.publisher) && _.includes(bookItem.authors, matchCondition.author)
            )
        });
        res.status(200).json({ "status": "ok", "data": result });
    } catch (error) {
        res.status(400).json({ "status": "Failed", "message": error.message });
    }
}
const getBooksByIDName = async (req, res) => {
    // Both Id and Name are required
    // FUll text search implemented on name field (Book Title) so only if part of name is given it will search with it
    try {
        if (!req.params.id || !req.params.name) {
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
        res.status(200).json({ "status": "ok", "data": result });
    } catch (error) {
        res.status(400).json({ "status": "Failed", "message": error });
    }
}
const getBooksBySearch = async (req, res) => {
    // It will accept query string and search on basis of them 
    // Full text search is implemented on name field only
}
const updateBooks = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error('Id is required');
        }
        if (req.body && req.body.qty < 0) {
            throw new Error('Book Inventory cannot be negative');
        }
        let booksModelData = await utils.getBookData();
        let booksInventoryModelData = await utils.getBooksInventoryData();
        if (!Array.isArray(booksModelData) || !Array.isArray(booksInventoryModelData)) {
            throw new Error('Error occour while fetching the data');
        }
        let bookItem = req.body;
        bookItem.id = req.params.id;
        // check if id already exist in database
        let BookModelIndex = _.findIndex(booksModelData, { id: bookItem.id });
        if (BookModelIndex == -1) {
            throw new Error(`Book with id \' ${bookItem.id} \' does not exist in Database`);
        }
        booksModelData[BookModelIndex] = bookItem;
        let BookInventoryIndex = _.findIndex(booksInventoryModelData, { bookId: bookItem.id });
        if (BookInventoryIndex == -1) {
            throw new Error(`Book inventory not found for book id ${bookItem.id}`)
        }
        let qty = req.body.qty;
        let bookInventoryId = booksInventoryModelData[BookInventoryIndex].id;
        let bookInventoriesItem = {
            "id": bookInventoryId,
            "bookId": bookItem.id,
            "qty": qty,
        }
        booksInventoryModelData[BookInventoryIndex] = bookInventoriesItem;
        await utils.saveBookData(booksModelData);
        await utils.saveBookToInventory(booksInventoryModelData);
        res.status(200).json({ "status": "ok", "data": bookItem });
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    };
}
const modifyBooks = async (req, res) => {
    console.log("qty", req.body);
    try {
        if (!req.params.id) {
            throw new Error('Id is required');
        }
        if (req.body && req.body.qty < 0) {
            throw new Error('Book Inventory cannot be negative');
        }
        let booksModelData = await utils.getBookData();
        let booksInventoryModelData = await utils.getBooksInventoryData();
        if (!Array.isArray(booksModelData) || !Array.isArray(booksInventoryModelData)) {
            throw new Error('Error occour while fetching the data');
        }
        let bookItem = req.body;
        bookItem.id = req.params.id;
        delete bookItem.qty;
        // check if id already exist in database
        let BookModelIndex = _.findIndex(booksModelData, { id: bookItem.id });
        if (BookModelIndex == -1) {
            throw new Error(`Book with id \' ${bookItem.id} \' does not exist in Database`);
        }
        console.log("dgdfg", req.body.qty);
        booksModelData[BookModelIndex] = ({ ...booksModelData[BookModelIndex], ...bookItem });
        console.log("dgdfg", req.body.qty);
        let BookInventoryIndex = _.findIndex(booksInventoryModelData, { bookId: bookItem.id });
        if (BookInventoryIndex == -1) {
            throw new Error(`Book inventory not found for book id ${bookItem.id}`)
        }
        let bookInventoryId = booksInventoryModelData[BookInventoryIndex].id;
        let qty = booksInventoryModelData[BookInventoryIndex].qty;
        console.log("1", qty, req.body);
        if (req.body && (req.body.qty >= 0)) {
            console.log("check", qty)
            qty = req.body.qty;
        }
        let bookInventoriesItem = {
            "id": bookInventoryId,
            "bookId": bookItem.id,
            "qty": qty,
        }
        console.log("2", bookInventoriesItem);
        booksInventoryModelData[BookInventoryIndex] = bookInventoriesItem;
        await utils.saveBookData(booksModelData);
        await utils.saveBookToInventory(booksInventoryModelData);
        res.status(200).json({ "status": "ok", "data": bookItem });
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    };
}
const deleteBooks = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error('Book Id is required');
        }
        let booksModelData = await utils.getBookData();
        let booksInventoryModelData = await utils.getBooksInventoryData();
        if (!Array.isArray(booksModelData) || !Array.isArray(booksInventoryModelData)) {
            throw new Error('Error occour while fetching the data');
        }
        let bookItemID = req.params.id;
        let BookModelIndex = _.findIndex(booksModelData, { id: bookItemID });
        if (BookModelIndex == -1) {
            throw new Error(`Book with id \' ${bookItemID} \' does not exist in Database`);
        }
        let BookInventoryIndex = _.findIndex(booksInventoryModelData, { bookId: bookItemID });
        if (BookInventoryIndex == -1) {
            throw new Error(`Book inventory not found for book id ${bookItemID}`)
        }
        if (booksInventoryModelData[BookInventoryIndex] && booksInventoryModelData[BookInventoryIndex].qty) {
            throw new Error('Book with Inventory  qty can not be deleted first delete quantity from book inventory');
        } else {
            _.remove(booksModelData, { id: bookItemID });
            _.remove(booksInventoryModelData, { bookId: bookItemID });
            await utils.saveBookData(booksModelData);
            await utils.saveBookToInventory(booksInventoryModelData);
            res.status(200).json({ "status": "ok", "message": "Book Deleted" });
        }
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    }
}
module.exports = {
    getAllBooks: getAllBooks,
    addBooks: addBooks,
    getBooksByIDName: getBooksByIDName,
    getBooksByAuthorsPublisher: getBooksByAuthorsPublisher,
    updateBooks: updateBooks,
    modifyBooks: modifyBooks,
    deleteBooks: deleteBooks
}