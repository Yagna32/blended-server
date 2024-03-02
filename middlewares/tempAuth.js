const jwt = require('jsonwebtoken')
const {jwtKeys}= require('../configs/keys')
const verifyAccessToken = async (token) => {
    try {
        const payload = await jwt.verify(token, jwtKeys.ACCESS_TOKEN);
        return payload;
    } catch (error) {
        const Unauthorizederror = new Error("Unauthorized");
        Unauthorizederror.status=401;
        throw Unauthorizederror
    }
}

const verifyRefreshToken= async (refreshToken) => {
    try {
        const payload = await jwt.verify(refreshToken, jwtKeys.REFRESH_TOKEN);
        return payload;
    } catch (error) {
        const Unauthorizederror = new Error("Unauthorized");
        Unauthorizederror.status=401;
        throw Unauthorizederror
    }
}

const signAccessToken= async (user) => {
    try {
        const payload = {
            email: user.email
        };
        const token = await jwt.sign(payload,jwtKeys.ACCESS_TOKEN, {
            expiresIn: jwtKeys.accesstokenLife,
            issuer: jwtKeys.issuer
        });
        return token;
    } catch (error) {
        console.log(error);
        throw new Error("Internal Server Error");
    }
}

const signRefreshToken= async (user) => {
    try {
        const payload = {
            email: user.email
        };
        const token = await jwt.sign(payload, jwtKeys.REFRESH_TOKEN, {
            expiresIn: jwtKeys.refreshtokenLife,
            issuer: jwtKeys.issuer
        });
        return token;
    } catch (error) {
        console.error(error);
        throw new Error("Internal Server Error");
    }
}

const Authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const access_token = authHeader && authHeader.split(' ')[1];
        const refresh_token = req.headers['refresh-token'];
        if(!access_token || !refresh_token) {
            throw new Error("Unauthorized")
        }
        await verifyAccessToken(access_token);
        const payload = await verifyRefreshToken(refresh_token);
        req.user = payload
        next()
    } catch (error) {
        const message = error.message === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
        const err = new Error(message)
        err.status=401;
        next(err);
    }
// const Authenticate = async (req, res, next) => {
//     try {
//         const authHeader = req.headers['authorization'];
//         const access_token = authHeader && authHeader.split(' ')[1];
//         let access_payload = false;
//         let refresh_payload=false;
//         if (access_token != null) {
//              access_payload = await verifyAccessToken(access_token);
//         }
//         const refresh_token = req.headers['refresh-token'];
//         if(!refresh_token){
//             res.status(401).json({
//                 error: "Unauthorized"
//             })
//         }
//         else {
//              refresh_payload = await verifyRefreshToken(refresh_token);
//         }
//         if(access_payload === false && refresh_payload) {
//             const access_token = await signAccessToken(refresh_payload);
//             const refresh_token = await signRefreshToken(refresh_payload);
//             req.access_token = access_token
//             req.refresh_token = refresh_token
//         }
//         req.user = refresh_payload;
//         next()
//     } catch (error) {
//         console.error(error);
//         const message = error.message === 'JsonWebTokenError' ? 'Unauthorized' : error.message;
//         next(new Error(message));
//     }
}
module.exports = {
signAccessToken,signRefreshToken,Authenticate,verifyRefreshToken,verifyAccessToken
};
