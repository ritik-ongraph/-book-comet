const joi = require("@hapi/joi");

const AddBookInventoriesSchema = 
     joi.object({
        BookId: joi.string().max(100),
        qty:joi.number().integer().min(0).message('Book Quantity is invalid').required(),
    }).options({ stripUnknown: true })
















module.exports = {AddBookInventoriesSchema:AddBookInventoriesSchema}
