const utils = require('../utils/utils');
const { v4: uuid } = require("uuid");
const _ = require('lodash');

/* ==============================================================================================*/

//Get all Books
const getAllBooks = async (req, res) => {
    try {
        let  {booksModelData, booksInventoryModelData}  = req.bookModelDetails;
        res.status(200).json({ "status": "ok", "data": booksModelData });
    } catch (error) {
        res.status(400).json({ "status": "failed", "error": error.message });
    }
}
 
/* ==============================================================================================*/

// Add New Books - All fields are required 
const addBooks = async (req, res) => {
    try {
        let  {booksModelData, booksInventoryModelData}  = req.bookModelDetails;
        if (req.body && req.body.qty < 0) {
            throw new Error('Book Inventory cannot be negative');
        }
        // We are setting quantity to 0 if req.body don't have quantity however we have kept qty as required field in schema validation.
        let qty = req.body.qty || 0;

        let bookItem = {...req.body};
           bookItem.id = uuid();
        // When we create book item we have to save Book qty to book inventory collection.
        let bookInventoriesItem = {
            "id": uuid(),
            "bookId": bookItem.id,
            "qty": qty,
        }

        // we are not saving book quantity in books collection but we want to save it on book inventory collection
        delete bookItem.qty;
        
        // check if Book with same Name already exist in database
        if (_.find(booksModelData, { name: bookItem.name })) {
            throw new Error(`Book with name \' ${bookItem.name} \' is already in Database`)
        }

        // saving Data
        booksModelData.push(bookItem);
        await utils.saveBookData(booksModelData);
        booksInventoryModelData.push(bookInventoriesItem)
        await utils.saveBookToInventory(booksInventoryModelData);
        res.status(200).json({ "status": "ok", "message":"Book Item Added successfully", "data": bookItem });
    } catch (error) {
        
        res.status(400).json({ "status": "failed", "error": error.message });
    };
}

/* ==============================================================================================*/

// Get Books By Authors and Publisher  - autjours and publisher name is required
const getBooksByAuthorsPublisher = async (req, res) => {
    // Books can have more then 1 author so even if any 1 author match with publisher then it will fetch it 
    try {
        let  {booksModelData, booksInventoryModelData}  = req.bookModelDetails;

        if (!req.params.author || !req.params.publisher) {
            throw new Error('Both Authors and Publisher Name are required to search');
        }
        
        let matchCondition = { author: req.params.author, publisher: req.params.publisher }
        let result = _.filter(booksModelData, (bookItem) => {
        // Find author and  publisher 
        return (_.includes(bookItem.publisher, matchCondition.publisher) && _.includes(bookItem.authors.toLowerCase(), matchCondition.author.toLowerCase())
        )
        });
        res.status(200).json({ "status": "ok", "data": result });
    } catch (error) {
        res.status(400).json({ "status": "Failed", "message": error.message });
    }
}


/* ==============================================================================================*/


// Get Book By Book Id - Both id required
const getBooksByID = async (req, res) => {
    // FUll text search implemented on name field (Book Title) so only if part of name is given it will search with it.
    try {
        let  {booksModelData, booksInventoryModelData}  = req.bookModelDetails;

        if (!req.params.id) {
            throw new Error('Both ID Required to search');
        }
        
        let matchCondition = { id: req.params.id }
        
        let result = _.filter(booksModelData, (bookItem) => {
            return (bookItem.id == matchCondition.id
            )
        });
        res.status(200).json({ "status": "ok", "data": result });
    } catch (error) {
        res.status(400).json({ "status": "Failed", "message": error.message });
    }
}




/* ==============================================================================================*/

// Get Book By Book Query Search - It can search by id,name,publisher and authors

const getBooksBySearch=async(req,res)=>{

try{
    let  {booksModelData, booksInventoryModelData}  = req.bookModelDetails;

  let search =  _.keys(req.query);
  let searchData = {...req.query};
  let filteredData = [...booksModelData];
    
    if(_.includes(search,'id')){
        filteredData =_.filter(filteredData,{'id':searchData.id});
     }
    if(_.includes(search,'publisher')){
        filteredData =_.filter(filteredData,{'publisher':searchData.publisher});
    }
    if(_.includes(search,'name')){
        filteredData =_.filter(filteredData,(bookItem)=>{
        return (_.includes(bookItem.name.toLowerCase(), searchData.name.toLowerCase()))
        });
    }
    if(_.includes(search,'authors')){
        filteredData =_.filter(filteredData,(bookItem)=>{
        return (  _.includes(bookItem.authors, searchData.authors))
        });
    }
    let result = [...filteredData];
    res.status(200).json({ "status": "ok", "data": result });

}catch(error){
    res.status(400).json({ "status": "Failed", "message": error.message });

}

} 
/* ==============================================================================================*/

