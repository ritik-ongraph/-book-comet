const fs = require('fs');

const path = require("path");
// It save Books Data to file
const saveBookData = (data) => {
    return new Promise((resolve,reject)=>{
       try {
        const stringifyData = JSON.stringify(data,null,2);
        fs.writeFileSync(path.resolve(__dirname, '../db/books.json'), stringifyData, 'utf8');
        resolve("Data added succesfully");
        } catch(error) {
            reject({"error":true,"message":error});
          }
    })
}


const saveBookToInventory = (data) => {
    return new Promise((resolve,reject)=>{
       try {
        const stringifyData = JSON.stringify(data,null,2);
        fs.writeFileSync(path.resolve(__dirname, '../db/bookInventories.json'), stringifyData, 'utf8');
        resolve("Data added succesfully");
        } catch(error) {
            reject({"error":true,"message":error});
          }
    })
}


//get the Book data from json file
const getBookData = () => {
return new Promise((resolve,reject)=>{
    try {
        const jsonData = fs.readFileSync(path.resolve(__dirname, '../db/books.json'),'utf-8');
        let booksModelData = JSON.parse(jsonData);
        resolve(booksModelData);
        } catch (error) {
        if (error.code === 'ENOENT') {
        console.log('File not found!');
        // We are not throwing error here because even if file is not there while saving data it will create a file.
        resolve([])
   
        } else {
        // If file is empty or invalid JSON or some other error occour.
        console.log('Error in getBookData function',error);
        reject({"error":true,"message":"Error occour while reading from database check Database connection or in memory database file"})
        }}
})


   

    
}



//get the Book Inventory data from json file
const getBooksInventoryData = () => {
    return new Promise((resolve,reject)=>{
        console.log("getBookData");
        try {
            const jsonData = fs.readFileSync(path.resolve(__dirname, '../db/bookInventories.json'),'utf-8');
            let booksModelData = JSON.parse(jsonData);
            resolve(booksModelData);
            } catch (error) {
            if (error.code === 'ENOENT') {
            console.log('File not found!');
            // We are not throwing error here because even if file is not there while saving data it will create a file.
            resolve([])
       
            } else {
            // If file is empty or invalid JSON or some other error occour.
            console.log('Error in getBookData function',error);
            reject({"error":true,"message":"Error occour while reading from database check Database connection or in memory database file"})
            }}
    })
    
    
       
    
        
    }


module.exports = {
    getBookData:getBookData,
    saveBookData:saveBookData,
    saveBookToInventory:saveBookToInventory,
    getBooksInventoryData:getBooksInventoryData

}