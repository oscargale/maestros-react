import Sequelize from 'sequelize';
import sequelize from '../../../config/sequelize';
import { validationResult } from 'express-validator/check';
import moment from 'moment';
import { Student } from '../user/index';

class OptionalGradesController {
 
    static async getOptionalGrades (req, res, next) {

        const teacher = await Student.findByPk(req.user.id_usuario);
        console.log("teacher", teacher.id_personal);

        if(!teacher.id_personal) {
            res.json ({ success: false , message: 'getOptionalGrades' });
            return;
        }

        const config =  await sequelize.getInstanceMssql().query('SELECT semestre_actual FROM MAE_CONFIGURACION', { type: Sequelize.QueryTypes.SELECT });
        const semester = config[0].semestre_actual;

        const materiasOptativas = await sequelize.getInstanceMssql().query(
            ``,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const data = materiasOptativas[0];

        res.json ({ success: true , message: 'getOptionalGrades', data: data });
    }

}

export default OptionalGradesController;