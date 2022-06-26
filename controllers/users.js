const userLogin = (req, res) => {
    if (!req.body || !req.body.username || !req.body.password) {
        res.status(400).send({ "status": "failed", "message": "Username and password is required" });
    }
    let { username, password } = req.body
    // We have default username and password to admin
    if (username.toLowerCase() == 'admin' && password.toLowerCase() == 'admin') {
        res.status(200).send({ "status": "ok", "message": "User is logged in successfully" });
    } else {
        res.status(400).send({ "status": "failed", "message": "invalid Credentials" });
    }
}
module.exports = {
    userLogin: userLogin
}