const User = require('../model/User')
const Leave = require('../model/Leave')
const nonTechLeave = require('../model/non-techLeave')
const HodLeave = require('../model/HODLeave')
const { NotFound, UnAuthorizedError, BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const approve = async (req, res) => {
    const { userID } = req.user
    const { leaveId: targetID } = req.params
    const user = await User.findById(userID)
    if (user) {
        if (user.designation === 'faculty') {
            if (await Leave.exists({ _id: targetID, status: ['applied', 'rejected'] })) {
                const { refer, approval } = req.body
                console.log(refer,approval);
                const approveObject = {}
                if (refer === '1') {
                    approveObject.reference1 = {}
                    approveObject.reference1.name = user.name
                    approveObject.reference1.approved = approval
                    if (approval === 'true') {
                        approveObject.status = 'applied'
                    }
                    else {
                        approveObject.status = 'rejected'
                    }
                }
                if (refer === '2') {
                    approveObject.reference2 = {}
                    approveObject.reference2.name = user.name
                    approveObject.reference2.approved = approval
                    if (approval === 'true') {
                        approveObject.status = 'applied'
                    }
                    else {
                        approveObject.status = 'rejected'
                    }

                }
                if (refer === '3') {
                    approveObject.reference3 = {}
                    approveObject.reference3.name = user.name
                    approveObject.reference3.approved = approval
                    if (approval === 'true') {
                        approveObject.status = 'applied'
                    }
                    else {
                        approveObject.status = 'rejected'
                    }

                }
                if (refer === '4') {
                    approveObject.reference4 = {}
                    approveObject.reference4.name = user.name
                    approveObject.reference4.approved = approval
                    if (approval === 'true') {
                        approveObject.status = 'applied'
                    }
                    else {
                        approveObject.status = 'rejected'
                    }

                }
                console.log(approveObject);
                const data = await Leave.findOneAndUpdate({ _id: targetID }, approveObject, { new: true })
                return res.status(StatusCodes.OK).json({ status: 'SUCCESS', data: data })
            }
            if (await HodLeave.exists({ _id: targetID, status: ['applied'] })) {
                const { approval } = req.body
                const approveObject = {}
                approveObject.reference={}
                approveObject.reference.name = user.name
                approveObject.reference.approved = approval
                approveObject.HOD_approval=approval
                if (approval === 'true') {
                    approveObject.status = 'applied'
                }
                else {
                    approveObject.status = 'rejected'
                }
                console.log(approveObject);
                const data = await HodLeave.findOneAndUpdate({ _id: targetID }, approveObject, { new: true })
                return res.status(StatusCodes.OK).json({ status: 'SUCCESS', data: data })
            }
            else {
                throw new NotFound(`Leave not found ...`)
            }
        }

        if (user.designation === 'HOD') {
            if (await Leave.exists({ _id: targetID, employee_dep: user.department, status: ['applied','rejected'] })) {
                const { approval } = req.body
                const approveObject = {}
                if (approval === 'true') {
                    console.log(`its running`);
                    approveObject.HOD_approval = approval
                    approveObject.status = 'applied'
                }
                else {
                    console.log(`its running go`);
                    approveObject.HOD_approval = approval
                    approveObject.status = 'rejected'
                }
                const data = await Leave.findOneAndUpdate({ _id: targetID }, approveObject, { new: true })
                return res.status(200).json({ status: 'SUCCESS', data: data })
            }
            else {
                return res.status(404).json({ status: 'FAILED', msg: `Leave not found with id ${targetID}` })
            }
        }
        if (user.designation === 'non-tech-head') {
            if (await nonTechLeave.exists({ _id: targetID, employee_dep: user.department, status: ['applied','rejected'] })) {
                const { approval } = req.body
                const approveObject = {}
                if (approval === 'true') {
                    approveObject.head_approval = approval
                    approveObject.status = 'applied'
                }
                else {
                    approveObject.head_approval = approval
                    approveObject.status = 'rejected'
                }
                const data = await nonTechLeave.findOneAndUpdate({ _id: targetID }, approveObject, { new: true })
                return res.status(StatusCodes.OK).json({ status: 'SUCCESS', data: data })
            }
            else {
                throw new NotFound(`Leave not found with id ${targetID}`)
            }
        }

        if (user.designation === 'principal') {
            if (await Leave.exists({ _id: targetID })) {
                const leaveData = await Leave.findOne({ _id: targetID, status: ['applied', 'rejected', 'approved'] })
                const { approval, confirmation } = req.body
                const approveObject = {}
                const updateObj = {}
                if (confirmation === 'true' && approval === 'true') {
                    const type = leaveData.leave_type
                    const totalDay = leaveData.total_days
                    const leaveUser = await User.findOne({ _id: leaveData.employee_id })
                    const cl = leaveUser.leave_type.casual_leave
                    const ml = leaveUser.leave_type.medical_leave
                    const ol = leaveUser.leave_type.ordinary_leave
                    const el = leaveUser.leave_type.earned_leave


                    updateObj.leave_type = {}
                    if (type === 'casual_leave') {
                        updateObj.leave_type.casual_leave = cl - totalDay
                        updateObj.leave_type.medical_leave = ml
                        updateObj.leave_type.ordinary_leave = ol
                        updateObj.leave_type.earned_leave = el
                    }
                    if (type === 'medical_leave') {
                        updateObj.leave_type.casual_leave = cl
                        updateObj.leave_type.medical_leave = ml - totalDay
                        updateObj.leave_type.ordinary_leave = ol
                        updateObj.leave_type.earned_leave = el
                    }
                    if (type === 'earned_leave') {
                        updateObj.leave_type.casual_leave = cl
                        updateObj.leave_type.medical_leave = ml
                        updateObj.leave_type.ordinary_leave = ol
                        updateObj.leave_type.earned_leave = el - totalDay
                    }
                    if (type === 'ordinary_leave') {
                        updateObj.leave_type.casual_leave = cl
                        updateObj.leave_type.medical_leave = ml
                        updateObj.leave_type.ordinary_leave = ol - totalDay
                        updateObj.leave_type.earned_leave = el
                    }
                    console.log(updateObj);

                    const data3 = await Leave.findOneAndUpdate({ _id: targetID }, { principal_approval: true, status: 'completed' }, { new: true })
                    const data2 = await User.findOneAndUpdate({ _id: leaveData.employee_id }, updateObj, { new: true })
                    return res.status(StatusCodes.OK).json({ status: 'SUCCESS', userUpadated: 'TRUE', data: data3, user: data2 })
                }
                if (approval === 'true') {
                    approveObject.principal_approval = approval
                    approveObject.status = 'approved'
                }
                else {
                    approveObject.principal_approval = approval
                    approveObject.status = 'rejected'
                }
                const leaveUpdate = await Leave.findOneAndUpdate({ _id: targetID }, approveObject, { new: true })
                return res.status(200).json({ status: 'SUCCESS', data: leaveUpdate, })


            }
            if (await HodLeave.exists({ _id: targetID })) {
                const leaveData = await HodLeave.findOne({ _id: targetID, status: ['applied', 'rejected', 'approved'] })
                const { approval, confirmation } = req.body
                const approveObject = {}
                const updateObj = {}
                if (confirmation === 'true' && approval === 'true') {
                    const type = leaveData.leave_type
                    const totalDay = leaveData.total_days
                    const leaveUser = await User.findOne({ _id: leaveData.employee_id })
                    const cl = leaveUser.leave_type.casual_leave
                    const ml = leaveUser.leave_type.medical_leave
                    const ol = leaveUser.leave_type.ordinary_leave
                    const el = leaveUser.leave_type.earned_leave

                    updateObj.leave_type = {}
                    if (type === 'casual_leave') {
                        updateObj.leave_type.casual_leave = cl - totalDay
                        updateObj.leave_type.medical_leave = ml
                        updateObj.leave_type.ordinary_leave = ol
                        updateObj.leave_type.earned_leave = el
                    }
                    if (type === 'medical_leave') {
                        updateObj.leave_type.casual_leave = cl
                        updateObj.leave_type.medical_leave = ml - totalDay
                        updateObj.leave_type.ordinary_leave = ol
                        updateObj.leave_type.earned_leave = el
                    }
                    if (type === 'earned_leave') {
                        updateObj.leave_type.casual_leave = cl
                        updateObj.leave_type.medical_leave = ml
                        updateObj.leave_type.ordinary_leave = ol
                        updateObj.leave_type.earned_leave = el - totalDay
                    }
                    if (type === 'ordinary_leave') {
                        updateObj.leave_type.casual_leave = cl
                        updateObj.leave_type.medical_leave = ml
                        updateObj.leave_type.ordinary_leave = ol - totalDay
                        updateObj.leave_type.earned_leave = el
                    }
                    const data3 = await HodLeave.findOneAndUpdate({ _id: targetID }, { principal_approval: approval, status: 'completed' }, { new: true })
                    const data2 = await User.findOneAndUpdate({ _id: leaveData.employee_id }, updateObj, { new: true })
                    return res.status(StatusCodes.OK).json({ status: 'SUCCESS', userUpadated: 'TRUE', data: data3, user: data2 })
                }
                if (approval == true) {
                    approveObject.principal_approval = approval
                    approveObject.status = 'approved'
                }
                else {
                    approveObject.principal_approval = approval
                    approveObject.status = 'rejected'
                }
                const leaveUpdate = await HodLeave.findOneAndUpdate({ _id: targetID }, approveObject, { new: true })
                return res.status(200).json({ status: 'SUCCESS', data: leaveUpdate, })
            }

            if (await nonTechLeave.exists({ _id: targetID })) {

                const leaveData = await nonTechLeave.findOne({ _id: targetID, status: ['applied', 'rejected', 'approved'] })

                const { approval, confirmation } = req.body
                const approveObject = {}
                const updateObj = {}
                if (confirmation === `true` && approval === `true`) {
                    const type = leaveData.leave_type
                    const totalDay = leaveData.total_days
                    const leaveUser = await User.findOne({ _id: leaveData.employee_id })
                    const cl = leaveUser.leave_type.casual_leave
                    const ml = leaveUser.leave_type.medical_leave
                    const ol = leaveUser.leave_type.ordinary_leave
                    const el = leaveUser.leave_type.earned_leave


                    updateObj.leave_type = {}
                    if (type === 'casual_leave') {
                        updateObj.leave_type.casual_leave = cl - totalDay
                        updateObj.leave_type.medical_leave = ml
                        updateObj.leave_type.ordinary_leave = ol
                        updateObj.leave_type.earned_leave = el
                    }
                    if (type === 'medical_leave') {
                        updateObj.leave_type.casual_leave = cl
                        updateObj.leave_type.medical_leave = ml - totalDay
                        updateObj.leave_type.ordinary_leave = ol
                        updateObj.leave_type.earned_leave = el
                    }
                    if (type === 'earned_leave') {
                        updateObj.leave_type.casual_leave = cl
                        updateObj.leave_type.medical_leave = ml
                        updateObj.leave_type.ordinary_leave = ol
                        updateObj.leave_type.earned_leave = el - totalDay
                    }
                    if (type === 'ordinary_leave') {
                        updateObj.leave_type.casual_leave = cl
                        updateObj.leave_type.medical_leave = ml
                        updateObj.leave_type.ordinary_leave = ol - totalDay
                        updateObj.leave_type.earned_leave = el
                    }
                    console.log(updateObj);

                    const data3 = await nonTechLeave.findOneAndUpdate({ _id: targetID }, { principal_approval: true, status: 'completed' }, { new: true })
                    const data2 = await User.findOneAndUpdate({ _id: leaveData.employee_id }, updateObj, { new: true })
                    return res.status(StatusCodes.OK).json({ status: 'SUCCESS', userUpadated: 'TRUE', data: data3, user: data2 })
                }
                if (approval === `true`) {
                    approveObject.principal_approval = approval
                    approveObject.status = 'approved'
                }
                else {
                    approveObject.principal_approval = approval
                    approveObject.status = 'rejected'
                }
                const leaveUpdate = await nonTechLeave.findOneAndUpdate({ _id: targetID }, approveObject, { new: true })
                return res.status(200).json({ status: 'SUCCESS', data: leaveUpdate, })

            }
            else {
                throw new NotFound(`Leave not found with id ${targetID}`)
            }
        }
    }
    else {
        throw new NotFound(`no user with id ${userID}`)
    }
}

module.exports = approve