// Get Book By Book Id and Name  - Both id and name are required
const getBooksByIDName = async (req, res) => {
    // FUll text search implemented on name field (Book Title) so only if part of name is given it will search with it.
    try {
        let  {booksModelData, booksInventoryModelData}  = req.bookModelDetails;

        if (!req.params.id || !req.params.name) {
            throw new Error('Both ID and Name of book Required to search');
        }
        
        let matchCondition = { id: req.params.id, name: req.params.name }
        
        let result = _.filter(booksModelData, (bookItem) => {
            return (bookItem.id == matchCondition.id && _.includes(bookItem.name, matchCondition.name)
            )
        });
        res.status(200).json({ "status": "ok", "data": result });
    } catch (error) {
        res.status(400).json({ "status": "Failed", "message": error.message });
    }
}

/* ==============================================================================================*/


// Update Book By Book Id - Book id is required in req.params and all fields are required in req.body except Book id
const updateBooks = async (req, res) => {
    try {
        let  {booksModelData, booksInventoryModelData}  = req.bookModelDetails;

        if (!req.params.id) {
            throw new Error('Id is required');
        }
        if (req.body && req.body.qty < 0) {
            throw new Error('Book Inventory cannot be negative');
        }

        // If someone send wrong Book Id in req.body and but correct id in req.params so we will fetch book from req.params and update the document by setting the correct id;
        // User should not be able to update bookId by passing it to payload.
        let bookItem = {...req.body};
        bookItem.id = req.params.id;
        delete bookItem.qty;

        // check if id already exist in database
        let BookModelIndex = _.findIndex(booksModelData, { id: bookItem.id });
        if (BookModelIndex == -1) {
            throw new Error(`Book with id \' ${bookItem.id} \' does not exist in Database`);
        }
       
        // This is Put request so We are updating all Fields except BookId
        booksModelData[BookModelIndex] = bookItem;

        let BookInventoryIndex = _.findIndex(booksInventoryModelData, { bookId: bookItem.id });
        if (BookInventoryIndex == -1) {
            throw new Error(`Book inventory not found for book id ${bookItem.id}`)
        }
        let qty = req.body.qty || 0;
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

/* ==============================================================================================*/

 // modify Book By Book Id - Book Id is required in req.params and in req.body we send fields that need to be modified.
const modifyBooks = async (req, res) => {
    try {
        let  {booksModelData, booksInventoryModelData}  = req.bookModelDetails;

        if (!req.params.id) {
            throw new Error('Id is required');
        }
        if (req.body && req.body.qty < 0) {
            throw new Error('Book Inventory cannot be negative');
        }
        // If someone send wrong Book Id in req.body and but correct id in req.params so we will fetch book from req.params and modify the document by setting the correct id;
        // User should not be able to update bookId by passing it to payload.

        let bookItem =  {...req.body};
        bookItem.id = req.params.id;
        // Book qty not needed in Books collection
        delete bookItem.qty;

        // check if id already exist in database
        let BookModelIndex = _.findIndex(booksModelData, { id: bookItem.id });
        if (BookModelIndex == -1) {
            throw new Error(`Book with id \' ${bookItem.id} \' does not exist in Database`);
        }

        // This is patch Request so we are not overwritting all fields
        booksModelData[BookModelIndex] = ({ ...booksModelData[BookModelIndex], ...bookItem });

        let BookInventoryIndex = _.findIndex(booksInventoryModelData, { bookId: bookItem.id });
        if (BookInventoryIndex == -1) {
            throw new Error(`Book inventory not found for book id ${bookItem.id}`)
        }

        let bookInventoryId = booksInventoryModelData[BookInventoryIndex].id;
        // If user didn't want to update qty then we will set qty to old value
        let qty = booksInventoryModelData[BookInventoryIndex].qty;
        // We are checking qty > = 0  because we are allowing 0 value for quantity but not negative value.
        if (req.body && (req.body.qty >= 0)) {
            qty = req.body.qty
        }
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

/* ==============================================================================================*/

// Delete Book By Book Id - Book Id is required in req.params 
const deleteBooks = async (req, res) => {
    try {
        let  {booksModelData, booksInventoryModelData}  = req.bookModelDetails;

        if (!req.params.id) {
            throw new Error('Book Id is required');
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

        // We are preventing user from deleting book with positive inventory
        // user has to set book qty to 0 by patch or put request before deleting book.
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
    getBooksBySearch:getBooksBySearch,
    addBooks: addBooks,
    getBooksByID:getBooksByID,
    getBooksByIDName: getBooksByIDName,
    getBooksByAuthorsPublisher: getBooksByAuthorsPublisher,
    updateBooks: updateBooks,
    modifyBooks: modifyBooks,
    deleteBooks: deleteBooks
}

