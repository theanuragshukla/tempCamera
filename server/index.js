require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const port = process.env.PORT;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./config/database');
const saltRounds = 10;
const secret = process.env.JWT_SECRET_KEY;
const cors = require('cors');
const fs = require('fs');
const conn = require('./config/mongoDb');

const { imageSchema, userSchema, storageSchema } = require('./model');

const { generateUid, verifyToken, resolveToken } = require('./utils');
const {
    checkName,
    checkPass,
    checkEmail,
} = require('some-random-form-validator');
const { log } = require('console');
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
    cors({
        credentials: true,
        origin: ['http://localhost:5173'],
        methods: ['GET', 'POST'],
    })
);
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Credentials', true);
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});
app.get('/', (req, res) => {
    res.end("I'm alive!");
});
app.post('/login', (req, res) => {
    loginPost(req, res);
});

app.post('/signup', (req, res) => {
    signupPost(req, res);
});
app.get('/checkAuth', (req, res) => {
    checkAuth(req, res);
});
app.use(resolveToken);

app.get('/fetchImage/:uid', async (req, res) => {
    try {
        const { uid } = req.params;
        const imgObj = await imageSchema.findOne({ uid: uid });
        if (imgObj) {
            res.status(200).json({
                img: imgObj.img.data,
            });
        } else {
            res.status(404).json({ status: false, msg: 'invalid image id' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ status: false, msg: 'some error occoured' });
    }
});

app.get('/getProfile', async (req, res) => {
    try {
        const { name, email } = req.usrProf;
        const quota = await storageSchema.findOne({
            uid: req.usrProf.uid,
        });
        if (quota) {
            const { imgs, ttlImgs } = quota;
            const user = {
                name,
                email,
                imgs,
                ttlImgs,
            };
            console.log(quota);
            res.status(200).json({
                status: true,
                user: user,
            });
            return;
        }
    } catch (err) {
        console.log(err);
    }
    res.status(200).json({ status: true, user: req.usrProf });
});

app.post('/upload-image', async (req, res) => {
    const { img } = req.body;
    const uid = generateUid();
    //var base64Data = JSON.parse(img).replace(/^data:image\/jpeg;base64,/, '');
    //const path = __dirname + '/images/' + uid + '.jpeg';
    //fs.writeFile(path, base64Data, 'base64', function (err) {});
    const final_img = {
        uid: uid,
        img: {
            data: img,
            contentType: 'image/jpeg',
        },
    };
    new imageSchema(final_img)
        .save()
        .then((result) => {
            storageSchema.findOne(
                { uid: req.usrProf.uid },
                function (err, doc) {
                    if (doc) {
                        const idx = doc.ttlImgs % 10;
                        doc.imgs[idx] = result.uid;
                        doc.ttlImgs = doc.ttlImgs + 1;
                        doc.save()
                            .then((result) => {
                                res.status(200).json({ status: true });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    status: false,
                                    msg: 'some error occoured',
                                });
                            });
                    } else {
                        const tempStore = {
                            uid: req.usrProf.uid,
                            imgs: [res._id],
                            ttlImgs: 1,
                        };
                        new storageSchema(tempStore)
                            .save()
                            .then((result) => {
                                res.status(200).json({ status: true });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.status(500).json({
                                    status: false,
                                    msg: 'some error occoured',
                                });
                            });
                    }
                }
            );
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                status: false,
                msg: 'some error occoured',
            });
        });
});

const loginPost = async (req, res) => {
    const exists = await userSchema.findOne({ email: req.body.email });
    if (!exists) {
        res.send({ status: false, msg: 'Wrong email or password' });
    } else {
        console.log(exists);
        const match = await bcrypt.compare(req.body.pass, exists.pass);
        if (match) {
            const token = jwt.sign({ data: exists.uid }, secret, {
                expiresIn: '7d',
            });
            const expiryDate = new Date(Number(new Date()) + 7 * 24 * 3600000);
            res.cookie('token', token, {
                httpOnly: true,
                expires: expiryDate,
                path: '/',
            });
            res.status(200).send({ status: true });
            return;
        } else {
            res.send({ status: false, msg: 'wrong username or password' });
        }
    }
};
const signupPost = async (req, res) => {
    const { email, pass, name } = req.body;
    console.log(req.body);
    if (!checkEmail(email)) {
        res.status(400).json({ status: false, msg: 'invalid email' });
        return;
    }
    if (!checkPass(pass)) {
        res.status(400).json({ status: false, msg: 'unsafe password' });
        return;
    }
    if (!checkName(name)) {
        res.status(400).json({ status: false, msg: 'invalid name' });
        return;
    }
    const dupEmail = await userSchema.findOne({ email: email });
    console.log();
    if (dupEmail) {
        res.send({ status: false, email: true, msg: 'email exists' });
        return;
    }
    var passhash;
    await bcrypt.hash(pass, saltRounds).then(function (hash) {
        passhash = hash;
    });
    const uid = generateUid();
    const newUser = {
        uid: uid,
        name: name,
        email: email,
        pass: passhash,
    };
    try {
        await new userSchema(newUser).save();
        const token = jwt.sign({ data: uid }, secret, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 7 * 24 * 3600000,
        });
        res.status(200).json({ status: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: 'internal error', status: false });
    }
};
const checkDup = async (req, res) => {
    const toCheck = req.body.email ? 'email' : 'username';
    const query = `SELECT * FROM users WHERE ${toCheck} = $1;`;
    const value = [req.body.data];
    const dups = await db.query(query, value);
    if (dups.rows.length != 0) {
        res.status(200).send({ status: false });
        return;
    } else res.status(200).send({ status: true });
};
const checkAuth = async (req, res) => {
    const token = req.cookies.token;
    console.log(token);
    const authData = await verifyToken(token);
    res.status(200).json({
        result: authData.result,
        data: authData.result
            ? {
                  fname: authData.data.fname,
                  lname: authData.data.lname,
                  username: authData.data.username,
                  email: authData.data.email,
              }
            : {},
    });
};

http.listen(port, () => {
    console.log(`running on port ${port}`);
});
