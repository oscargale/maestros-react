import Sequelize from 'sequelize';
import sequelize from '../../../config/sequelize';
import { Student } from '../user/index';

class GradesController {
 
    static async getGrades (req, res, next) {

        const teacher = await Student.findByPk(req.user.id_usuario);
        console.log("teacher", teacher.id_personal);

        if(!teacher.id_personal) {
            res.json ({ success: false , message: 'getGrades' });
            return;
        }

        const config =  await sequelize.getInstanceMssql().query('SELECT semestre_actual FROM MAE_CONFIGURACION', { type: Sequelize.QueryTypes.SELECT });
        const semester = config[0].semestre_actual;

        const materias = await sequelize.getInstanceMssql().query(
            `SELECT MAE_PERSONAL_MATERIAS.Id_Personal, MAE_PERSONAL_MATERIAS.Id_Materia, 
            MAE_PERSONAL_MATERIAS.Id_Nivel, MAE_PERSONAL_MATERIAS.Id_Grado, MAE_PERSONAL_MATERIAS.Grupo,
            MAE_PERSONAL_MATERIAS.Id_Status, MAE_MATERIAS.Clave, MAE_MATERIAS.Materia, 
            MAE_NIVELES.Nivel, MAE_GRADOS.Grado, MAE_PERSONAL_MATERIAS.Id_Nivel_Ingles,
            MAE_PERSONAL_MATERIAS.Capacitacion, MAE_PERSONAL_MATERIAS.Id_Mes_Captura, MAE_PERSONAL_MATERIAS.Ciclo
            FROM MAE_PERSONAL_MATERIAS LEFT OUTER JOIN
            MAE_MATERIAS ON MAE_PERSONAL_MATERIAS.Id_Materia = MAE_MATERIAS.Id_Materia 
            LEFT OUTER JOIN MAE_GRADOS ON MAE_PERSONAL_MATERIAS.Id_Grado = MAE_GRADOS.Id_Grado 
            LEFT OUTER JOIN MAE_NIVELES ON MAE_PERSONAL_MATERIAS.Id_Nivel = MAE_NIVELES.Id_Nivel
            WHERE MAE_PERSONAL_MATERIAS.Id_Status = 1 and MAE_PERSONAL_MATERIAS.Id_Personal='${teacher.id_personal}' AND MAE_MATERIAS.Tipo_Materia=2 
            and (Mae_Materias.Semestre=${semester} or Mae_Materias.Semestre=0)`,
            { type: Sequelize.QueryTypes.SELECT }
        );

        const data = materias;

        res.json ({ success: true , message: 'getGrades', data: data });
    }

