import jwt from 'jwt-simple';
import bcrypt from 'bcryptjs';
import config from '../../../config/env';
import { Student } from '../user/index';
import * as Error from '../../exceptions/constants';
import ExceptionHandler from '../../exceptions/handler';
import { validationResult } from 'express-validator/check';
import sequelize from '../../../config/sequelize';
import Sequelize from 'sequelize';
import BaseException from '../../exceptions/base';

class UserAuthController {

  static async login (req, res, next) {
    
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
      }

      const { usuario, password } = req.body;

      Student
        .findOne({ where: { usuario } })
        .then((user) => {
          if (!user) {
            return Promise
              .reject(ExceptionHandler
                .badRequestException(Error.USER_DOES_NOT_EXIST));
          } else {
            const match = user.password === password;
            if (match) {
              /* FIXME: convert user object */
              const token = jwt.encode(user, config.jwtSecret);
              res.json({
                message: 'Sign in successfully',
                token: `JWT ${token}`,
                type: user.user_type
              });
            } else {
              return Promise
                .reject(ExceptionHandler
                  .badRequestException(Error.SIGN_IN_INVALID_CREDENTIALS));
            }
          }
        })
        .catch((err) => {
          next(err);
        });

  }

  static me (req, res, next) {
    Student
      .findByPk(req.user.id_usuario)
      .then((user) => {
        res.json(user);
      });
  }

}

export default UserAuthController;
