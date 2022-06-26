const joi = require("@hapi/joi");

const AddBookschema = 
     joi.object({
        name: joi.string().max(100).required(),
        authors: joi.array().items(joi.string()).min(1).required(),
        publisher: joi.string().required(),
        yop:joi.number().integer().min(1800).message('year of publication must be after year 1800').max(new Date().getFullYear()).message('year of publication can not be greater than current year').required(),
        summary: joi.string().required(),
        format: joi.string().valid('ebook','epub','paperback').required(),
        qty:joi.number().integer().min(0).message('Book Quantity is invalid').required(),
    }).options({ stripUnknown: true })




const updateBookschema = joi.object({
    name: joi.string().max(100),
    authors: joi.array().items(joi.string()),
    publisher: joi.string(),
    yop:joi.number().integer().min(1800).message('year of publication must be after year 1800').max(new Date().getFullYear()).message('year of publication can not be greater than current year'),
    summary: joi.string(),
    format: joi.string().valid('ebook','epub','paperback'),
    qty:joi.number().integer().min(0).message('Book Quantity is invalid'),
}).options({ stripUnknown: true })












module.exports = {AddBookschema:AddBookschema,
    updateBookschema:updateBookschema}
