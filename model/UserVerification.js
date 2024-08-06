const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userVerificationSchema = mongoose.Schema({
    userID: String,
    uniqueString: String,
    createdAt: Date,
    expiresAt: Date

})

userVerificationSchema.pre('save', async function (){
    const salt = await bcrypt.genSalt(10)
    this.uniqueString = await bcrypt.hash(this.uniqueString, salt)
})

userVerificationSchema.methods.compString = async function (string) {
    const match = await bcrypt.compare(string, this.uniqueString)
    return match
}
module.exports = mongoose.model('userVerification', userVerificationSchema)