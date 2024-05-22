// middleware/authMiddleware.js

const Joi = require("joi");

// Register validation
const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("admin", "user")
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    password: Joi.string().min(6).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  next();
};

module.exports = { registerValidation, loginValidation };
