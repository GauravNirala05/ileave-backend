const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const otpVerificationSchema = mongoose.Schema({
    userID: String,
    OTP: String,
    createdAt: Date,
    expiresAt: Date

})

otpVerificationSchema.pre('save', async function (){
    const salt = await bcrypt.genSalt(10)
    this.OTP = await bcrypt.hash(this.OTP, salt)
})

otpVerificationSchema.methods.compOTP = async function (num) {
    const match = await bcrypt.compare(num, this.OTP)
    return match
}
module.exports = mongoose.model('OTPverification', otpVerificationSchema)