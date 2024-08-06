const UnAuthorizedError = require('./un-authorized')
const BadRequestError = require('./bad-request')
const CustomAPIError = require('./custom-error')
const NotFound = require('./not-found')

module.exports = {
    UnAuthorizedError,
    CustomAPIError,
    BadRequestError,
    NotFound
}