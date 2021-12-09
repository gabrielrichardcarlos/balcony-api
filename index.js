const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cors = require('cors');
const { Sequelize } = require('sequelize');

const { User } = require('./models');

const createProductModule = require('./modules/product');
const createOrderModule = require('./modules/order');

const isProduction = process.env.NODE_ENV === 'production';

const jwtKey = 'balconyAppJwtKey';
const port = 3001;
const app = express();
const upload = multer();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(cookieParser());

/**
 * Authorization
 */
const authorization = (req, res, next) => {

  const token = req.cookies.access_token;

  if (!token) {
    return res.sendStatus(403);
  }

  try {
    const data = jwt.verify(token, jwtKey);
    
    req.userId = data.id;
    req.userEmail = data.email;

    return next();
  }
  catch {
    return res.sendStatus(403);
  }
};

/**
 * Modules
 */
createProductModule(app, upload.none(), authorization);
createOrderModule(app, upload.none());

/**
 * Create user
 */
app.post('/user/create', upload.none(), async (req, res) => {

  await User.sync();

  const { body } = req;

  if (body.passwordConfirm) {
    delete body.passwordConfirm;
  }

  const userToCreate = await User.create({
    ...body,
  });

  console.log(`[balcony-api] /user/create:`, userToCreate.toJSON());

  return res.status(200).json({
    success: true,
  });
});

/**
 * Validate user
 */
app.post('/user/validate', upload.none(), async (req, res) => {

  await User.sync();

  const { body } = req;

  const user = await User.findOne({
    where: {
      email: body.email,
      password: body.password,
    },
  });

  console.log(`[balcony-api] /user/validate/${body.email}:`, user);

  if (user) {

    const token = jwt.sign({
      id: user.id,
      email: user.email,
    }, jwtKey);
    
    return res.status(200).cookie('access_token', token, { httpOnly: true, secure: isProduction, }).json({
      success: true,
      token,
    });
  }

  return res.status(401).json({
    success: false,
  });
});

/**
 * Logout user
 */
app.get('/logout', authorization, (req, res) => {

  console.log(`[balcony-api] /logout`);
  
  return res.clearCookie('access_token').status(200).json({
    success: true,
  });
});

/**
 * Protected endpoint
 */
app.get('/user/info', authorization, async (req, res) => {

  await User.sync();

  const { userId, userEmail } = req;

  const user = await User.findOne({
    where: {
      id: userId,
      email: userEmail,
    },
  });

  console.log(`[balcony-api] /user/info:`, user);

  return res.json({
    success: user ? true : false,
    data: user.get(),
  });
});

/**
 * Start server
 */
app.listen(port, () => {
  console.log(`[balcony-api] listening at http://18.228.30.230:${port}`)
});
