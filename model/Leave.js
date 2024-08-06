const mongoose = require(`mongoose`)

const leaveSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Types.ObjectId,
        ref: 'UserData',
        required: [true, `please provide the user`]
    },
    employee_dep: String,
    employee_name: String,
    from_date: {
        type: Date,
        required: [true, 'must provide Starting Date']
    },
    to_date: {
        type: Date,
        required: [true, 'must provide Ending Date']
    },
    total_days: {
        type: Number,
        required: [true, 'must total Day']
    },
    discription: {
        type: String,
        required: [true, 'must provide the description ']
    },
    contect_no: {
        type: Number,
        required: [true, 'must provide your contect number']
    },
    leave_type: {
        type: String,
        enum: ['medical_leave', 'casual_leave', 'ordinary_leave', 'earned_leave'],
        required:[true,'Must provide your leave Type you are applying for']
    },
    // replacement:refrence,
    reference1: {
        name: {
            type: String,
            required:true
        },
        approved:Boolean
    },
    reference2: {
        name: {
            type: String,
            required:true
        },
        approved:Boolean
    },
    reference3: {
        name: {
            type: String,
            required:true
        },
        approved: Boolean
    },
    reference4: {
        name: {
            type: String,
            required:true

        },
        approved:Boolean
    },
    HOD_approval:Boolean,
    principal_approval:Boolean,
    status: {
        type: String,
        enum: ['applied', 'rejected', 'approved', 'completed'],
        default: 'applied'
    }


}, { timestamps: true })
module.exports = mongoose.model('leave', leaveSchema)