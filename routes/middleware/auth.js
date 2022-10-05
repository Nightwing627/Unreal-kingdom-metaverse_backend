//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables --- 
const jwt = require('express-jwt');
require("dotenv/config");

// *** --- get token from request header --- 
function getTokenFromHeader(req) {
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

// *** --- implement passport auth middleware ---
const auth = {
    required: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        getToken: getTokenFromHeader,
    }),
    optional: jwt({
        secret: process.env.SECRET,
        userProperty: 'payload',
        credentialsRequired: false,
        getToken: getTokenFromHeader,
    }),
};

// *** --- export auth ---
module.exports = auth;
