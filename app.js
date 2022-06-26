const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config()

const PORT = process.env.PORT || 3000;
// Middlewares
// Enable CORS
app.use(cors());
// parse the request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const loggerMiddleware = require('./middleware/logger')

const booksRoutes =require('./routes/books');
const bookInventoryRoutes=require('./routes/bookInventories');

//Versioning  API 
app.use(loggerMiddleware.logger);
app.use('/api/v1',booksRoutes);
app.use('/api/v1',bookInventoryRoutes);

app.use('*', ((req, res)=>{
res.status(404).json({"error":404,"message":"Please check api endpoints"})
}) );





app.listen(PORT, (error) =>{
if(!error)
console.log("Server is Successfully Running, and App is listening on port "+ PORT)
else 
console.log("Error occurred, server can't start", error);
}
);