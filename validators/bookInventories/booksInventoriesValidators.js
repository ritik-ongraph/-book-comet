const joi = require("@hapi/joi");

const {AddBookInventoriesSchema} = require('./booksInventoriesSchema');

module.exports = {
    BookInventoriesValidation:  (req, res, next) => {
        let validations = AddBookInventoriesSchema.validate(req.body);

        

        if (validations.error) {
            console.log(validations);
            res.status(400).json({ "status": "failed", "error": validations.error.details[0].message });

        }
        else {
            // If any value is send in payload that is not defined in schema then it will remove it.
            req.body = validations.value
            next();
        }

    }
};