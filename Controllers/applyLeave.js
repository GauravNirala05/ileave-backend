//dependencies
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes')
//models
const User = require('../model/User')
const Leave = require('../model/Leave')
const nonTechLeave = require('../model/non-techLeave')
const HodLeave = require('../model/HODLeave')
//Errors
const { NotFound, BadRequestError, UnAuthorizedError } = require('../errors');


const applyLeave = async (req, res) => {
    const { userID } = req.user
    const { from_date, to_date, discription, contect_no, leave_type } = req.body

    if (!from_date || !to_date || !discription || !contect_no || !leave_type) {
        throw new BadRequestError(`Please provide all credentials`)
    }
    const user = await User.findOne({ _id: userID })
    const userName = user.name
    if (user.designation === 'faculty') {
        const availableleave = await Leave.find({ employee_id: userID, status: ['applied', 'approved', 'completed'] }).sort('to_date')
        const fromDate = new Date(req.body.from_date)
        const toDate = new Date(req.body.to_date)
        if (fromDate > toDate) {
            throw new BadRequestError(`toDate must be greater or equal to the fromDate..`)
        }
        if (availableleave.length > 0) {
            lastLeaveApplied = availableleave[availableleave.length - 1]
            if (lastLeaveApplied.from_date >= fromDate  ) {
                console.log(`its here`);
                if (lastLeaveApplied.from_date <= toDate) {
                console.log(`its here to`);
                
                    throw new BadRequestError(`Can't apply leave of confilicting dates ...Please check your current leave status...`)
                }
            }
        }
        const leave_type = req.body.leave_type
        const total_days = req.body.total_days

        if (leave_type === 'casual_leave') {
            if (user.leave_type.casual_leave < total_days) {
                throw new BadRequestError(`Your remaining Casual Leave is lower than applied`)
            }
        }
        if (leave_type === 'earned_leave') {
            if (user.leave_type.earned_leave < total_days) {
                throw new BadRequestError(`Your remaining Earned Leave is lower than applied`)
            }
        }
        if (leave_type === 'ordinary_leave') {
            if (user.leave_type.ordinary_leave < total_days) {
                throw new BadRequestError(`Your remaining Ordinary Leave is lower than applied`)
            }
        }
        if (leave_type === 'medical_leave') {
            if (user.leave_type.medical_leave < total_days) {
                throw new BadRequestError(`Your remaining Medical Leave is lower than applied`)
            }
        }
    }
    if (user.designation === 'HOD') {
        const availableleave = await HodLeave.find({ employee_id: userID, status: ['applied', 'approved', 'completed'] }).sort('to_date')
        const fromDate = new Date(req.body.from_date)
        const toDate = new Date(req.body.to_date)
        if (fromDate > toDate) {
            throw new BadRequestError(`toDate must be greater or equal to the fromDate..`)
        }
        if (availableleave.length > 0) {
            lastLeaveApplied = availableleave[availableleave.length - 1]
            if (lastLeaveApplied.from_date >= fromDate  ) {
                if (lastLeaveApplied.to_date <= fromDate) {
                    throw new BadRequestError(`Can't apply leave of confilicting dates ...Please check your current leave status...`)
                }
            }
        }
        const leave_type = req.body.leave_type
        const total_days = req.body.total_days

        if (leave_type === 'casual_leave') {
            if (user.leave_type.casual_leave < total_days) {
                throw new BadRequestError(`Your remaining Casual Leave is lower than applied`)
            }
        }
        if (leave_type === 'earned_leave') {
            if (user.leave_type.earned_leave < total_days) {
                throw new BadRequestError(`Your remaining Earned Leave is lower than applied`)
            }
        }
        if (leave_type === 'ordinary_leave') {
            if (user.leave_type.ordinary_leave < total_days) {
                throw new BadRequestError(`Your remaining Ordinary Leave is lower than applied`)
            }
        }
        if (leave_type === 'medical_leave') {
            if (user.leave_type.medical_leave < total_days) {
                throw new BadRequestError(`Your remaining Medical Leave is lower than applied`)
            }
        }
    }
    if (user.department === 'non-tech') {
        const availableleave = await nonTechLeave.find({ employee_id: userID, status: ['applied', 'approved', 'completed'] }).sort('to_date')
        const fromDate = new Date(req.body.from_date)
        const toDate = new Date(req.body.to_date)
        if (fromDate > toDate) {
            throw new BadRequestError(`toDate must be greater or equal to the fromDate..`)
        }
        if (availableleave.length > 0) {
            lastLeaveApplied = availableleave[availableleave.length - 1]
            if (lastLeaveApplied.from_date >= fromDate  ) {
                if (lastLeaveApplied.to_date <= fromDate) {
                    throw new BadRequestError(`Can't apply leave of confilicting dates ...Please check your current leave status...`)
                }
            }
        }
        const leave_type = req.body.leave_type
        const total_days = req.body.total_days

        if (leave_type === 'casual_leave') {
            if (user.leave_type.casual_leave < total_days) {
                throw new BadRequestError(`Your remaining Casual Leave is lower than applied`)
            }
        }
        if (leave_type === 'earned_leave') {
            if (user.leave_type.earned_leave < total_days) {
                throw new BadRequestError(`Your remaining Earned Leave is lower than applied`)
            }
        }
        if (leave_type === 'ordinary_leave') {
            if (user.leave_type.ordinary_leave < total_days) {
                throw new BadRequestError(`Your remaining Ordinary Leave is lower than applied`)
            }
        }
        if (leave_type === 'medical_leave') {
            if (user.leave_type.medical_leave < total_days) {
                throw new BadRequestError(`Your remaining Medical Leave is lower than applied`)
            }
        }
    }

    if (user) {
        const userDep = user.department
        const designation = user.designation
        req.body.employee_id = userID
        req.body.employee_dep = userDep
        req.body.employee_name = userName

        if (designation === 'faculty') {
            const leave = await Leave.create(req.body)
            console.log(leave);
            return res.status(StatusCodes.CREATED).json({ leave: leave, status: 'SUCCESS' })
        }
        if (designation === 'HOD') {
            const leave = await HodLeave.create(req.body)
            return res.status(StatusCodes.CREATED).json({ leave: leave, status: 'SUCCESS' })
        }
        if (userDep === 'non-tech') {
            const leave = await nonTechLeave.create(req.body)
            return res.status(StatusCodes.CREATED).json({ leave: leave, status: 'SUCCESS' })
        }
        if (designation === 'principal') {
            return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'you are principal' })
        }

        throw new NotFound(`the credential ${user.designation} doesnt exists...`)

    } else {
        throw new NotFound(`Provide the valid credentials while authorization...`)
    }
}
const getReferenceName = async (req, res) => {
    const { userID } = req.user
    const user = await User.findOne({ _id: userID })
    if (user) {
        const designation = user.designation
        if (designation === 'faculty') {
            const getuser = await User.find({ department: user.department, designation: 'faculty' }).select('name')
            const refUser = getuser.filter((element) => {
                return element.name != user.name
            })
            const getUserFirstYear = await User.find({ designation: 'faculty' }).select('name')
            const refUserFirstYear = getUserFirstYear.filter((element) => {
                return element.name != user.name
            })
            return res.status(StatusCodes.OK).json({ status: `SUCCESS`, hits: refUser.length, data: refUser,refUserFirstYearHits:refUserFirstYear.length,dataFirstYear:refUserFirstYear })
        }
        if (designation === 'HOD') {
            const getuser = await User.find({ department: user.department, designation: 'faculty' }).select('name')
            return res.status(StatusCodes.OK).json({ status: `SUCCESS`, hits: getuser.length, data: getuser })
        }
        if (designation === 'principal') {
            const getuser = await User.find({ designation: ['faculty', 'HOD'] }).select('name')
            return res.status(StatusCodes.OK).json({ status: `SUCCESS`, hits: getuser.length, data: getuser })
        }
        throw new UnAuthorizedError(`Plz provide valid credentials...`)

    } else {
        throw new UnAuthorizedError(`user with id ${userID} doesnt exists...`)
    }
}
const deleteLeave = async (req, res) => {
    const { userID } = req.user
    const { leaveId: targetLeaveID } = req.params
    const user = await User.findOne({ _id: userID })
    if (user.designation === 'faculty') {
        if (await Leave.exists({ _id: targetLeaveID, status: [`applied`,`rejected`] })) {
            await Leave.findOneAndDelete({ _id: targetLeaveID })
            return res.status(StatusCodes.OK).json({ msg: `Hey, ${user.name} your leave is deleted` })
        }
        else {
            throw new NotFound(`The provided facultyLeave id does'nt exists.`)
        }
    }
    if (user.designation === 'HOD') {
        if (await HodLeave.exists({ _id: targetLeaveID, status: [`applied`,`rejected`] })) {
            await HodLeave.findOneAndDelete({ _id: targetLeaveID})
            return res.status(StatusCodes.OK).json({ msg: `Hey, ${user.name} your leave is deleted` })
        }
        else {
            throw new NotFound(`The provided Hod leave id does'nt exists.`)
        }
    }
    if (user.department === 'non-tech') {

        if (await nonTechLeave.exists({ _id: targetLeaveID, status: [`applied`,`rejected`] })) {
            await nonTechLeave.findOneAndDelete({ _id: targetLeaveID})
            return res.status(StatusCodes.OK).json({ msg: `Hey, ${user.name} your leave is deleted` })
        }
        else {
            throw new NotFound(`The provided non-tech leave id does'nt exists.`)
        }
    }

}
module.exports = { applyLeave, getReferenceName, deleteLeave }