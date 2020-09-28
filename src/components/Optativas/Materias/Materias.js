import React, {useState, useEffect} from 'react';
import './Materias.css';
import api from '../../../services/api';
import swal from 'sweetalert';

const Materias = () => {
    const [materias, setMaterias] = useState(false);
    const [alumnos, setAlumnos] = useState(false);
    const [meses, setMeses] = useState(false);
    const [registros, setRegistros] = useState(0);
    const [visible, setVisible] = useState(false);
    const [contador, setContador] = useState(0);
    const [informacion, setInformacion] = useState({
        Grado: null,
        Materia: null,
        Nivel: null
    });

    useEffect( () => {
        const initialize = async() => {
            try { 
                let response = await api.getOptionalGrades();
                console.log(response);
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
                Grado: dataRow.Id_Grado,
                Materia: dataRow.Materia,
                Nivel: dataRow.Nivel
            });
            funcionAlumnos(dataRow);
        }
    }

    async function funcionAlumnos (dataRow) {
        try {
            const responseOptativa = await api.getCapturaOptional(dataRow);
            console.log(responseOptativa);
            const dataAlumnos = responseOptativa.data.data.alumnos;
            const dataMeses = responseOptativa.data.data.meses;
            setAlumnos(dataAlumnos);
            setMeses(dataMeses);
            setRegistros(responseOptativa.data.data.alumnos.length);
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

    async function guardar (dataAlumnos) {
        try {
            // const responseGuardar = await api.postCalificaciones(dataAlumnos);
            // console.log(responseGuardar);
            // if (responseGuardar) {
            //     swal("Completado", "Se guardó la informacion con exito", "success");
            //     return;
            // }
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
                                                <th style={{textAlign:'center', width:'100px'}}><label>ID</label></th>
                                                <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderLeft: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>CLAVE</label></th>
                                                <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>MATERIAS OPTATIVAS</label></th>
                                                <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>MATERIAS</label></th>
                                                <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>NIVEL</label></th>
                                                <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)'}}><label>GRADO</label></th>
                                                <th style={{textAlign:'center'}}><label>CALIFICAR</label></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { materias && materias.map( (materia, i) => {
                                                return (
                                                <tr key={i}>
                                                    {/* ID */}
                                                    <td name= "Id_Personal" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Id_Materia || ''}</td>
                                                    {/* CLAVE */}
                                                    <td name= "Id_Materia" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Clave || ''}</td>
                                                    {/* MATERIAS OPTATIVAS */}
                                                    <td name= "Optativa" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Materia_Optativa || ''}</td>
                                                    {/* MATERIAS */}
                                                    <td name= "Materia" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Materia || ''}</td>
                                                    {/* NIVEL */}
                                                    <td name= "Id_Nivel" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Nivel || ''}</td>
                                                    {/* GRADO */}
                                                    <td name= "Id_Grado" style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{materia.Id_Grado || ''}</td>
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
                        </button>
                    </div>
                    <div className= "seccion-centro">
                        {/* TITULOS */}
                        <div className= "subtitulo-materias">
                            <div className= "contenedor-mitad-materias" >
                                <h4>
                                    Listado de Alumnos de {informacion.Grado}° de {informacion.Nivel} 
                                    <br/>
                                    Materia: {informacion.Materia}
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
                                                <th style={{textAlign:'center'}}><label>CALIFICACIÓN</label></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { alumnos && alumnos.map( (alumno, i) => {
                                                return (
                                                <tr key={alumno.Matricula}>
                                                    {/* MATRICULA */}
                                                    <td style={{borderRight: '3px solid rgb(230, 236, 240)'}}>{alumno.Matricula || ''}</td>
                                                    {/* NO. DE LISTA */}
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{alumno.Numero_Lista || ''}</td>
                                                    {/* ALUMNO */}
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{alumno.Nombre || ''} {alumno.Paterno || ''} {alumno.Materno || ''}</td>
                                                    {/* CALIFICION */}
                                                    <td style= {{width:'200px'}}>
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
                                        <input className= "input-text-materias disabled" 
                                        style= {{width:'35px', marginRight: '10px'}}
                                        placeholder= "0.0"
                                        disabled>
                                        </input>
                                        <button className= "boton-asignar disabled" disabled>
                                            ASIGNAR A TODOS
                                        </button>
                                    </div>
                                </div>
                                <div className= "contenedor-mitad-materias" >
                                    <div className= "seccion-input" style= {{height: '50px'}}>
                                        <button className= "boton-pencil impresora disabled" 
                                        name= "impresora"
                                        disabled>
                                        </button>
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
                </div>
            }
        </div>
    );
};

export default Materias;