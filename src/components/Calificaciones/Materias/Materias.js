import React, {useState, useEffect} from 'react';
import './Materias.css';
import api from '../../../services/api';
import swal from 'sweetalert';
import { Route } from 'react-router-dom';

const Materias = () => {
    const [materias, setMaterias] = useState(false);
    const [alumnos, setAlumnos] = useState(false);
    const [registros, setRegistros] = useState(0);
    const [meses, setMeses] = useState(false);
    const [alumnosCiclo, setAlumnosCiclo] = useState(false);
    const [visible, setVisible] = useState(false);
    const [contador, setContador] = useState(0);
    const [informacion, setInformacion] = useState({
        Grado: null,
        Grupo: null,
        Id_Nivel_Ingles: null,
        Materia: null,
        Nivel: null
    });
    const [asignarTodos, setAsignarTodos] = useState(0);
    // const [pass, setPass] = useState(true);
    const [infoT, setInfoT] = useState(false);
    const [teacher, setTeacher] = useState('');
    const [title, setTitle] = useState('');
    const [listaAsistencia, setListaAsistencia] = useState(false);
    const [calificacionesCiclo, setCalificacionesCiclo] = useState(false);

    useEffect( () => {
        const initialize = async() => {
            try {
                // MATERIAS INFO
                let response = await api.getGrades();
                const data = response.data.data;
                setMaterias(data);

                // DONCENTE INFO
                response = await api.getUserInfo();
                let info = response.data;
                setInfoT(info);
            }catch (e){
                if(!e.response && !e.response.data) {
                    swal("Error", "Intente de nuevo más tarde.", "error");
                    return;
                }
            }
        }

        initialize();

    }, []);

    const handleCerrar = (e) => {
        if (visible === true && contador === 1) {
            setVisible(false);
            setContador(0);
            setAlumnos(false);
            setListaAsistencia(false);
            setCalificacionesCiclo(false);
            setAsignarTodos('');
        }
    }

    const calificar = (e) => {
        e.preventDefault();
        const target = e.target.value;
        if (visible === true || contador === 0) {
            setVisible(true);
            setContador(1);
            const dataRow = materias[target];
            setInformacion({
                Grado: dataRow.Grado,
                Grupo: dataRow.Grupo,
                Id_Nivel_Ingles: dataRow.Id_Nivel_Ingles,
                Materia: dataRow.Materia,
                Nivel: dataRow.Nivel
            });
            funcionAlumnos(dataRow);
            funcionCiclo(dataRow);
        }
    }

    async function funcionAlumnos (dataRow) {
        try {
            const responseMateria = await api.getCaptura(dataRow);
            const dataAlumnos = responseMateria.data.data.alumnos;
            const dataMeses = responseMateria.data.data.meses;
            setAlumnos(dataAlumnos);
            setMeses(dataMeses);
            setRegistros(responseMateria.data.data.alumnos.length);
        } catch (e){
            if(!e.response && !e.response.data) {
                swal("Error", "Intente de nuevo más tarde.", "error");
                return;
            }
        }
    }

    const handleInputData = (e) => {
        e.preventDefault();
        const re = /^\d{1,}(\.\d{0,4})?$/;
        if (e.target.value === '' || re.test(e.target.value) && (e.target.value >= 0 && e.target.value < 11)) {
            let target= e.target.name;
            let value= e.target.value;
            let students = [...alumnos];
            let student = {
                ...students[target],
                Calificacion: value
            };
            students[target]= student;
            setAlumnos(students);
        }
        
    }

    const handleGuardar = (e) => {
        e.preventDefault();
        guardar(alumnos);
    }

    const handleAsignar = (e) => {
        e.preventDefault();
        alumnos.forEach(row => {
            row.Calificacion= asignarTodos;
        });
        guardar(alumnos);

    }

    const handleInputAsignar = (e) => {
        const re = /^\d{1,}(\.\d{0,4})?$/;
        if (e.target.value === '' || re.test(e.target.value) && (e.target.value >= 0 && e.target.value < 11)) {
            setAsignarTodos(e.target.value);
        }
    }

    async function guardar (dataAlumnos) {
        let pass = 0;
        try {
            for (let row of dataAlumnos) {
                console.log(row.Calificacion);
                if (row.Calificacion <=4 && row.Calificacion >= 0) {
                    pass = 1;
                    break;
                }
            }
            switch (pass) {
                case 0:
                    const responseGuardar = await api.postCalificaciones(dataAlumnos);
                    if (responseGuardar) {
                        swal("Completado", "Se guardó la informacion con exito.", "success");
                        const dataAlumnos = responseGuardar.data.data;
                        setAlumnos(dataAlumnos);
                        setAsignarTodos('');
                        return;
                    } 
                    break;
                case 1:
                    swal("Intentelo de nuevo", "La calificación no puede ser menor a 5.", "error");
                    break;
            }
        } catch (e) {
            if(!e.response && !e.response.data) {
                swal("Error", "Intente de nuevo más tarde.", "error");
                return;
            }
        }
    }

    const [imprimir, setImprimir] = useState(3);

    const handleSeleccionar = (e) => {
        e.preventDefault();
        let valor = e.target.value;
        setImprimir(valor);
        // let today= new Date();
        // let date=today.getDate() + "-"+ parseInt(today.getMonth()+1) +"-"+today.getFullYear();
        if (valor === '1') {
            setCalificacionesCiclo(false);
            setListaAsistencia(true);
        } else if (valor === '2') {
            setListaAsistencia(false);
            setCalificacionesCiclo(true);
        } else if (valor === '3') {
            setListaAsistencia(false);
            setCalificacionesCiclo(false);
        }
        
    }

    const handleImprimir = (e) => {
        e.preventDefault();
        setTitle("Calificaciones del Mes");
        if (imprimir === '1') {
            setTitle("Lista de Asistencia");
        } else if (imprimir === '2') {
            setTitle("Calificaciones del Ciclo");
        } else if (imprimir === '3') {
            setTitle("Calificaciones del Mes");
        }
        setTeacher(infoT.nombre_completo + " (" + infoT.id_personal + ")");
        setTimeout(() => window.print(), 1000)
        setTimeout(() => setTeacher(""), 1000)
        setTimeout(() => setTitle(""), 1000)
    }

    async function funcionCiclo (dataRow) {
        try {
            const responseCiclo = await api.getCalfCiclo(dataRow);
            const alumnosCiclo = responseCiclo.data.data.alumnos;
            setAlumnosCiclo(alumnosCiclo);
        } catch (e){
            if(!e.response && !e.response.data) {
                swal("Error", "Intente de nuevo más tarde.", "error");
                return;
            }
        }
    }

    return (
        <div>
            {
                !visible &&
                <div className= "seccion-materias hover-seccion fade-in">
                    <div className= "seccion-centro">
                        <div className= "seccion-tabla-materias">
                            <div className= "hover-elemento">
                                {/* TABLA */}
                                <div className= "contenedor-tabla-materias">
                                    <table className= "tabla-materias">
                                        <thead>
                                            <tr>
                                                <th style={{textAlign:'center', width:'100px'}}><label>PERSONAL</label></th>
                                                <th style={{textAlign:'center'}}><label>CLAVE</label></th>
                                                <th style={{textAlign:'center'}}><label>MATERIAS IMPARTIDAS</label></th>
                                                <th style={{textAlign:'center'}}><label>NIVEL</label></th>
                                                <th style={{textAlign:'center'}}><label>GRADO</label></th>
                                                <th style={{textAlign:'center'}}><label>GRUPO</label></th>
                                                <th style={{textAlign:'center'}}><label>CALIFICAR</label></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { materias && materias.map( (materia, i) => {
                                                return (
                                                <tr key={i}>
                                                    {/* ID */}
                                                    <td name= "Id_Personal" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Id_Personal || ''}</td>
                                                    {/* CLAVE */}
                                                    <td name= "Id_Materia" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Id_Materia || ''}</td>
                                                    {/* MATERIAS */}
                                                    <td name= "Materia" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Materia || ''}</td>
                                                    {/* NIVEL */}
                                                    <td name= "Id_Nivel" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Nivel || ''}</td>
                                                    {/* GRADO */}
                                                    <td name= "Id_Grado" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Id_Grado || ''}</td>
                                                    {/* GRUPO */}
                                                    <td name= "Grupo" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Grupo || ''}</td>
                                                    {/* CALIFICAR */}
                                                    <td style={{display:'flex', textAlign:'center'}}>
                                                        <button className= "boton-pencil calificar"
                                                        onClick= {calificar}
                                                        value= {i}
                                                        name= "Calificar">
                                                        </button>
                                                    </td>
                                                </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                visible &&
                <div className= "seccion-materias hover-seccion fade-in">
                    <div className= "seccion-cerrar">
                        <button className= "boton-pencil close"
                        onClick= {handleCerrar}
                        name= "cerrar">
                        </button>
                    </div>
                    <form>
                        {/* LISTA DE ASISTENCIA */}
                        {
                            listaAsistencia &&
                            <div className= "seccion-centro">
                                <div className= "seccion-docente-imprimir-titulo">
                                    <h2>{title || ''}</h2>
                                </div>
                                <div className= "seccion-docente-imprimir">
                                    {teacher || ''}
                                </div>
                                {/* TITULOS */}
                                <div className= "subtitulo-materias">
                                    <div className= "contenedor-mitad-materias" >
                                        <h4>
                                            Listado de Alumnos de {informacion.Grado || ''} {informacion.Grupo || ''} de {informacion.Nivel || ''}
                                            <br/>
                                            Materia: {informacion.Materia || ''}
                                        </h4>
                                    </div>
                                    <div className= "contenedor-mitad-materias" >
                                        <div className= "seccion-input">
                                            <h4 style= {{width: 'auto', top: '0px', marginRight: '10px'}}>
                                                Mes:
                                            </h4>
                                            <select className= "input-text-materias" name= "CMBMes">
                                                { meses && meses.map( (mes, i) => {
                                                return (
                                                <option key={mes.Id_Mes}>{mes.Mes}</option>
                                                    );
                                                })}
                                            </select> 
                                        </div>
                                    </div>
                                </div>
                                {/* TABLA */}
                                <div className= "seccion-tabla-materias">
                                    <div className= "hover-elemento">
                                        {/* TABLA */}
                                        <div className= "contenedor-tabla-materias">
                                            <table className= "tabla-materias">
                                                <thead>
                                                    <tr>
                                                        <th style={{textAlign:'center', borderBottom: '1px solid rgb(230, 236, 240)'}}><label></label></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)', width: '350px'}}><label>NOMBRE</label></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)', width: '75px'}}><label>TOTAL</label></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { alumnos && alumnos.map( (alumno, i) => {
                                                        return (
                                                        <tr key={alumno.Matricula}>
                                                            {/* NO. DE LISTA */}
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.Numero_Lista || ''}</td>
                                                            {/* ALUMNO */}
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.Paterno || ''} {alumno.Materno || ''} {alumno.Nombre || ''}</td>
                                                            {/* CALIFICION */}
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}></td>
                                                        </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {/* CILIFICACIONES DEL CICLO */}
                        {
                            calificacionesCiclo &&
                            <div className= "seccion-centro">
                                <div className= "seccion-docente-imprimir-titulo">
                                    <h2>{title || ''}</h2>
                                </div>
                                <div className= "seccion-docente-imprimir">
                                    {teacher || ''}
                                </div>
                                {/* TITULOS */}
                                <div className= "subtitulo-materias">
                                    <div className= "contenedor-mitad-materias" >
                                        <h4>
                                            Listado de Alumnos de {informacion.Grado || ''} {informacion.Grupo || ''} de {informacion.Nivel || ''}
                                            <br/>
                                            Materia: {informacion.Materia || ''}
                                        </h4>
                                    </div>
                                </div>
                                {/* TABLA */}
                                <div className= "seccion-tabla-materias">
                                    <div className= "hover-elemento">
                                        {/* TABLA */}
                                        <div className= "contenedor-tabla-materias">
                                            <table className= "tabla-materias">
                                                <thead>
                                                    <tr>
                                                        <th colspan="13" style={{padding: '0px 5px', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>&nbsp;</th>
                                                        <th align="center" style={{padding: '0px 5px', borderRight: '1px solid rgb(230, 236, 240)'}} title="Promedio Mensual">Prom.</th>
                                                        <th align="center" style={{padding: '0px 5px', borderRight: '1px solid rgb(230, 236, 240)'}} title="Exámen Final">Examen</th>
                                                        <th align="center" style={{padding: '0px 5px'}} title="Promedio Final">Prom.</th>
                                                    </tr>
                                                    <tr>
                                                        <th width="7%" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Matrícula</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Lista</th>
                                                        <th width="30%" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Nombre</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Sep</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Oct</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Nov</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Dic</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Ene</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Feb</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Mar</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Abr</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>May</th>
                                                        <th width="4%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}>Jun</th>
                                                        <th width="6%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}} title="Promedio Mensual">Mens.</th>
                                                        <th width="6%" align="center" style= {{borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}} title="Exámen Final">Final</th>
                                                        <th width="7%" align="center" style= {{borderBottom: '1px solid rgb(230, 236, 240)'}} title="Promedio Final">Final</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { alumnosCiclo && alumnosCiclo.map( (alumno, i) => {
                                                        return (
                                                        <tr key={alumno.Matricula}>
                                                            {/* MATRICULA */}
                                                            <td align="center" style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.Matricula || ''}</td>
                                                            {/* NO. DE LISTA */}
                                                            <td align="center" style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.Numero_Lista || ''}</td>
                                                            {/* ALUMNO */}
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}> {alumno.Paterno || ''} {alumno.Materno || ''} {alumno.Nombre || ''}</td>
                                                            {/* CALIFICACIONES */}
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.M01 || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.M02 || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.M03 || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.M04 || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.M05 || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.M06 || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.M07 || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.M08 || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.M09 || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.M10v}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.Promedio_Mensual || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.Examen_Final || ''}</td>
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)', padding: '8px 0px'}}>{alumno.Promedio_Final || ''}</td>
                                                        </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        {/* CALIFICACIONES DEL MES */}
                        {
                            !listaAsistencia && !calificacionesCiclo &&
                            <div className= "seccion-centro">
                                <div className= "seccion-docente-imprimir-titulo">
                                    <h2>{title}</h2>
                                </div>
                                <div className= "seccion-docente-imprimir">
                                    {teacher}
                                </div>
                                {/* TITULOS */}
                                <div className= "subtitulo-materias">
                                    <div className= "contenedor-mitad-materias" >
                                        <h4>
                                            Listado de Alumnos de {informacion.Grado || ''} {informacion.Grupo || ''} de {informacion.Nivel || ''}
                                            <br/>
                                            Materia: {informacion.Materia || ''}
                                        </h4>
                                    </div>
                                    <div className= "contenedor-mitad-materias" >
                                        <div className= "seccion-input">
                                            <h4 style= {{width: 'auto', top: '0px', marginRight: '10px'}}>
                                                Mes:
                                            </h4>
                                            <select className= "input-text-materias" name= "CMBMes">
                                                { meses && meses.map( (mes, i) => {
                                                return (
                                                <option key={mes.Id_Mes}>{mes.Mes}</option>
                                                    );
                                                })}
                                            </select> 
                                        </div>
                                    </div>
                                </div>
                                {/* TABLA */}
                                <div className= "seccion-tabla-materias">
                                    <div className= "hover-elemento">
                                        {/* TABLA */}
                                        <div className= "contenedor-tabla-materias">
                                            <table className= "tabla-materias">
                                                <thead>
                                                    <tr>
                                                        <th style={{textAlign:'center', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>MATRICULA</label></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderLeft: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>NO. DE LISTA</label></th>
                                                        <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>ALUMNO</label></th>
                                                        <th style={{textAlign:'center', width:'200px', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>CALIFICACIÓN</label></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { alumnos && alumnos.map( (alumno, i) => {
                                                        return (
                                                        <tr key={alumno.Matricula}>
                                                            {/* MATRICULA */}
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{alumno.Matricula || ''}</td>
                                                            {/* NO. DE LISTA */}
                                                        <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{alumno.Numero_Lista || ''}</td>
                                                            {/* ALUMNO */}
                                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{alumno.Paterno || ''} {alumno.Materno || ''} {alumno.Nombre || ''}</td>
                                                            {/* CALIFICION */}
                                                        <td className= "seccion-input-centro">
                                                                <input
                                                                placeholder= "0.00"
                                                                className= "input-text-materias"
                                                                value= {alumno.Calificacion || ''}
                                                                onChange= {handleInputData}
                                                                name={i}>
                                                                </input>
                                                            </td>
                                                        </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                        
                        <div className= "subseccion hover-subseccion">
                            <div>
                                <div className= "subtitulo-materias" style= {{height: '30px'}}>
                                    <h4>
                                        Total de registros: {registros}
                                    </h4>
                                </div>
                                <div className= "subtitulo-materias imprimir" style= {{padding: '0px', height: '80px'}}>
                                    {
                                        !listaAsistencia && !calificacionesCiclo &&
                                        <div className= "contenedor-mitad-materias fade-in">
                                            <div className= "seccion-input" style= {{height: '50px'}}>
                                                <input className= "input-text-materias"
                                                style= {{width:'50px', marginRight: '10px'}}
                                                placeholder= "0.00"
                                                name= "asignarTodos"
                                                onChange= {handleInputAsignar}
                                                value= {asignarTodos || ''}>
                                                </input>
                                                <button className= {!asignarTodos ? "boton-asignar disabled" : "boton-asignar"}
                                                disabled= {!asignarTodos}
                                                type= "submit"
                                                onClick= {handleAsignar}>
                                                    ASIGNAR A TODOS
                                                </button>
                                            </div>
                                        </div>
                                    }                                    
                                    <div className= "contenedor-mitad-materias imprimir" >
                                        <div className= "seccion-input" style= {{height: '50px'}}>
                                            <label style= {{width: 'auto', top: '0px', marginRight: '10px'}}>
                                                IMPRIMIR:
                                            </label>
                                            <select className= "input-text-materias" 
                                            onChange= {handleSeleccionar}>
                                                <option value= {3}>
                                                    Calificaciones de mes
                                                </option>
                                                <option value= {2}>
                                                    Calificaciones del ciclo
                                                </option>
                                                <option value= {1}>
                                                    Lista de asistencia
                                                </option>
                                            </select>
                                            <div className= "seccion-input" style= {{height: '50px', marginLeft: '10px'}}>
                                                <button className= "boton-pencil impresora"
                                                name= "impresora"
                                                onClick= {handleImprimir}>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                { 
                                    !listaAsistencia && !calificacionesCiclo &&
                                    <div className= "imprimir fade-in">
                                        <button className= "boton-guardar"
                                        type= "submit"
                                        onClick={handleGuardar}>
                                            Guardar calificaciones
                                        </button>
                                    </div>
                                }
                            </div>
                        </div>
                    </form>
                </div>
            }

        </div>
    );
};

export default Materias;