const jwt =require('jsonwebtoken')
const {BadRequestError,NotFound}=require('../errors')

const auth=(req,res,next)=>{
    const {authorization}=req.headers
    if(!authorization||!authorization.startsWith('Bearer ')){
        throw new BadRequestError(`please provide token`)
    }
    const token =authorization.split(' ')[1]
    try {
        const decode=jwt.verify(token,process.env.JWT_SECRET)
        req.user=decode
        next()
    } catch (error) {
        throw new BadRequestError('Something went wrong while verifying the token. try again...')
    }
}

module.exports=auth