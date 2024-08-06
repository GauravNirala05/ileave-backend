require('dotenv').config()
require('express-async-errors')

// Essentials
const connectDB = require('./db/connectDB')
const routes = require(`./routes/allroutes`)
//express
const express = require('express')
const app = express()


const notFound = require(`./middlewares/notFound`)
const errorHandlerMiddleware = require(`./middlewares/errorhandler`)


//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static('../frontend'))

//All Routes
app.use('/', routes)


//errorhandlers
app.use(notFound)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 4000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => console.log(`Server is listning at port ${port}...`))

    } catch (error) {
        console.log(`Error occured..
while starting the server...
${error}`);
    }
}
start()