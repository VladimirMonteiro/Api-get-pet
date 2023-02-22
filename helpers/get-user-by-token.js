
const jwt = require('jsonwebtoken')

const User = require('../models/User')



const getUserByToken = async (token) => {

    if(!token) {
        res.status(401).json({message: "acesso negado"})
        return
    }

    const decoded = jwt.verify(token, "nossosecret")
    const userId = decoded.id

    const user = await User.findById({_id: userId})


    return user

}

module.exports = getUserByToken