const path=require('path')
const notFound = (req, res) => {
    // res.status(404).json({
    //     status: 'FAILED',
    //     msg: `not found the resources...(No Routes available)`
    // })
    return res.status(404).sendFile(path.resolve(__dirname,'../','../frontend/404/404.html'))

}
module.exports = notFound

