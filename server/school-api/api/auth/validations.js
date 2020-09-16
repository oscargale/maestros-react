const { body } = require('express-validator/check');

let AdminAuthValidations = {
    login: [
        body('usuario').exists().trim(),
        body('password').exists().trim()
    ],
}

export default AdminAuthValidations;