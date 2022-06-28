const joi = require("@hapi/joi");

const {AddBookschema, updateBookschema} = require('./booksSchema');

module.exports = {
    BookValidation: (req, res, next) => {
        let validations;
        if(req.method=='PATCH'){
           validations = updateBookschema.validate(req.body);
        }else{
            validations = AddBookschema.validate(req.body);

        }

        if (validations.error) {
            res.status(400).json({ "status": "failed", "error": validations.error.details[0].message });
        }
        else {
            // If any value is send in payload that is not defined in schema then it will remove it.
            req.body = validations.value
            next();
        }

    }
};