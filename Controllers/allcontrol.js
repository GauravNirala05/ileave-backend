const User = require('../model/User')
const Leave = require('../model/Leave')
const HodLeave = require('../model/HODLeave')
const nonTechLeave = require('../model/non-techLeave')


const { UnAuthorizedError, NotFound, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


const alluser = async (req, res) => {
    const { userID } = req.user
    const user = await User.findOne({ _id: userID })
    if (user) {
        const designation = user.designation
        if (designation === 'faculty') {
            throw new UnAuthorizedError(`You are a ${designation} and cant access any other user`)
        }
        if (designation === 'HOD') {
            const alluser = await User.find({ department: user.department, designation: 'faculty' }).select(' _id email name contect_type department designation mob_no leave_type')
            return res.status(StatusCodes.OK).json({ status: `SUCCESS`, hits: alluser.length, data: alluser })
        }
        if (designation === 'principal') {
            const alluser = await User.find({ department: ['Computer Science', 'Information Tecnology', 'ET & T', 'Mechanical', 'Mining', 'Electrical', 'Civil', 'non-tech'] }).select(' _id email name contect_type department designation mob_no leave_type')
            return res.status(StatusCodes.OK).json({ status: `SUCCESS`, hits: alluser.length, data: alluser })
        }
        throw new BadRequestError(`Please provide credentials.`)
    } else {
        throw new NotFound(`user with id ${userID} doesnt exists...`)
    }
}


const leaveStatus = async (req, res) => {
    const { userID } = req.user
    const { status } = req.body
    console.log(req.user);
    if (await User.exists({ _id: userID, designation: 'faculty' })) {
        const facultyLeave = await Leave.find({ employee_id: userID, status }).sort('createdAt')
        return res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: facultyLeave.length, data: facultyLeave })
    }
    if (await User.exists({ _id: userID, designation: 'HOD' })) {
        const hodLeave = await HodLeave.find({ employee_id: userID, status }).sort('createdAt')
        return res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: hodLeave.length, data: hodLeave })
    }
    if (await User.exists({ _id: userID, department: 'non-tech' })) {
        const nontechLeave = await nonTechLeave.find({ employee_id: userID, status }).sort('createdAt')
        return res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: nontechLeave.length, data: nontechLeave })
    }

    else {
        throw new NotFound(`No user with id ${userID}`)
    }

}
const leaveHistory = async (req, res) => {
    const { userID } = req.user

    if (await User.exists({ _id: userID, designation: 'faculty' })) {
        const facultyLeave = await Leave.find({ employee_id: userID }).sort('createdAt')
        return res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: facultyLeave.length, data: facultyLeave })
    }
    if (await User.exists({ _id: userID, designation: 'HOD' })) {
        const hodLeave = await HodLeave.find({ employee_id: userID }).sort('createdAt')
        return res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: hodLeave.length, data: hodLeave })
    }
    if (await User.exists({ _id: userID, department: 'non-tech' })) {
        const nontechLeave = await nonTechLeave.find({ employee_id: userID }).sort('createdAt')
        return res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: nontechLeave.length, data: nontechLeave })
    }
    else {
        throw new NotFound(`No user with id ${userID}`)
    }

}
const getApprovals = async (req, res) => {
    const { userID } = req.user
    const user = await User.findById(userID)
    if (user) {
        if (user.designation === 'faculty') {

            const hod1 = await HodLeave.find({
                'reference.name': user.name,
                status: ['applied', 'rejected']
            })
            const hod = hod1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.from_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            const firstYear1 = await Leave.find({
                'reference1.name': user.name,
                status: ['applied', 'rejected']
            })
            const firstYear = firstYear1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.from_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            const secondYear1 = await Leave.find({
                'reference2.name': user.name,
                status: ['applied', 'rejected']
            })
            const secondYear = secondYear1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.from_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            const thirdYear1 = await Leave.find({
                'reference3.name': user.name,
                status: ['applied', 'rejected']
            })
            const thirdYear = thirdYear1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.from_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            const fourthYear1 = await Leave.find({
                'reference4.name': user.name,
                status: ['applied', 'rejected']
            })
            const fourthYear = fourthYear1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.from_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            res.status(StatusCodes.OK).json({
                status: 'SUCCESS',
                hits: hod.length + firstYear.length + secondYear.length + thirdYear.length + fourthYear.length,
                data: {
                    HOD: { hits: hod.length, hod: hod },
                    first: { hits: firstYear.length, firstYear: firstYear },
                    second: { hits: secondYear.length, secondYear: secondYear },
                    third: { hits: thirdYear.length, thirdYear: thirdYear },
                    fourth: { hits: fourthYear.length, fourthYear: fourthYear }
                }
            })
        }
        if (user.designation === 'HOD') {

            const data1 = await Leave.find({
                employee_dep: user.department,
                'reference1.approved': true,
                'reference2.approved': true,
                'reference3.approved': true,
                'reference4.approved': true,
                status: ['applied', 'rejected']
            })
            const data = data1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.from_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: data.length, data: data })
        }
        if (user.designation === 'non-tech-head') {

            const data1 = await nonTechLeave.find({
                employee_dep: user.department,
                status: ['applied', 'rejected']
            })
            const data = data1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.from_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: data.length, data: data })
        }
        if (user.designation === 'principal') {
            const data11 = await Leave.find({
                HOD_approval: true,
                status: ['applied', 'rejected', 'approved']
            })
            const data1 = data11.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.from_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })

            const data22 = await HodLeave.find({
                'reference.approved': true,
                status: ['applied', 'rejected', 'approved']
            })
            const data2 = data22.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.from_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })

            const data33 = await nonTechLeave.find({
                head_approval: true,
                status: ['applied', 'rejected', 'approved']
            })
            const data3 = data33.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.from_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })

            res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: data1.length + data2.length + data3.length, data: { facultyLeave: { hits: data1.length, data: data1 }, HodLeave: { hits: data2.length, data: data2 }, nonTechLeave: { hits: data3.length, data: data3 } } })
        }
    }
    else {
        throw new NotFound(`no user with id ${userID}`)
    }
}
const resetAllLeave = async (req, res) => {
    const { userID } = req.user
    if (await User.exists({ _id: userID, designation: 'principal' })) {
        const data1 = await User.find({ designation: 'faculty' })
        data1.forEach(element => {
            element.leave_type = {
                casual_leave: 20,
                earned_leave: 20,
                medical_leave: 20,
                ordinary_leave: 20
            }
            element.save()
        });
        const data2 = await User.find({ designation: 'HOD' })
        data2.forEach(element => {
            element.leave_type = {
                casual_leave: 15,
                earned_leave: 15,
                medical_leave: 15,
                ordinary_leave: 15
            }
            element.save()
        });
        const data3 = await User.find({ department: 'non-tech' })
        data3.forEach(element => {
            element.leave_type = {
                casual_leave: 10,
                earned_leave: 10,
                medical_leave: 10,
                ordinary_leave: 10
            }
            element.save()
        });
        return res.status(StatusCodes.OK).json({ status: 'SUCCESS', data: { faculty: data1, HOD: data2, non_tech: data3 } })
    }
    else {
        throw new NotFound(`No user with id ${userID}`)
    }

}
const getApproved = async (req, res) => {
    const { userID } = req.user
    const user = await User.findById(userID)
    if (user) {
        if (user.designation === 'faculty') {

            const hod1 = await HodLeave.find({
                'reference.name': user.name,
                status: `completed`
            })
            const hod = hod1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.to_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            const firstYear1 = await Leave.find({
                'reference1.name': user.name,
                status: `completed`
            })
            const firstYear = firstYear1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.to_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            const secondYear1 = await Leave.find({
                'reference2.name': user.name,
                status: `completed`
            })
            const secondYear = secondYear1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.to_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            const thirdYear1 = await Leave.find({
                'reference3.name': user.name,
                status: `completed`
            })
            const thirdYear = thirdYear1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.to_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            const fourthYear1 = await Leave.find({
                'reference4.name': user.name,
                status: `completed`
            })
            const fourthYear = fourthYear1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.to_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            res.status(StatusCodes.OK).json({
                status: 'SUCCESS',
                hits: hod.length + firstYear.length + secondYear.length + thirdYear.length + fourthYear.length,
                data: {
                    HOD: { hits: hod.length, hod: hod },
                    first: { hits: firstYear.length, firstYear: firstYear },
                    second: { hits: secondYear.length, secondYear: secondYear },
                    third: { hits: thirdYear.length, thirdYear: thirdYear },
                    fourth: { hits: fourthYear.length, fourthYear: fourthYear }
                }
            })
        }
        if (user.designation === 'HOD') {

            const data1 = await Leave.find({
                employee_dep: user.department,
                status: `completed`
            })
            const data = data1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.to_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: data.length, data: data })
        }
        if (user.designation === 'non-tech-head') {

            const data1 = await nonTechLeave.find({
                employee_dep: user.department,
                status: `completed`
            })
            const data = data1.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.to_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: data.length, data: data })
        }
        if (user.designation === 'principal') {
            const data11 = await Leave.find({
                HOD_approval: true,
                status: `completed`
            })
            const data1 = data11.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.to_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            const data22 = await HodLeave.find({
                'reference.approved': true,
                status: `completed`
            })
            const data2 = data22.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.to_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })
            const data33 = await nonTechLeave.find({
                head_approval: true,
                status: `completed`
            })
            const data3 = data33.filter((element) => {
                const dateNow = Date.now()
                const toDate = new Date(element.to_date)
                const filterComponent = ((toDate - dateNow) + (1000 * 60 * 60 * 24))
                if (filterComponent > 0) {
                    return element
                }
                else {
                    return
                }
            })

            res.status(StatusCodes.OK).json({ status: 'SUCCESS', hits: data1.length + data2.length + data3.length, data: { facultyLeave: { hits: data1.length, data: data1 }, HodLeave: { hits: data2.length, data: data2 }, nonTechLeave: { hits: data3.length, data: data3 } } })
        }
    }
    else {
        throw new NotFound(`no user with id ${userID}`)
    }
}

module.exports = { alluser, leaveStatus, getApprovals, getApproved, leaveHistory, resetAllLeave }