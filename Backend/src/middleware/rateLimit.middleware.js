import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
    windowMs : 15 * 60 * 1000, // 15min

    max : 500 , // max 100 req in 15 min

    message : {
        message : "Too many requests from this IP, Please try again later"
    },
    standardHeaders : true,
    legacyHeaders : false
})
