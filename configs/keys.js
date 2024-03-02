module.exports = {
    app: {
        name: "Shopper",
        apiURL: process.env.API_BASE_URL
    },
    port: process.env.PORT || 4000,
    jwtKeys: {
        ACCESS_TOKEN: process.env.SECRET_ACCESS_TOKEN,
        REFRESH_TOKEN: process.env.SECRET_REFRESH_TOKEN,
        refreshtokenLife: '1d',
        accesstokenLife:'360s',
        issuer: 'https://github.com/Yagna32'
    },
    db: {
        MONGO_URI: process.env.MONGO_DB_URI
    },
    payment: {
        STRIPE_KEY: process.env.STRIPE_API_KEY,
        FRONTEND_URL: process.env.FRONTEND_URL,
        SECRET_KEY: process.env.STRIPE_SECRET_KEY
    },
    email: {
        USER: process.env.NODEMAILER_EMAIL_USER,
        PASS: process.env.NODEMAILER_EMAIL_CRED,
        HOST: process.env.NODEMAILER_HOST,
        PORT: process.env.NODEMAILER_PORT,
        EMAIL_FROM: process.env.NODEMAILER_EMAIL_FROM,
        EMAIL_SUB: process.env.NODEMAILER_EMAIL_SUBJECT,
        EMAIL_TEXT: process.env.NODEMAILER_EMAIL_TEXT
    },
    CLOUDINARY: {
        CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
        API_KEY: process.env.CLOUDINARY_API_KEY,
        SECRET_KEY: process.env.CLOUDINARY_SECRET_KEY,
        URL: process.env.CLOUDINARY_URL
    }
}