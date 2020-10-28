const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const cookieParser = require('cookie-parser');
const axios = require('axios').default
const { config } = require('./config');

const app = express();

app.use(express.json());
app.use(cookieParser());

// Strategy basic
require('./utils/auth/strategies/basic');

// OAuth strategy
require('./utils/auth/strategies/oauth');

const THIRTY_DAYS__IN_SEC = 2592000;
const TWO_HOURS_IN_SEC = 7200;

app.post('/auth/sign-in', async (req, res, next) => {
  const { rememberMe } = req.body;

  passport.authenticate('basic', (error, data) => {
    try {
      if(error || !data) {
        next(boom )
      };

      const { token, ...user } = data;

      req.login(data, { session: false }, async (error) => {
        if (error) {
          next(error);
        };


        res.cookie('token', token, {
          httpOnly: !config.dev,
          secure: !config.dev,
          maxAge: rememberMe ? THIRTY_DAYS__IN_SEC : TWO_HOURS_IN_SEC
        });

        res.status(200).json(user);
      });
    } catch (error) {
      next(error);
    };

  })(req, res, next)
});


app.post('/auth/sign-up', async (req, res, next) => {
    const { body: user } = req;

    try {
      await axios({
        url: `${config.apiUrl}/api/auth/sign-up`,
        method: 'post',
        data: user
      });

      res.status(201).json({ message: 'user created'});
    } catch (error) {
      next(error);
    };
});

app.get(
  '/auth/google-oauth',
  passport.authenticate('google-oauth', {
    scope: ['email', 'profile', 'openid']
  })
);

app.get(
  "/auth/google-oauth/callback",
  passport.authenticate('google-oauth', { session: false}),
  function (req, res, next) {
    if (!req.user) {
      next(boom.unauthorized());
    };

    const { token, ...user } = req.user;

    console.log('GET CallBAck', token)
    res.cookie('token', token, {
      httpOnly: !config.dev,
      secure: !config.dev
    });

    res.status(200).json(user);
  }
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email", "profile", "openid"]
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  function(req, res, next) {
    if (!req.user) {
      next(boom.unauthorized());
    }

    const { token, ...user } = req.user;

    res.cookie("token", token, {
      httpOnly: !config.dev,
      secure: !config.dev
    });

    res.status(200).json(user);
  }
);

app.listen(config.port, () => {
  console.log(`Listening http://localhost:${config.port}`)
});

