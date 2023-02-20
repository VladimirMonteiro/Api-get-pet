const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const createUserToken = require('../helpers/create-user-token')
const getToken = require('../helpers/get-token')



module.exports = class UserController {

    static async register (req,res) {
        

        const {name, email, phone, password, confirmPassword} = req.body

        if(!name){
            res.status(422).json({message: "O nome é obrigatório."})
            return
        }

        if(!email) {
            res.status(422).json({message:" O e-mail é obrigatório."})
            return
        }

        if(!phone) {
            res.status(422).json({message: " O telefone é obrigatório."})
            return
        }

        if(!password){
            res.status(422).json({message: " A senha é obrigatória."})
            return
        }

        if(!confirmPassword){
            res.status(422).json({message: " A confirmação da senha é obrigatória."})
            return
        }

        if(password !== confirmPassword) {
            res.status(422).json({message: "As senhas não conferem."})
            return
        }

        const userExist = await User.findOne({email: email})

        if(userExist){
            res.status(422).json({message: 'Usuário ja existe.'})
        }

        //password byrcpt

        const salt = await bcrypt.genSalt(12)
        const passwordHashed = await bcrypt.hash(password, salt)



        const user = new User({
            name,
            email,
            phone,
            password: passwordHashed
        })

        try{

            const newUser=  await user.save()
            await createUserToken (newUser, req, res)
        }
        catch(err){
            res.status(500).json({message: err})
        }

    }


    static async login (req,res) {

        const {email, password} = req.body

        if(!email) {
            res.status(422).json({message: "O email é obrigatório."})
            return
        }

        if(!password) {
            res.status(422).json({message: "A senha é obrigatória."})
            return
        }

        const user = await User.findOne({email: email})

        if(!user){
            res.status(422).json({message: "Usario não existe"})
            return
        }

        const checkPassword =await bcrypt.compare(password, user.password)

        if(!checkPassword){
            res.status(422).json({message: "Senha inválida"})
            return
        }

        await createUserToken(user,req,res)
    }

    static async checkUser (req, res) {

        let currentUser

        console.log(req.headers.authorization)

        if(req.headers.authorization){

            const token = getToken(req)
            const decoded = jwt.verify(token, "nossosecret")
             currentUser = await User.findById(decoded.id)

             currentUser.password = undefined



        }else{
            currentUser = null
        }

        res.status(200).send(currentUser)
    }

    static async getUserById (req,res) {

        const id = req.params.id

        const user = await User.findById(id).select("-password")

        if(!user){
            res.status(422).json({message: 'Usuario não encontrado.'})
            return
        }

        res.status(200).json({user})
    }

    static async editUser (req,res){
        
        const id = req.params.id

        const user = await User.findById(id)

        if(!user){
            res.status(422).json({message: 'Usuario invalido'})
            return
        }
    }
}