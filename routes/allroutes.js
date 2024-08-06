const express = require(`express`)
const router = express.Router()

//authentication Middleware JWT token
const auth = require('../middlewares/auth')

//All controllers
const {register,verifyEmail,forgotPassword,verifyOTP,updatePass} = require('../Controllers/regi&verification')
const {getSingleData,signin,completeProfile,updateProfile,deleteProfile} = require('../Controllers/basicControl')
const {applyLeave,getReferenceName,deleteLeave} = require('../Controllers/applyLeave')
const {alluser,leaveStatus,getApprovals, leaveHistory, resetAllLeave, getApproved} = require('../Controllers/allcontrol')
const approve = require('../Controllers/approvals')


// routes
//Basics account statblise
router.route('/registration').post(register)
router.route('/user/verify/:userid/:uniquestring').get(verifyEmail)
router.route('/signin').post(signin)
router.route('/getUserData').get(auth, getSingleData)
router.route('/completeProfile').patch(auth, completeProfile)
router.route('/updateProfile').patch(auth, updateProfile)
router.route('/deleteProfile/:id').delete(auth, deleteProfile)

//Forgot and reset password
router.route('/forgotPassword').post(forgotPassword)
router.route('/forgotPassword/verifyOTP').post(verifyOTP)
router.route('/forgotPassword/resetPass').patch(auth, updatePass)

//Leave apply and deletion
router.route('/applyLeave').post(auth, applyLeave)
router.route('/getReferenceUser').get(auth, getReferenceName)
router.route('/leaveStatus').post(auth, leaveStatus)
router.route('/leaveHistory').get(auth, leaveHistory)
router.route('/deleteLeave/:leaveId').delete(auth, deleteLeave)
router.route('/resetLeaves').get(auth, resetAllLeave)

//Leave approving
router.route('/approvals').get(auth, getApprovals)
router.route('/approvals/:leaveId').patch(auth, approve)
router.route('/approved').get(auth, getApproved)

//principal route for grtting all Users
router.route('/alluser').get(auth, alluser)

module.exports = router