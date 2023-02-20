const mongoose = require('mongoose')

mongoose.set('strictQuery', true)

async function main(){

    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.24e27ty.mongodb.net/?retryWrites=true&w=majority`)
    console.log('conectado ao MongoDB')
   
    
}


main().catch(err => console.log(err))


module.exports = mongoose