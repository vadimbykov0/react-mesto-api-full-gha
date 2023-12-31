const signInRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { emailRegex } = require('../utils/constants');
const { login } = require('../controllers/users');

signInRouter.post('/', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(emailRegex),
    password: Joi.string().required(),
  }),
}), login);

module.exports = signInRouter;
