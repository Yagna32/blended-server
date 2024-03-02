const jwt = require("jsonwebtoken")

const fetchUser = async(req,res,next) => {
    const token = req.header('auth-token');
    if(!token) {
        res.status(401).send({
            errors: "No Token Found"
        })
    }
    else {
        try {
            const data = jwt.verify(token,process.env.SECRET_TOKEN);
            req.user = data.user;
            next();
        } catch(error) {
            res.status(401).send({
                errors: "Wrong Token"
            })
        }
    }
}
// const jwt = require('jsonwebtoken');


module.exports = fetchUser;