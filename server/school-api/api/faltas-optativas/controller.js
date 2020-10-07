import Sequelize from 'sequelize';
import sequelize from '../../../config/sequelize';
import { Student } from '../user/index';

class FaltasOptativasController {

    static async getCapturaFaltasOptional (req, res, next) {
        if(!req.body) {
            res.json ({ success: false , message: 'error data' });
            return;
        }
        console.log(req.body);

        try {
            let config = await sequelize.getInstanceMssql().query(
                `Select Top 1 ID_MES_CAPTURA From Mae_Personal_Materias 
                Where Id_Personal = ${req.body.Id_Personal}`,
                { type: Sequelize.QueryTypes.SELECT }
            );
            const mesCaptura= config[0].ID_MES_CAPTURA;

            config =  await sequelize.getInstanceMssql().query(
                'SELECT ciclo FROM MAE_CONFIGURACION', 
                { type: Sequelize.QueryTypes.SELECT }
            );
            const ciclo= config[0].ciclo;
            let meses= null;
            let alumnos= null;

            if (req.body.Id_Materia > 0 && mesCaptura < 11) {
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
                let campoFaltas= null;

                if (mesCaptura < 10){
                    campoFaltas= "M0" + mesCaptura;
                } else { 
                    campoFaltas= "M" + mesCaptura;
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
                    C.${campoFaltas} as Faltas, ${req.body.Id_Materia} AS Id_Materia, ${req.body.Id_Personal} AS Id_Personal, 
                    ${mesCaptura} AS Id_Mes_Captura, '${req.body.Materia}' AS Materia, '${clave}' AS Clave
                    FROM MAE_ALUMNOS A LEFT OUTER JOIN 
                    (Select * From MAE_ASISTENCIAS Where Id_Materia = ${req.body.Id_Materia}) 
                    C ON A.Id_Grado = C.Id_Grado AND A.Id_Nivel = C.Id_Nivel AND A.Matricula = C.Matricula AND A.Ciclo = C.Ciclo 
                    WHERE (A.Ciclo = ${ciclo}) AND (A.Id_Nivel = ${req.body.Id_Nivel}) AND 
                    (A.Id_Grado = ${req.body.Id_Grado}) and (A.Id_Status=1) ${vlCampoOptativa} 
                    ORDER BY A.Paterno, A.Materno, A.Nombre`,
                    { type: Sequelize.QueryTypes.SELECT }
                );
            }
            res.json ({ success: true , message: 'getCapturaFaltasOptional', data: {meses, alumnos} });
        } catch(error) {
            console.log(error);
            res.json ({ success: false , message: 'getCapturaFaltasOptional', error });
        }
    }

    static async postFaltasOptativas (req, res, next) {
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
                        let campoFaltas= null;
                        if (row.Id_Mes_Captura < 10){
                            campoFaltas= "M0" + row.Id_Mes_Captura;
                        } else { 
                            campoFaltas= "M" + row.Id_Mes_Captura;
                        }

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
                        let falta= row.Faltas;
                        let nuevaFalta= null;
                        if (falta > 0) {
                            nuevaFalta= falta;
                        } else {
                            nuevaFalta= 0;
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
                            `Select * from Mae_Asistencias Where Ciclo= ${row.Ciclo} and Matricula= ${row.Matricula}
                            And Id_Materia= ${row.Id_Materia} and Id_Status=1`, 
                            { type: Sequelize.QueryTypes.SELECT });

                        let regFind= dataBusca.length;
                        let pQuery= null;
                        //si no esta inserta un registro
                        if (regFind === 0) {
                            pQuery= await sequelize.getInstanceMssql().query(
                                `Insert into Mae_Asistencias 
                                (Ciclo, Semestre, Matricula, Id_Nivel, Id_Grado, Grupo, 
                                Id_Materia, ${campoFaltas}, Id_Status) 
                                Values (${row.Ciclo}, ${confPeriodo}, ${row.Matricula}, ${row.Id_Nivel}, ${row.Id_Grado}, '${row.Grupo}', 
                                ${row.Id_Materia}, ${nuevaFalta}, 1)`,
                                { type: Sequelize.QueryTypes.INSERT });
                        } else {
                            // si ya esta, actualiza Mae_Asistencias con los post del formulario
                            pQuery= await sequelize.getInstanceMssql().query(
                                `UPDATE Mae_Asistencias SET ${campoFaltas} = ${nuevaFalta} WHERE Ciclo= ${row.Ciclo}
                                AND Matricula= ${row.Matricula} AND Id_Materia= ${row.Id_Materia}`,
                                { type: Sequelize.QueryTypes.UPDATE }
                            );
                        }

                    } catch(error) {
                        console.log(error);
                        res.json ({ success: false , message: 'postFaltasOptativas FOR EACH', error });
                    }
                }
            });
            
            res.json ({ success: true , message: 'postFaltasOptativas', data: data });

        } catch(error) {
            console.log(error);
            res.json ({ success: false , message: 'postFaltasOptativas', error });
        }
    }

}

export default FaltasOptativasController;