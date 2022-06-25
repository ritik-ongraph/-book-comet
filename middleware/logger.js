const fs = require('fs');
const logger = (req, res, next) => {
    console.log(`${req.url}  ${req.method} -- ${new Date()}`)
    let content = `${req.url}  ${req.method} -- ${new Date()}` + '\n';
    fs.appendFile('accesslog.log', content, err => {
        if (err) {
            console.error(err)
        }
    })
    next();
}
module.exports = { logger } 
