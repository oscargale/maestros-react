import Sequelize from 'sequelize';
import sequelize from '../../../config/sequelize';
import { validationResult } from 'express-validator/check';
import moment from 'moment';
import { Student } from '../user/index';

class FaltasOficialesController {
 
    static async getFaltas (req, res, next) {

        const teacher = await Student.findByPk(req.user.id_usuario);
        console.log("teacher", teacher.id_personal);

        if(!teacher.id_personal) {
            res.json ({ success: false , message: 'getGrades' });
            return;
        }

        const config =  await sequelize.getInstanceMssql().query('SELECT semestre_actual FROM MAE_CONFIGURACION', { type: Sequelize.QueryTypes.SELECT });
        const semester = config[0].semestre_actual;

        const materiasFaltas = await sequelize.getInstanceMssql().query(
            `SELECT MAE_PERSONAL_MATERIAS.Id_Personal, MAE_PERSONAL_MATERIAS.Id_Materia, MAE_PERSONAL_MATERIAS.Id_Nivel, MAE_PERSONAL_MATERIAS.Id_Grado, MAE_PERSONAL_MATERIAS.Grupo,	MAE_PERSONAL_MATERIAS.Id_Status, MAE_MATERIAS.Clave, MAE_MATERIAS.Materia, MAE_PERSONAL_FOTO.Foto, MAE_NIVELES.Nivel, MAE_GRADOS.Grado, MAE_PERSONAL_MATERIAS.Id_Mes_Captura
                FROM MAE_PERSONAL_MATERIAS LEFT OUTER JOIN MAE_MATERIAS ON MAE_PERSONAL_MATERIAS.Id_Materia = MAE_MATERIAS.Id_Materia 
                LEFT OUTER JOIN MAE_PERSONAL_FOTO ON MAE_PERSONAL_MATERIAS.Id_Personal = MAE_PERSONAL_FOTO.Id_Personal
                    LEFT OUTER JOIN MAE_GRADOS ON MAE_PERSONAL_MATERIAS.Id_Grado = MAE_GRADOS.Id_Grado 
                    LEFT OUTER JOIN MAE_NIVELES ON MAE_PERSONAL_MATERIAS.Id_Nivel = MAE_NIVELES.Id_Nivel
                    WHERE MAE_PERSONAL_MATERIAS.Id_Status = 1 and MAE_PERSONAL_MATERIAS.Id_Personal='${teacher.id_personal}' AND MAE_MATERIAS.TIPO_MATERIA=2 
                and (Mae_Materias.Semestre='${semester}')`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const data = materiasFaltas;

        res.json ({ success: true , message: 'getFaltas', data: data });
    }

}

export default FaltasOficialesController;