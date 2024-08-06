const mongoose = require(`mongoose`)

const nonTechLeaveSchema = new mongoose.Schema({
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
        required: [true, 'must provide the discription for your leave ']
    },
    contect_no: {
        type: Number,
        required: [true, 'must provide contect no']
    },
    leave_type: {
        type: String,
        enum: ['medical_leave', 'casual_leave', 'ordinary_leave', 'earned_leave'],
        required: [true, 'must provide leave type for applying leave']
        
    },
    head_approval: Boolean,
    principal_approval: Boolean,
    status: {
        type: String,
        enum: ['applied', 'rejected', 'approved', 'completed'],
        default: 'applied'
    }


}, { timestamps: true })
module.exports = mongoose.model('non-tech-leave', nonTechLeaveSchema)