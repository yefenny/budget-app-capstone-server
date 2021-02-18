const express = require('express');
const AuthService = require('../auth/auth-service');
const UsersService = require('./users-service');
const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter.route('/').post(jsonBodyParser, async (req, res, next) => {
  const { password, user_name, name } = req.body;

  for (const field of ['name', 'user_name', 'password'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  try {
    const passwordError = UsersService.validatePassword(password);

    if (passwordError) return res.status(400).json({ error: passwordError });

    const hasUserWithUserName = await UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    );

    if (hasUserWithUserName)
      return res.status(400).json({ error: `User_name already taken` });

    const hashedPassword = await UsersService.hashPassword(password);

    const newUser = {
      user_name,
      password: hashedPassword,
      name
    };

    const user = await UsersService.insertUser(req.app.get('db'), newUser);

    const sub = user.user_name;
    const payload = {
      user_id: user.id,
      name: user.name
    };
    res.send({
      authToken: AuthService.createJwt(sub, payload)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = usersRouter;
