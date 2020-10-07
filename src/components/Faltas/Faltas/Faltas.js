import React, {useState, useEffect} from 'react';
import './Faltas.css';
import api from '../../../services/api';
import swal from 'sweetalert';

const Faltas = () => {    
    const [materiasFaltas, setMateriasFaltas] = useState(false);
    const [alumnosFaltas, setAlumnosFaltas] = useState(false);
    const [registros, setRegistros] = useState(0);
    const [meses, setMeses] = useState(false);
    const [visibleFaltas, setVisibleFaltas] = useState(false);
    const [contador, setContador] = useState(0);
    const [informacion, setInformacion] = useState({
        Grado: null,
        Grupo: null,
        Id_Nivel_Ingles: null,
        Materia: null,
        Nivel: null
    });
    const [asignarTodos, setAsignarTodos] = useState(0);
    const [infoT, setInfoT] = useState(false);
    const [teacher, setTeacher] = useState('');

    useEffect( () => {
        const initialize = async() => {
            try { 
                let response = await api.getFaltas();
                let data = response.data.data;
                setMateriasFaltas(data);

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

    const handleCerrar = () => {
        if (visibleFaltas === true && contador === 1) {
            setVisibleFaltas(false);
            setContador(0);
            setAlumnosFaltas(false);
        }
    }

    const calificar = (e) => {
        e.preventDefault();
        const target = e.target.value;
        if (visibleFaltas === true || contador === 0) {
            setVisibleFaltas(true);
            setContador(1);
            const dataRow = materiasFaltas[target];
            setInformacion({
                Grado: dataRow.Grado,
                Grupo: dataRow.Grupo,
                Id_Nivel_Ingles: dataRow.Id_Nivel_Ingles,
                Materia: dataRow.Materia,
                Nivel: dataRow.Nivel
            });
            funcionAlumnosFaltas(dataRow);
            console.log(dataRow);
        }
    }

    async function funcionAlumnosFaltas (dataRow) {
        try {
            const responseMateria = await api.getCapturaFaltas(dataRow);
            const dataAlumnos = responseMateria.data.data.alumnos;
            const dataMeses = responseMateria.data.data.meses;
            setAlumnosFaltas(dataAlumnos);
            setMeses(dataMeses);
            setRegistros(responseMateria.data.data.alumnos.length);
            console.log(dataAlumnos);
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
        if (e.target.value === '' || re.test(e.target.value)) {
            let target= e.target.name;
            let value= e.target.value;
            let students = [...alumnosFaltas];
            let student = {
                ...students[target],
                Faltas: value
            };
            students[target]= student;
            setAlumnosFaltas(students);
            }
    }

    const handleGuardar = (e) => {
        e.preventDefault();
        guardar(alumnosFaltas);
    }

    const handleAsignar = (e) => {
        e.preventDefault();
        alumnosFaltas.forEach(row => {
            row.Faltas= asignarTodos;
        });
        guardar(alumnosFaltas);
    }

    const handleInputAsignar = (e) => {
        const re = /^\d{1,}(\.\d{0,4})?$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setAsignarTodos(e.target.value);
        }
    }

    async function guardar (dataAlumnos) {
        try {
            const responseGuardar = await api.postFaltasOficiales(dataAlumnos);
            if (responseGuardar) {
                swal("Completado", "Se guardó la informacion con exito.", "success");
                const dataAlumnos = responseGuardar.data.data;
                setAlumnosFaltas(dataAlumnos);
                return;
            }
        } catch (e) {
            if(!e.response && !e.response.data) {
                swal("Error", "Intente de nuevo más tarde.", "error");
                return;
            }
        }

    }

    const handleImprimir = (e) => {
        e.preventDefault();
        setTeacher(infoT.nombre_completo + " (" + infoT.id_personal + ")");
        setTimeout(() => window.print(), 1000)
        setTimeout(() => setTeacher(""), 1000)
    }

    return (
        <div>
            {
                !visibleFaltas &&
                <div className= "seccion-faltas hover-seccion fade-in">
                    <div className= "seccion-centro">
                        <div className= "seccion-tabla-faltas">
                            <div className= "hover-elemento">
                                {/* TABLA */}
                                <div className= "contenedor-tabla-faltas">
                                    <table className= "tabla-faltas">
                                        <thead>
                                            <tr>
                                                <th style={{textAlign:'center', width:'100px'}}><label>PERSONAL</label></th>
                                                <th style={{textAlign:'center'}}><label>CLAVE</label></th>
                                                <th style={{textAlign:'center'}}><label>MATERIAS IMPARTIDAS</label></th>
                                                <th style={{textAlign:'center'}}><label>NIVEL</label></th>
                                                <th style={{textAlign:'center'}}><label>GRADO</label></th>
                                                <th style={{textAlign:'center'}}><label>GRUPO</label></th>
                                                <th style={{textAlign:'center'}}><label>MODIFICAR</label></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { materiasFaltas && materiasFaltas.map( (info, i) => {
                                                return (
                                                <tr key={i}>
                                                    {/* ID */}
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{info.Id_Personal}</td>
                                                    {/* CLAVE */}
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{info.Id_Materia}</td>
                                                    {/* MATERIAS */}
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{info.Materia}</td>
                                                    {/* NIVEL */}
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{info.Nivel}</td>
                                                    {/* GRADO */}
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{info.Id_Grado}</td>
                                                    {/* GRUPO */}
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{info.Grupo}</td>
                                                    {/* CALIFICAR */}
                                                    <td style={{display:'flex', textAlign:'center'}}>
                                                        <button className= "boton-pencil calificar" 
                                                        onClick= {calificar}
                                                        value= {i}
                                                        name= "calificar">
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
                visibleFaltas &&
                <div className= "seccion-faltas hover-seccion fade-in">
                    <div className= "seccion-cerrar">
                        <button className= "boton-pencil close" 
                        onClick= {handleCerrar}
                        name= "cerrar">
                        </button>
                    </div>
                    <form>
                        <div className= "seccion-centro">
                            <div className= "seccion-docente-imprimir">
                                {teacher}
                            </div>
                            {/* TITULOS */}
                            <div className= "subtitulo-faltas">
                                <div className= "contenedor-mitad-faltas" >
                                    <h4>
                                        Listado de Alumnos de {informacion.Grado || ''} {informacion.Grupo || ''} de {informacion.Nivel || ''}
                                        <br/>
                                        Materia: {informacion.Materia || ''}
                                    </h4>
                                </div>
                                <div className= "contenedor-mitad-faltas" >
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
                            <div className= "seccion-tabla-faltas">
                                <div className= "hover-elemento">
                                    {/* TABLA */}
                                    <div className= "contenedor-tabla-faltas">
                                        <table className= "tabla-materias">
                                            <thead>
                                                <tr>
                                                    <th style={{textAlign:'center', width:'100px', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>MATRICULA</label></th>
                                                    <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderLeft: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>NO. DE LISTA</label></th>
                                                    <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>ALUMNO</label></th>
                                                    <th style={{textAlign:'center', width:'200px', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>FALTAS</label></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                            { alumnosFaltas && alumnosFaltas.map( (alumno, i) => {
                                                    return (
                                                    <tr key={alumno.Matricula}>
                                                        {/* MATRICULA */}
                                                        <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{alumno.Matricula || ''}</td>
                                                        {/* NO. DE LISTA */}
                                                        <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{alumno.Numero_Lista || ''}</td>
                                                        {/* ALUMNO */}
                                                        <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{alumno.Nombre || ''} {alumno.Paterno || ''} {alumno.Materno || ''}</td>
                                                        {/* CALIFICION */}
                                                        <td className= "seccion-input-centro">
                                                            <input
                                                            placeholder= "0.00"
                                                            className= "input-text-materias"
                                                            value= {alumno.Faltas || ''}
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
                        <div className= "subseccion hover-subseccion">
                            <div>
                                <div className= "subtitulo-faltas" style= {{height: '30px'}}>
                                    <h4>
                                        Total de registros: {registros}
                                    </h4>
                                </div>
                                <div className= "subtitulo-faltas imprimir" style= {{padding: '0px', height: '80px'}}>
                                    <div className= "contenedor-mitad-faltas">
                                        <div className= "seccion-input" style= {{height: '50px'}}>
                                            <input className= "input-text-materias"
                                            style= {{width:'50px', marginRight: '10px'}}
                                            placeholder= "0.00"
                                            name= "asignarTodos"
                                            onChange= {handleInputAsignar}
                                            value= {asignarTodos || ''}>
                                            </input>
                                            <button className= "boton-asignar"
                                            type= "submit"
                                            onClick= {handleAsignar}>
                                                ASIGNAR A TODOS
                                            </button>
                                        </div>
                                    </div>
                                    <div className= "contenedor-mitad-faltas" >
                                        <div className= "seccion-input" style= {{height: '50px'}}>
                                            <button className= "boton-pencil impresora"
                                            name= "impresora"
                                            onClick= {handleImprimir}>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className= "imprimir">
                                    <button className= "boton-guardar"
                                    type= "submit"
                                    onClick={handleGuardar}>
                                        Guardar faltas
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            }
        </div>
    );
};

export default Faltas;