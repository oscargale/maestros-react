import Sequelize from 'sequelize';
import sequelize from '../../../config/sequelize';
import { Student } from '../user/index';

class OptionalGradesController {
 
    static async getOptionalGrades (req, res, next) {

        try {
            const teacher = await Student.findByPk(req.user.id_usuario);
    
            if(!teacher.id_personal) {
                res.json ({ success: false , message: 'getOptionalGrades' });
                return;
            }
    
            await sequelize.getInstanceMssql().query(
                `Delete From Tem_Personal_Materias_Optativas Where Id_Personal= '${teacher.id_personal}'`,
                { type: Sequelize.QueryTypes.DELETE }
            );
    
            const pQuery1 = await sequelize.getInstanceMssql().query(
                `Insert Into Tem_Personal_Materias_Optativas Select O.Id_Materia, A.Id_Deporte, A.Clave_Deporte,
                O.Materia_Optativa, M.Materia, N.Nivel, A.Id_Profesor_Deporte, A.Id_Nivel, A.Id_Grado, 
                '${teacher.id_personal}', 3
                From Mae_Alumnos A INNER JOIN Mae_Materias_Optativas O ON A.Id_Deporte = O.Id_Optativa INNER JOIN
                Mae_Materias M ON O.Id_Materia = M.Id_Materia INNER JOIN Mae_Niveles N ON O.Id_Nivel = N.Id_Nivel 
                Where A.Id_Status =1 and A.Id_Profesor_Deporte = ${teacher.id_personal} GROUP BY A.Clave_Deporte, A.Id_Profesor_Deporte,
                O.Materia_Optativa, O.Id_Materia, A.Id_Nivel, M.Materia, N.Nivel, A.Id_Grado, A.Id_Deporte`,
                { type: Sequelize.QueryTypes.INSERT }
            );
    
            const pQuery2 = await sequelize.getInstanceMssql().query(
                `Insert Into Tem_Personal_Materias_Optativas Select O.Id_Materia, A.Id_Tecnologica,  A.Clave_Tecnologica,
                O.Materia_Optativa, M.Materia, N.Nivel, A.Id_Profesor_Tecnologica, A.Id_Nivel,A.Id_Grado, 
                '${teacher.id_personal}', 3
                From Mae_Alumnos A INNER JOIN Mae_Materias_Optativas O ON 
                A.Id_Tecnologica = O.Id_Optativa INNER JOIN Mae_Materias M ON O.Id_Materia = M.Id_Materia INNER JOIN
                Mae_Niveles N ON O.Id_Nivel = N.Id_Nivel Where A.Id_Status = 1 and A.Id_Profesor_Tecnologica = ${teacher.id_personal}
                GROUP BY A.Clave_Tecnologica, A.Id_Profesor_Tecnologica, O.Materia_Optativa, O.Id_Materia, A.Id_Nivel,
                M.Materia, N.Nivel, A.Id_Grado, A.Id_Tecnologica`,
                { type: Sequelize.QueryTypes.INSERT }
            );
    
            const pQuery3 = await sequelize.getInstanceMssql().query(
                `Insert Into Tem_Personal_Materias_Optativas Select O.Id_Materia, A.Id_Artistica, A.Clave_Artistica,
                O.Materia_Optativa, M.Materia, N.Nivel, A.Id_Profesor_Artistica, A.Id_Nivel, A.Id_Grado, 
                '${teacher.id_personal}', 3
                From Mae_Alumnos A INNER JOIN Mae_Materias_Optativas O ON A.Id_Artistica = O.Id_Optativa INNER JOIN
                Mae_Materias M ON O.Id_Materia = M.Id_Materia INNER JOIN Mae_Niveles N ON O.Id_Nivel = N.Id_Nivel 
                Where A.Id_Status = 1 and A.Id_Profesor_Artistica = ${teacher.id_personal}
                GROUP BY A.Clave_Artistica, A.Id_Profesor_Artistica, O.Materia_Optativa, O.Id_Materia, A.Id_Nivel,
                M.Materia, N.Nivel, A.Id_Grado, A.Id_Artistica`,
                { type: Sequelize.QueryTypes.INSERT }
            );
            
            // Usamos la tem_personal_materias_optativas ya actualizada para mostrar las materias del maestro
            const pQuery4 = await sequelize.getInstanceMssql().query(
                `Select Id_Materia, Id_Optativa, Clave, Materia_Optativa, Materia, Nivel, Id_Personal, Id_Nivel, Id_Grado
                From tem_personal_materias_optativas where IP='${teacher.id_personal}'`,
                { type: Sequelize.QueryTypes.SELECT }
            );
    
            const data= pQuery4;
    
            res.json ({ success: true , message: 'getOptionalGrades', data: data });
        } catch(error){
            console.log(error);
            res.json ({ success: false , message: 'getOptionalGrades', error });
        }
    }

