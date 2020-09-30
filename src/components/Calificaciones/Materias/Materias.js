import React, {useState, useEffect} from 'react';
import './Materias.css';
import api from '../../../services/api';
import swal from 'sweetalert';

const Materias = () => {
    const [materias, setMaterias] = useState(false);
    const [alumnos, setAlumnos] = useState(false);
    const [registros, setRegistros] = useState(0);
    const [meses, setMeses] = useState(false);
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

    useEffect( () => {
        const initialize = async() => {
            try {
                let response = await api.getGrades();
                const data = response.data.data;
                setMaterias(data);
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
        if (visible === true && contador === 1) {
            setVisible(false);
            setContador(0);
            setAlumnos(false);
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
        setAsignarTodos(e.target.value);
    }

    async function guardar (dataAlumnos) {
        try {
            const responseGuardar = await api.postCalificaciones(dataAlumnos);
            if (responseGuardar) {
                swal("Completado", "Se guardó la informacion con exito.", "success");
                const dataAlumnos = responseGuardar.data.data;
                setAlumnos(dataAlumnos);
                return;
            }
        } catch (e) {
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
                                                            {/* <img src= {pencil} alt= "Calificar" /> */}
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
                    <div style={{width: '44px', height: 'auto', float: 'right', margin: '3px'}}>
                        <button className= "boton-pencil close"
                        onClick= {handleCerrar}
                        name= "cerrar">
                            {/* <img src= {cerrar} alt= "Cerrar" /> */}
                        </button>
                    </div>
                    <form>
                        <div className= "seccion-centro">
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
                                            { meses && meses.map( (mes, i) => {
                                                return (
                                                    <select className= "input-text-materias" key={mes.Id_Mes} name= "CMBMes">
                                                        <option>{mes.Mes}</option>
                                                    </select>
                                                );
                                            })}
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
                                                    <th style={{textAlign:'center', width:'100px'}}><label>MATRICULA</label></th>
                                                    <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderLeft: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>NO. DE LISTA</label></th>
                                                    <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>ALUMNO</label></th>
                                                    <th style={{textAlign:'center', width:'200px'}}><label>CALIFICACIÓN</label></th>
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
                                                        <td style= {{width:'200px'}}
                                                        className= "seccion-input-centro">
                                                            <input
                                                            placeholder= "0.0"
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
                        <div className= "subseccion hover-subseccion">
                            <div>
                                <div className= "subtitulo-materias" style= {{height: '30px'}}>
                                    <h4>
                                        Total de registros: {registros}
                                    </h4>
                                </div>
                                <div className= "subtitulo-materias" style= {{padding: '0px', height: '80px'}}>
                                    <div className= "contenedor-mitad-materias">
                                        <div className= "seccion-input" style= {{height: '50px'}}>
                                            <input className= "input-text-materias"
                                            style= {{width:'50px', marginRight: '10px'}}
                                            placeholder= "0.0"
                                            name= "asignarTodos"
                                            onChange= {handleInputAsignar}>
                                            </input>
                                            <button className= "boton-asignar"
                                            type= "submit"
                                            onClick= {handleAsignar}>
                                                ASIGNAR A TODOS
                                            </button>
                                        </div>
                                    </div>
                                    <div className= "contenedor-mitad-materias" >
                                        <div className= "seccion-input" style= {{height: '50px'}}>
                                            <label style= {{width: 'auto', top: '0px', marginRight: '10px'}}>
                                                IMPRIMIR:
                                            </label>
                                            <select className= "input-text-materias disabled" disabled>
                                                <option>

                                                </option>
                                                <option>
                                                    Lista de asistencia
                                                </option>
                                                <option>
                                                    Calificaciones del ciclo
                                                </option>
                                                <option>
                                                    Calificaciones de mes
                                                </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button className= "boton-guardar"
                                    type= "submit"
                                    onClick={handleGuardar}>
                                        Guardar calificaiones
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

export default Materias;