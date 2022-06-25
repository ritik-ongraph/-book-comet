const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 3000;
//const fs = require('fs');


// Middlewares

// Enable CORS
app.use(cors());
// parse the request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const booksRoutes =require('./routes/books');

//Versioning  API 
app.use('/api/v1',booksRoutes);
app.use('*', ((req, res)=>{
    res.status(404).json({"error":404,"message":"Please check api endpoints"})
}) );


// post
app.get('/1', (req, res)=>{
    let oldData=utils.getBookData();
    console.log("oldaata",oldData);
    oldData.push({id:"1","name":"books"})
    utils.saveBookData(oldData);
    res.status(200).json({"message":"Welcome to root URL of Server","data":oldData});
});

// patch
app.get('/2', (req, res)=>{
    let oldData=utils.getBookData();
    console.log("oldaata",oldData);
    oldData.find((bookObj)=>{
        if( bookObj.id==1) {
            bookObj.name="book of applications";
        }
    })
    utils.saveBookData(oldData);
    res.status(200).json({"message":"Welcome to root URL of Server","data":oldData});
});


app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);