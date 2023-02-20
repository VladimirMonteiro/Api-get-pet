const jwt = require('jsonwebtoken')
const getToken = require('./get-token')

const checkToken = (req,res, next) => {

    if(!req.headers.authorization){
        res.status(401).json({message: "acesso negado"})

    }

    const token = getToken(req)

    if(!token){
        res.status(401).json({message: "acesso negado"})
    }

    try {

        const verified = jwt.verify(token, "nossosecret")
        const user = verified
        next()
    }
    catch(err){
        res.status(400).json({message: "token invalido"})
    }


}

module.exports = checkToken