    static async getCaptura (req, res, next) {
        if(!req.body) {
            res.json ({ success: false , message: 'error data' });
            return;
        }

        try {
            console.log(req.body);
            const config =  await sequelize.getInstanceMssql().query('SELECT semestre_actual FROM MAE_CONFIGURACION', { type: Sequelize.QueryTypes.SELECT });
            const semester = config[0].semestre_actual;
            let meses= null;
            // CONSULTA PARA MESES DE CAPTURA
            if (req.body.Id_Mes_Captura > 0) {
                if (req.body.Id_Nivel === 4) {
                    meses = await sequelize.getInstanceMssql().query(
                        `Select Id_Mes, Mes from Mae_Mes_Captura Where Id_Status=1 and Periodo=${semester}
                        and Id_Mes=${req.body.Id_Mes_Captura} and Id_Nivel=${req.body.Id_Nivel} Order by Id_Mes`,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                } else {
                    meses = await sequelize.getInstanceMssql().query(
                        `Select Id_Mes, Mes from Mae_Mes_Captura Where Id_Status=1
                        and Id_Mes=${req.body.Id_Mes_Captura} and Id_Nivel=${req.body.Id_Nivel} Order by Id_Mes`,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                }
            } else {
                meses = await sequelize.getInstanceMssql().query(
                    `Select Id_Mes, Mes from Mae_Mes_Captura Where Id_Status=1
                    and Id_Nivel=${req.body.Id_Nivel} Order by Id_Mes`,
                    { type: Sequelize.QueryTypes.SELECT }
                );
            }

            // NIVEL DE INGLES
            let condicionMateria= '';
            if (req.body.Id_Nivel_Ingles > 0) { 
                condicionMateria= ' and A.Id_Nivel_Ingles=' + req.body.Id_Nivel_Ingles;
                console.log("entro condicion", condicionMateria);
            }

            // CAPACITACION
            if (req.body.Capacitacion > 0) {
                condicionMateria= ' and A.Capacitacion= ' + req.body.Capacitacion;
            }

            // CAMPO CALIFICACIONES
            let campoCalificacion= null;
            if (req.body.Id_Mes_Captura < 10){
                campoCalificacion= "M0" + req.body.Id_Mes_Captura;
            } else { 
                campoCalificacion= "M" + req.body.Id_Mes_Captura;
            }

            // ALUMNOS
            let alumnos= null;
            if (req.body.Id_Nivel === 4 && (req.body.Grupo!="A" && req.body.Grupo!="B" && req.body.Grupo!="C" && req.body.Grupo!="D" && req.body.Grupo!="E" && req.body.Grupo!="F") && req.body.Id_Grado === 3) {
                const configEsp = await sequelize.getInstanceMssql().query(
                    `SELECT id_especialidad FROM MAE_MATERIAS WHERE id_materia= '${req.body.Id_Materia}'`,
                    { type: Sequelize.QueryTypes.SELECT }
                )

                let especialidad= configEsp[0].id_especialidad;
                
                alumnos = await sequelize.getInstanceMssql().query(
                    `SELECT A.Ciclo, A.Matricula, A.Numero_Lista, A.Paterno, A.Materno, A.Nombre, A.Grupo, A.Id_Grado, A.Id_Nivel,
                    C.${campoCalificacion} as Calificacion, ${req.body.Id_Materia} AS Id_Materia, ${req.body.Id_Personal} AS Id_Personal, 
                    ${req.body.Id_Mes_Captura} AS Id_Mes_Captura, '${req.body.Materia}' AS Materia
                    FROM MAE_ALUMNOS A LEFT OUTER JOIN 
                    (Select * From MAE_CALIFICACIONES Where Id_Materia = '${req.body.Id_Materia}') C 
                    ON A.Grupo = C.Grupo AND A.Id_Grado = C.Id_Grado AND A.Id_Nivel = C.Id_Nivel
                    AND A.Matricula = C.Matricula AND A.Ciclo = C.Ciclo WHERE (A.Ciclo = '${req.body.Ciclo}') AND 
                    (A.Id_Nivel = '${req.body.Id_Nivel}') AND (A.Id_Grado = '${req.body.Id_Grado}') 
                    AND (A.id_especialidad = '${especialidad}') and (A.Id_Status=1) ${condicionMateria} 
                    ORDER BY A.Paterno,A.Materno,A.Nombre`,
                    { type: Sequelize.QueryTypes.SELECT }
                );
            } else {
                alumnos = await sequelize.getInstanceMssql().query(
                    `SELECT A.Ciclo, A.Matricula, A.Numero_Lista, A.Paterno, A.Materno, A.Nombre, A.Grupo, A.Id_Grado, A.Id_Nivel,
                    C.${campoCalificacion} as Calificacion, ${req.body.Id_Materia} AS Id_Materia, ${req.body.Id_Personal} AS Id_Personal, 
                    ${req.body.Id_Mes_Captura} AS Id_Mes_Captura, '${req.body.Materia}' AS Materia
                    FROM MAE_ALUMNOS A LEFT OUTER JOIN 
                    (Select * From MAE_CALIFICACIONES Where Id_Materia = '${req.body.Id_Materia}') C 
                    ON A.Grupo = C.Grupo AND A.Id_Grado = C.Id_Grado AND A.Id_Nivel = C.Id_Nivel
                    AND A.Matricula = C.Matricula AND A.Ciclo = C.Ciclo 
                    WHERE (A.Ciclo = '${req.body.Ciclo}') AND (A.Id_Nivel = '${req.body.Id_Nivel}') AND (A.Id_Grado = '${req.body.Id_Grado}') 
                    AND (A.Grupo = '${req.body.Grupo}') and (A.Id_Status=1) ${condicionMateria} 
                    ORDER BY A.Numero_Lista`,
                    { type: Sequelize.QueryTypes.SELECT }
                );
            }

            res.json ({ success: true , message: 'getCaptura', data: {meses, alumnos} });
        } catch(error){
          console.log(error);
          res.json ({ success: false , message: 'getCaptura', error });
        }
    }


    static async postCalificaciones (req, res, next) {
        if(!req.body) {
            res.json ({ success: false , message: 'error data' });
            return;
        }

        try {
            const data= req.body;
            const config=  await sequelize.getInstanceMssql().query(
                'SELECT semestre_actual FROM MAE_CONFIGURACION', 
                { type: Sequelize.QueryTypes.SELECT });
            const semester= config[0].semestre_actual;
            
            data.forEach(row => {
                dataForEach(row);
                async function dataForEach (row) {
                    try {
                        // OBTENER CAMPO CALIFICACION
                        let campoCalificacion= null;
                        if (row.Id_Mes_Captura < 10){
                            campoCalificacion= "M0" + row.Id_Mes_Captura;
                        } else { 
                            campoCalificacion= "M" + row.Id_Mes_Captura;
                        }

                        let calificaion= row.Calificacion;
                        let nuevaCalificacion= null;
                        let confPeriodo= null;

                        if (calificaion > 0) {
                            nuevaCalificacion= calificaion;
                        } else {
                            nuevaCalificacion= 0;
                        }

                        if (row.Id_Nivel === 4) {
                            confPeriodo = semester;
                        } else {
                            confPeriodo= 0;
                        }

                        // checa si ya esta registrado el alumno en el mae_calificaciones
                        const dataBusca= await sequelize.getInstanceMssql().query(
                            `Select * from Mae_Calificaciones Where Ciclo= ${row.Ciclo} and Matricula= ${row.Matricula}
                            And Id_Materia= ${row.Id_Materia} and Id_Status=1`, 
                            { type: Sequelize.QueryTypes.SELECT });

                        let regFind= dataBusca.length;
                        let pQuery= null;
                        //si no esta inserta un registro
                        if (regFind === 0) {
                            pQuery= await sequelize.getInstanceMssql().query(
                                `Insert into mae_calificaciones 
                                (Ciclo, Periodo, Matricula, Id_Nivel, Id_Grado, Grupo, 
                                Id_Materia, ${campoCalificacion}, Promedio_Mensual, Id_Status) 
                                Values (${row.Ciclo}, ${confPeriodo}, ${row.Matricula}, ${row.Id_Nivel}, ${row.Id_Grado}, '${row.Grupo}', 
                                ${row.Id_Materia}, ${nuevaCalificacion}, 0, 1)`,
                                { type: Sequelize.QueryTypes.INSERT });
                        } else {
                            // compara calificacion anterior con la actual para meterlo en bitacora
                            pQuery= await sequelize.getInstanceMssql().query(
                                `SELECT ${campoCalificacion} AS CalActual FROM MAE_CALIFICACIONES 
                                WHERE Ciclo= ${row.Ciclo} AND Matricula= ${row.Matricula} and Id_Materia= ${row.Id_Materia}`,
                                { type: Sequelize.QueryTypes.SELECT });

                            const regBitacora= pQuery[0].CalActual;
                            console.log("registro bitacora", regBitacora);
                            if (regBitacora !== nuevaCalificacion) {
                                pQuery= await sequelize.getInstanceMssql().query(
                                    `INSERT INTO bitacora_calificaciones (Ciclo, Periodo, Matricula, Id_Nivel,
                                    Id_Grado, Id_Materia, Campo, Cal_Anterior, Cal_Nueva)
                                    VALUES (${row.Ciclo}, ${confPeriodo}, ${row.Matricula}, ${row.Id_Nivel}, ${row.Id_Grado}, 
                                    ${row.Id_Materia}, '${campoCalificacion}', ${regBitacora}, ${nuevaCalificacion})`,
                                    { type: Sequelize.QueryTypes.INSERT }
                                );
                            }
                            // si ya esta, actualiza mae_calificaciones con los post del formulario
                            pQuery= await sequelize.getInstanceMssql().query(
                                `UPDATE MAE_CALIFICACIONES SET ${campoCalificacion} = ${nuevaCalificacion} WHERE Ciclo= ${row.Ciclo}
                                AND Matricula= ${row.Matricula} AND Id_Materia= ${row.Id_Materia}`,
                                { type: Sequelize.QueryTypes.UPDATE }
                            );
                        }
                    } catch(error) {
                        console.log(error);
                        res.json ({ success: false , message: 'postCalificaciones FOR EACH', error });
                    }
                }
            });
            
            res.json ({ success: true , message: 'postCalificaciones', data: data });
        }catch(error){
            console.log(error);
            res.json ({ success: false , message: 'postCalificaciones', error });
        }
    }

}

export default GradesController;