const mongoose = require(`mongoose`)
const bcrypt = require(`bcryptjs`)
const jwt = require(`jsonwebtoken`)


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    gender: {
        type: String,
        enum:['male','female']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: [true, 'Must provide Your name'],
    },
    mob_no: {
        type: Number,
        min:1000000000,
        max:9999999999
    },
    designation: {
        type: String,
        enum: ['faculty', 'HOD', 'principal','non-tech-employee','non-tech-head'],
    },
    contect_type: {
        type: String,
        enum: ['contract', 'parmanent'],
    },
    department: {
        type: String,
        enum: ['Computer Science', 'Information Tecnology', 'ET & T', 'Mechanical', 'Mining', 'Electrical', 'Civil','non-tech']
    },
    title: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Must provide'],
    },
    profileCompleted: {
        type: Boolean,
        default: false
    },
    leave_type:Object,
    verified: {
        type: Boolean,
        default: false
    },
})

userSchema.methods.leaveSchema= async function(){
    if(this.department==="non-tech"){
        this.leave_type={
            casual_leave:10,
            earned_leave:10,
            medical_leave:10,
            ordinary_leave:10
        }
    }
    else{
        this.leave_type={
            casual_leave:20,
            earned_leave:20,
            medical_leave:20,
            ordinary_leave:20
        }
    }
}

userSchema.methods.generateJWT = function () {
    const token = jwt.sign({ userID: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.EXPIRE })
    return token
}
userSchema.methods.CompPass = async function (userPassword) {
    const match = await bcrypt.compare(userPassword, this.password)
    return match
}
module.exports = mongoose.model('UserData', userSchema)


    //it will not work
    
    
    // userSchema.pre('save', async function () {
    //     const designation = this.designation
    //     console.log(designation);
    //     console.log(`its running`);
    //     if (designation) {
    //         if (designation == 'non-tech') {
    
    //             this.leave_type = techLeaveSchema
    //         }
    //         else {
    //             this.leave_type = nonTechLeaveSchema
    
    //         }
    //     }
    // })
    // const techLeaveSchema = new mongoose.Schema({
    //     casual_leave: {
    //         type: Number,
    //         default: 10
    //     },
    //     earned_leave: {
    //         type: Number,
    //         default: 10
    //     },
    //     medical_leave: {
    //         type: Number,
    //         default: 10
    //     },
    //     ordinary_leave: {
    //         type: Number,
    //         default: 10
    //     }
    // })
    // const nonTechLeaveSchema = new mongoose.Schema({
        
    // })