    static async getCapturaOptional (req, res, next) {
        if(!req.body) {
            res.json ({ success: false , message: 'error data' });
            return;
        }
        console.log(req.body);

        try {
            let config = await sequelize.getInstanceMssql().query(
                `Select Top 1 ID_MES_CAPTURA From Mae_Personal_Materias 
                Where Id_Personal = ${req.body.Id_Personal} AND Id_Nivel = ${req.body.Id_Nivel}`,
                { type: Sequelize.QueryTypes.SELECT }
            );
            const mesCaptura= config[0].ID_MES_CAPTURA;
            console.log("mes captura: ", mesCaptura);

            config =  await sequelize.getInstanceMssql().query(
                'SELECT ciclo FROM MAE_CONFIGURACION', 
                { type: Sequelize.QueryTypes.SELECT }
            );
            const ciclo= config[0].ciclo;
            console.log("ciclo: ", ciclo);
            let meses= null;
            let alumnos= null;

            // MES
            if (mesCaptura > 0) {
                if (req.body.Id_Nivel === 4) {
                    const config = await sequelize.getInstanceMssql().query(
                        `Select SEMESTRE_ACTUAL From Mae_Configuracion`,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                    const semestre= config[0].SEMESTRE_ACTUAL;

                    meses = await sequelize.getInstanceMssql().query(
                        `Select Id_Mes, Mes from Mae_Mes_Captura 
                        Where Id_Status=1 and Id_Nivel = ${req.body.Id_Nivel} and Id_Mes= ${mesCaptura} 
                        and Periodo = ${semestre} Order by Id_Mes`,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                } else {
                    meses = await sequelize.getInstanceMssql().query(
                        `Select Id_Mes, Mes from Mae_Mes_Captura 
                        Where Id_Status=1 and Id_Nivel = ${req.body.Id_Nivel} and Id_Mes= ${mesCaptura} 
                        Order by Id_Mes`,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                }
            } else {
                meses = await sequelize.getInstanceMssql().query(
                    `Select Id_Mes, Mes from Mae_Mes_Captura 
                    Where Id_Status=1 and Id_Nivel = ${req.body.Id_Nivel} 
                    Order by Id_Mes`,
                    { type: Sequelize.QueryTypes.SELECT }
                );
            }

            // ALUMNOS

            // CAMPO CALIFICACIONES
            let campoCalificacion= null;

            if (mesCaptura < 10){
                campoCalificacion= "M0" + mesCaptura;
            } else { 
                campoCalificacion= "M" + mesCaptura;
            }

            let clave= req.body.Clave;
            let vlCampoOptativa= '';
            if (req.body.Id_Nivel === 4) { // PREPARATORIA
                if (clave.substr(1,2) === "DE") { // 'EDUCACION FISICA
                    vlCampoOptativa= " AND A.Id_Deporte = " + req.body.Id_Optativa + " and A.Id_Profesor_Deporte = " + req.body.Id_Personal;
                } else {
                    if (clave.substr(1,2) === "ET") { //'EDUCACION TECNICA
                        vlCampoOptativa= " AND A.Id_Tecnologica = " + req.body.Id_Optativa + " and A.Id_Profesor_Tecnologica = " + req.body.Id_Personal;
                    } else {
                        if (clave.substr(1,2) === "OP") { //'EDUCACION ARTISTICA
                            vlCampoOptativa= " AND A.Id_Artistica = " + req.body.Id_Optativa + " and A.Id_Profesor_Artistica = " + req.body.Id_Personal;
                        } 
                    }
                }
            } else { // SECUNDARIA
                if (clave.substr(1,2) === "EF") { // 'EDUCACION FISICA
                vlCampoOptativa= " AND A.Id_Deporte = " + req.body.Id_Optativa + " and A.Id_Profesor_Deporte = " + req.body.Id_Personal;
                } else {
                    if (clave.substr(1,2) === "ET") { //'EDUCACION TECNICA
                        vlCampoOptativa= " AND A.Id_Tecnologica = " + req.body.Id_Optativa + " and A.Id_Profesor_Tecnologica = " + req.body.Id_Personal;
                    } else {
                        if (clave.substr(1,2) === "EA") { //'EDUCACION ARTISTICA
                            vlCampoOptativa= " AND A.Id_Artistica = " + req.body.Id_Optativa + " and A.Id_Profesor_Artistica = " + req.body.Id_Personal;
                        } 
                    }
                }
            }

            alumnos = await sequelize.getInstanceMssql().query(
                `SELECT A.Ciclo, A.Matricula, A.Numero_Lista , A.Paterno, A.Materno, A.Nombre, A.Id_Nivel, A.Id_Grado, A.Grupo,
                C.${campoCalificacion} as Calificacion, ${req.body.Id_Materia} AS Id_Materia, ${req.body.Id_Personal} AS Id_Personal, 
                ${mesCaptura} AS Id_Mes_Captura, '${req.body.Materia}' AS Materia, '${clave}' AS Clave
                FROM MAE_ALUMNOS A LEFT OUTER JOIN 
                (Select * From MAE_CALIFICACIONES Where Id_Materia = ${req.body.Id_Materia}) 
                C ON A.Id_Grado = C.Id_Grado AND A.Id_Nivel = C.Id_Nivel AND A.Matricula = C.Matricula AND A.Ciclo = C.Ciclo 
                WHERE (A.Ciclo = ${ciclo}) AND (A.Id_Nivel = ${req.body.Id_Nivel}) AND 
                (A.Id_Grado = ${req.body.Id_Grado}) and (A.Id_Status=1) ${vlCampoOptativa} 
                ORDER BY A.Paterno, A.Materno, A.Nombre`,
                { type: Sequelize.QueryTypes.SELECT }
            );
            
            res.json ({ success: true , message: 'getCapturaOptional', data: {meses, alumnos} });
        } catch(error) {
            console.log(error);
            res.json ({ success: false , message: 'getCapturaOptional', error });
        }
    }

    static async postCalificacionesOptativas (req, res, next) {
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
                        console.log("campo calificaciones", campoCalificacion);

                        let clave= row.Clave;
                        let vlCampoOptativa= '';
                        if (req.body.Id_Nivel === 4) { // PREPARATORIA
                            if (clave.substr(1,2) === "DE") { // 'EDUCACION FISICA
                                vlCampoOptativa= " AND A.Id_Deporte = " + req.body.Id_Optativa + " and A.Id_Profesor_Deporte = " + req.body.Id_Personal;
                            } else {
                                if (clave.substr(1,2) === "ET") { //'EDUCACION TECNICA
                                    vlCampoOptativa= " AND A.Id_Tecnologica = " + req.body.Id_Optativa + " and A.Id_Profesor_Tecnologica = " + req.body.Id_Personal;
                                } else {
                                    if (clave.substr(1,2) === "OP") { //'EDUCACION ARTISTICA
                                        vlCampoOptativa= " AND A.Id_Artistica = " + req.body.Id_Optativa + " and A.Id_Profesor_Artistica = " + req.body.Id_Personal;
                                    } 
                                }
                            }
                        } else { // SECUNDARIA
                            if (clave.substr(1,2) === "EF") { // 'EDUCACION FISICA
                            vlCampoOptativa= " AND A.Id_Deporte = " + req.body.Id_Optativa + " and A.Id_Profesor_Deporte = " + req.body.Id_Personal;
                            } else {
                                if (clave.substr(1,2) === "ET") { //'EDUCACION TECNICA
                                    vlCampoOptativa= " AND A.Id_Tecnologica = " + req.body.Id_Optativa + " and A.Id_Profesor_Tecnologica = " + req.body.Id_Personal;
                                } else {
                                    if (clave.substr(1,2) === "EA") { //'EDUCACION ARTISTICA
                                        vlCampoOptativa= " AND A.Id_Artistica = " + req.body.Id_Optativa + " and A.Id_Profesor_Artistica = " + req.body.Id_Personal;
                                    } 
                                }
                            }
                        }

                        // NUEVA CALIFICACION
                        let calificaion= row.Calificacion;
                        let nuevaCalificacion= null;
                        if (calificaion > 0) {
                            nuevaCalificacion= calificaion;
                        } else {
                            nuevaCalificacion= 0;
                        }

                        // PERIODO
                        let confPeriodo= null;
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
                            // si ya esta, actualiza mae_calificaciones con los post del formulario
                            pQuery= await sequelize.getInstanceMssql().query(
                                `UPDATE MAE_CALIFICACIONES SET ${campoCalificacion} = ${nuevaCalificacion} WHERE Ciclo= ${row.Ciclo}
                                AND Matricula= ${row.Matricula} AND Id_Materia= ${row.Id_Materia}`,
                                { type: Sequelize.QueryTypes.UPDATE }
                            );
                        }

                    } catch(error) {
                        console.log(error);
                        res.json ({ success: false , message: 'postCalificacionesOptativas FOR EACH', error });
                    }
                }
            });
            
            res.json ({ success: true , message: 'postCalificacionesOptativas', data: data });

        } catch(error) {
            console.log(error);
            res.json ({ success: false , message: 'postCalificacionesOptativas', error });
        }
    }

    static async getCapturaOptionalCiclo (req, res, next) {
        if(!req.body) {
            res.json ({ success: false , message: 'error data' });
            return;
        }
        console.log(req.body);

        try {
            let config = await sequelize.getInstanceMssql().query(
                `Select Top 1 ID_MES_CAPTURA From Mae_Personal_Materias 
                Where Id_Personal = ${req.body.Id_Personal} AND Id_Nivel = ${req.body.Id_Nivel}`,
                { type: Sequelize.QueryTypes.SELECT }
            );
            const mesCaptura= config[0].ID_MES_CAPTURA;
            console.log("mes captura: ", mesCaptura);

            config =  await sequelize.getInstanceMssql().query(
                'SELECT ciclo FROM MAE_CONFIGURACION', 
                { type: Sequelize.QueryTypes.SELECT }
            );
            const ciclo= config[0].ciclo;
            console.log("ciclo: ", ciclo);
            let meses= null;
            let alumnos= null;

            // MES
            if (mesCaptura > 0) {
                if (req.body.Id_Nivel === 4) {
                    const config = await sequelize.getInstanceMssql().query(
                        `Select SEMESTRE_ACTUAL From Mae_Configuracion`,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                    const semestre= config[0].SEMESTRE_ACTUAL;

                    meses = await sequelize.getInstanceMssql().query(
                        `Select Id_Mes, Mes from Mae_Mes_Captura 
                        Where Id_Status=1 and Id_Nivel = ${req.body.Id_Nivel} and Id_Mes= ${mesCaptura} 
                        and Periodo = ${semestre} Order by Id_Mes`,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                } else {
                    meses = await sequelize.getInstanceMssql().query(
                        `Select Id_Mes, Mes from Mae_Mes_Captura 
                        Where Id_Status=1 and Id_Nivel = ${req.body.Id_Nivel} and Id_Mes= ${mesCaptura} 
                        Order by Id_Mes`,
                        { type: Sequelize.QueryTypes.SELECT }
                    );
                }
            } else {
                meses = await sequelize.getInstanceMssql().query(
                    `Select Id_Mes, Mes from Mae_Mes_Captura 
                    Where Id_Status=1 and Id_Nivel = ${req.body.Id_Nivel} 
                    Order by Id_Mes`,
                    { type: Sequelize.QueryTypes.SELECT }
                );
            }

            // ALUMNOS

            // CAMPO CALIFICACIONES
            let campoCalificacion= null;

            if (mesCaptura < 10){
                campoCalificacion= "M0" + mesCaptura;
            } else { 
                campoCalificacion= "M" + mesCaptura;
            }

            let clave= req.body.Clave;
            let vlCampoOptativa= '';
            if (req.body.Id_Nivel === 4) { // PREPARATORIA
                if (clave.substr(1,2) === "DE") { // 'EDUCACION FISICA
                    vlCampoOptativa= " AND A.Id_Deporte = " + req.body.Id_Optativa + " and A.Id_Profesor_Deporte = " + req.body.Id_Personal;
                } else {
                    if (clave.substr(1,2) === "ET") { //'EDUCACION TECNICA
                        vlCampoOptativa= " AND A.Id_Tecnologica = " + req.body.Id_Optativa + " and A.Id_Profesor_Tecnologica = " + req.body.Id_Personal;
                    } else {
                        if (clave.substr(1,2) === "OP") { //'EDUCACION ARTISTICA
                            vlCampoOptativa= " AND A.Id_Artistica = " + req.body.Id_Optativa + " and A.Id_Profesor_Artistica = " + req.body.Id_Personal;
                        } 
                    }
                }
            } else { // SECUNDARIA
                if (clave.substr(1,2) === "EF") { // 'EDUCACION FISICA
                vlCampoOptativa= " AND A.Id_Deporte = " + req.body.Id_Optativa + " and A.Id_Profesor_Deporte = " + req.body.Id_Personal;
                } else {
                    if (clave.substr(1,2) === "ET") { //'EDUCACION TECNICA
                        vlCampoOptativa= " AND A.Id_Tecnologica = " + req.body.Id_Optativa + " and A.Id_Profesor_Tecnologica = " + req.body.Id_Personal;
                    } else {
                        if (clave.substr(1,2) === "EA") { //'EDUCACION ARTISTICA
                            vlCampoOptativa= " AND A.Id_Artistica = " + req.body.Id_Optativa + " and A.Id_Profesor_Artistica = " + req.body.Id_Personal;
                        } 
                    }
                }
            }

            alumnos = await sequelize.getInstanceMssql().query(
                `SELECT A.Ciclo, A.Matricula, A.Numero_Lista , A.Paterno, A.Materno, A.Nombre, A.Id_Nivel, A.Id_Grado, A.Grupo,
                C.M01, C.M02, C.M03, C.M04, C.M05, C.M06, C.M07, C.M08, C.M09, C.M10, C.Promedio_Mensual, C.Examen_Final, C.Promedio_Final,
                ${req.body.Id_Materia} AS Id_Materia, ${req.body.Id_Personal} AS Id_Personal, 
                ${mesCaptura} AS Id_Mes_Captura, '${req.body.Materia}' AS Materia, '${clave}' AS Clave
                FROM MAE_ALUMNOS A LEFT OUTER JOIN 
                (Select * From MAE_CALIFICACIONES Where Id_Materia = ${req.body.Id_Materia}) 
                C ON A.Id_Grado = C.Id_Grado AND A.Id_Nivel = C.Id_Nivel AND A.Matricula = C.Matricula AND A.Ciclo = C.Ciclo 
                WHERE (A.Ciclo = ${ciclo}) AND (A.Id_Nivel = ${req.body.Id_Nivel}) AND 
                (A.Id_Grado = ${req.body.Id_Grado}) and (A.Id_Status=1) ${vlCampoOptativa} 
                ORDER BY A.Paterno, A.Materno, A.Nombre`,
                { type: Sequelize.QueryTypes.SELECT }
            );
            
            res.json ({ success: true , message: 'getCapturaOptionalCiclo', data: {meses, alumnos} });
        } catch(error) {
            console.log(error);
            res.json ({ success: false , message: 'getCapturaOptionalCiclo', error });
        }
    }

}

export default OptionalGradesController;