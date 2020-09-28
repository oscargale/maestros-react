import Sequelize from 'sequelize';
import sequelize from '../../../config/sequelize';
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
            `SELECT MAE_PERSONAL_MATERIAS.Id_Personal, MAE_PERSONAL_MATERIAS.Id_Materia, MAE_PERSONAL_MATERIAS.Id_Nivel, 
            MAE_PERSONAL_MATERIAS.Id_Grado, MAE_PERSONAL_MATERIAS.Grupo, MAE_PERSONAL_MATERIAS.Id_Status, 
            MAE_MATERIAS.Clave, MAE_MATERIAS.Materia, MAE_NIVELES.Nivel, MAE_GRADOS.Grado, MAE_PERSONAL_MATERIAS.Id_Mes_Captura
            FROM MAE_PERSONAL_MATERIAS LEFT OUTER JOIN MAE_MATERIAS ON MAE_PERSONAL_MATERIAS.Id_Materia = MAE_MATERIAS.Id_Materia 
            LEFT OUTER JOIN MAE_PERSONAL_FOTO ON MAE_PERSONAL_MATERIAS.Id_Personal = MAE_PERSONAL_FOTO.Id_Personal
            LEFT OUTER JOIN MAE_GRADOS ON MAE_PERSONAL_MATERIAS.Id_Grado = MAE_GRADOS.Id_Grado 
            LEFT OUTER JOIN MAE_NIVELES ON MAE_PERSONAL_MATERIAS.Id_Nivel = MAE_NIVELES.Id_Nivel
            WHERE MAE_PERSONAL_MATERIAS.Id_Status = 1 and MAE_PERSONAL_MATERIAS.Id_Personal='${teacher.id_personal}' AND MAE_MATERIAS.TIPO_MATERIA=2 
            and (Mae_Materias.Semestre=${semester} or Mae_Materias.Semestre=0)`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const data = materiasFaltas;

        res.json ({ success: true , message: 'getFaltas', data: data });
    }

    static async getCapturaFaltas (req, res, next) {
        if(!req.body) {
            res.json ({ success: true , message: 'error data' });
            return;
        }

        try {
            const config =  await sequelize.getInstanceMssql().query('SELECT semestre_actual FROM MAE_CONFIGURACION', { type: Sequelize.QueryTypes.SELECT });
            const semester = config[0].semestre_actual;
            let meses= null;
            // CONSULTA PARA MESES DE CAPTURA
            if (req.body.Id_Mes_Captura > 0) {
                if (req.body.idNivel === 4) {
                    meses = await sequelize.getInstanceMssql().query(
                        `Select Id_Mes, Mes from Mae_Mes_Captura Where Id_Status=1 and Periodo= ${semester}
                        and Id_Mes=${req.body.Id_Mes_Captura} and Id_Nivel=${req.body.Id_Nivel} Order by Id_Mes`,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                } else {
                    meses = await sequelize.getInstanceMssql().query(
                        `Select Id_Mes, Mes from Mae_Mes_Captura Where Id_Status=1
                        and Id_Mes='${req.body.Id_Mes_Captura}' and Id_Nivel='${req.body.Id_Nivel}' Order by Id_Mes`,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                }
            } else {
                meses = await sequelize.getInstanceMssql().query(
                    `Select Id_Mes, Mes from Mae_Mes_Captura Where Id_Status=1
                    and Id_Nivel='${req.body.Id_Nivel}' Order by Id_Mes`,
                    { type: Sequelize.QueryTypes.SELECT }
                );
            }

            // NIVEL DE INGLES
            const condicionMateria= '';

            if (req.body.Id_Nivel_Ingles > 0) { 
                condicionMateria= ' and A.Id_Nivel_Ingles=' + req.body.Id_Nivel_Ingles;
            }

            // CAPACITACION
            if (req.body.Capacitacion > 0) {
                condicionMateria= ' and A.Capacitacion= ' + req.body.Capacitacion;
            }

            // CAMPO CALIFICACIONES
            let campoFaltas= null;

            if (req.body.Id_Mes_Captura < 10){
                campoFaltas= "M0" + req.body.Id_Mes_Captura;
            } else { 
                campoFaltas= "M" + req.body.Id_Mes_Captura;
            }

            // ALUMNOS
            let alumnos= null;

            if (req.body.Id_Nivel === 4 && (req.body.Grupo!="A" && req.body.Grupo!="B" && req.body.Grupo!="C" && req.body.Grupo!="D" && req.body.Grupo!="E" && req.body.Grupo!="F") && req.body.Id_Grado === 3) {
                const especialidad = await sequelize.getInstanceMssql().query(
                    `SELECT id_especialidad FROM MAE_MATERIAS WHERE id_materia= '${req.body.Id_Materia}'`,
                    { type: Sequelize.QueryTypes.SELECT }
                )
                
                alumnos = await sequelize.getInstanceMssql().query(
                    `SELECT A.Ciclo, A.Matricula, A.Numero_Lista, A.Paterno, A.Materno, A.Nombre, A.Grupo, A.Id_Grado, A.Id_Nivel,
                    C.${campoFaltas} as Faltas, ${req.body.Id_Materia} AS Id_Materia, ${req.body.Id_Personal} AS Id_Personal, ${req.body.Id_Mes_Captura} AS Id_Mes_Captura
                    FROM MAE_ALUMNOS A LEFT OUTER JOIN (Select * From MAE_ASISTENCIAS Where Id_Materia = ${req.body.Id_Materia}) C ON
                    A.Grupo = C.Grupo AND A.Id_Grado = C.Id_Grado AND A.Id_Nivel = C.Id_Nivel AND A.Matricula = C.Matricula AND 
                    A.Ciclo = C.Ciclo WHERE (A.Ciclo = ${req.body.Ciclo}) AND (A.Id_Nivel = ${req.body.Id_Nivel}) AND 
                    (A.Id_Grado = ${req.body.Id_Grado}) AND (A.id_especialidad = ${especialidad}) and (A.Id_Status=1) ORDER BY BY A.Paterno,A.Materno,A.Nombre`,
                    { type: Sequelize.QueryTypes.SELECT }
                );
            } else {
                alumnos = await sequelize.getInstanceMssql().query(
                    `SELECT A.Ciclo, A.Matricula, A.Numero_Lista, A.Paterno, A.Materno, A.Nombre, A.Grupo, A.Id_Grado, A.Id_Nivel,
                    C.${campoFaltas} as Faltas, ${req.body.Id_Materia} AS Id_Materia, ${req.body.Id_Personal} AS Id_Personal, ${req.body.Id_Mes_Captura} AS Id_Mes_Captura
                    FROM MAE_ALUMNOS A LEFT OUTER JOIN 
                    (Select * From MAE_ASISTENCIAS Where Id_Materia = ${req.body.Id_Materia}) C 
                    ON A.Grupo = C.Grupo AND A.Id_Grado = C.Id_Grado AND A.Id_Nivel = C.Id_Nivel AND A.Matricula = C.Matricula AND 
                    A.Ciclo = C.Ciclo WHERE (A.Ciclo = ${req.body.Ciclo}) AND (A.Id_Nivel = ${req.body.Id_Nivel}) AND 
                    (A.Id_Grado = ${req.body.Id_Grado}) AND (A.Grupo = '${req.body.Grupo}') and (A.Id_Status=1) ORDER BY A.Numero_Lista`,
                    { type: Sequelize.QueryTypes.SELECT }
                );
            }

            res.json ({ success: true , message: 'getCaptura', data: {meses, alumnos} });
        }catch(error){
          console.log(error);
          res.json ({ success: false , message: 'getCaptura', error });
        }
    }

}

export default FaltasOficialesController;