const crypto = require('crypto');
//const db = require('./config/database');
const secret = process.env.JWT_SECRET_KEY;
const jwt = require('jsonwebtoken');
const { userSchema } = require('./model');

const verifyToken = async (authToken) => {
    try {
        const payload = jwt.verify(authToken, secret);
        //const query = `SELECT * FROM users WHERE uid = $1;`;
        //const values = [payload.data];
        //const { rows } = await db.query(query, values);
        const user = await userSchema.findOne({ uid: payload.data });
        if (!user) {
            return { result: false };
        } else {
            return { result: true, data: user, uid: payload.data };
        }
    } catch (e) {
        return { result: false };
    }
};
const generateUid = (len = 16) => {
    const uid = crypto.randomBytes(len).toString('hex');
    return uid;
};
const excludedRoutes = ['/'];
const resolveToken = async (req, res, next) => {
    const url = req.originalUrl.split('?')[0];
    if (excludedRoutes.includes(url)) {
        next();
    } else {
        const token = req.cookies.token;
        const authData = await verifyToken(token);
        if (!authData.result) {
            if (req.method == 'GET') {
                res.redirect(`http://${req.header('host')}/`);
            } else {
                res.status(401).json({
                    status: false,
                    msg: 'unauthorised access',
                });
            }
            return;
        } else {
            req.usrProf = authData.data;
            next();
        }
    }
};

module.exports = {
    verifyToken,
    generateUid,
    resolveToken,
};
