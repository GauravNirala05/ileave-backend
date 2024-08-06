const mongoose = require('mongoose')
const connectDB = (uri) => {
    return mongoose.connect(uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
    })
}
module.exports = connectDB