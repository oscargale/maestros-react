import React, {useState, useEffect} from 'react';
import './Materias.css';
import pencil from '../../../images/pencil.png';
import cerrar from '../../../images/cerrar.png';
import api from '../../../services/api';
import p from '../../../'
import swal from 'sweetalert';

const Materias = () => {  
    const [materias, setMaterias] = useState(false);
    const [visible, setVisible] = useState(false);
    useEffect( () => {
        const initialize = async() => {
            try { 
                let response = await api.getGrades();
                let data = response.data.data;
                setMaterias(data);
                console.log("materias", materias);
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
        e.preventDefault();
        if (visible === true) {
            setVisible(false);
        }
    }

    const calificar = (e) => {
        e.preventDefault();
        if (visible === true) {
            // HACER LA CONSULTAPARA TRAER LA INFORMACION DE LOS ALUMNOS
            console.log(e.target.value);
        } else {
            setVisible(true);
        }
    }

    return (
        <div>
            <div className= "seccion-materias hover-seccion">
                <div className= "seccion-centro">
                    <div className= "seccion-tabla-materias">
                        <div className= "hover-elemento">
                            {/* TABLA */}
                            <div className= "contenedor-tabla-materias">
                                <table className= "tabla-materias">
                                    <thead>
                                        <tr>
                                            <th style={{textAlign:'center', width:'100px'}}><label>ID</label></th>
                                            <th style={{textAlign:'center'}}><label>CLAVE</label></th>
                                            <th style={{textAlign:'center'}}><label>MATERIAS IMPARTIDAS</label></th>
                                            <th style={{textAlign:'center'}}><label>NIVEL</label></th>
                                            <th style={{textAlign:'center'}}><label>GRADO</label></th>
                                            <th style={{textAlign:'center'}}><label>GRUPO</label></th>
                                            <th style={{textAlign:'center'}}><label>CALIFICAR</label></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        { materias && materias.map( (grade, i) => {
                                            return (
                                            <tr key={i}>
                                                {/* ID */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Id_Personal || ''}</td>
                                                {/* CLAVE */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Id_Materia || ''}</td>
                                                {/* MATERIAS */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Materia || ''}</td>
                                                {/* NIVEL */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Id_Nivel || ''}</td>
                                                {/* GRADO */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Id_Grado || ''}</td>
                                                {/* GRUPO */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Grupo || ''}</td>
                                                {/* CALIFICAR */}
                                                <td style={{display:'flex', textAlign:'center'}}>
                                                    <button className= "boton-pencil" 
                                                    onClick= {calificar}
                                                    value= {materias[i]}
                                                    name= "calificar">
                                                        <img src= {pencil} alt= "Calificar" />
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
            {
                visible && 
                <div className= "seccion-materias hover-seccion fade-in">
                    <div style={{width: '44px', height: 'auto', float: 'right', margin: '3px'}}>
                        <button className= "boton-pencil" 
                        onClick= {handleCerrar}
                        name= "cerrar">
                            <img src= {cerrar} alt= "Cerrar" />
                        </button>
                    </div>
                    <form>
                        <div className= "seccion-centro">
                            {/* TITULOS */}
                            <div className= "subtitulo-materias">
                                <div className= "contenedor-mitad-materias" >
                                    <h4>
                                        Listado de Alumnos del Grupo  de  de 
                                        <br/>
                                        Materia:
                                    </h4>
                                </div>
                                <div className= "contenedor-mitad-materias" >
                                    <div className= "seccion-input">
                                        <label style= {{width: 'auto', top: '0px', marginRight: '10px'}}>
                                            Mes:
                                        </label>
                                        <select className= "input-text-materias">
                                            <option>
                                                1er Parcial
                                            </option>
                                            <option>
                                                2do Parcial
                                            </option>
                                            <option>
                                                3er Parcial
                                            </option>
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
                                                    <th style={{textAlign:'center', width:'100px'}}><label>MATRICULA</label></th>
                                                    <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderLeft: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>NO. DE LISTA</label></th>
                                                    <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>ALUMNO</label></th>
                                                    <th style={{textAlign:'center'}}><label>CALIFICACIÓN</label></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    {/* MATRICULA */}
                                                    <td style={{borderRight: '3px solid rgb(230, 236, 240)'}}></td>
                                                    {/* NO. DE LISTA */}
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}></td>
                                                    {/* ALUMNO */}
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}></td>
                                                    {/* CALIFICION */}
                                                    <td style= {{width:'200px'}}><input className= "input-text-materias">

                                                    </input></td>
                                                </tr>
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
                                        Total de registros:
                                    </h4>
                                </div>
                                <div className= "subtitulo-materias" style= {{padding: '0px', height: '80px'}}>
                                    <div className= "contenedor-mitad-materias">
                                        <div className= "seccion-input" style= {{height: '50px'}}>
                                            <input className= "input-text-materias" 
                                            style= {{width:'35px', marginRight: '10px'}}
                                            placeholder= "0.0">
                                            </input>
                                            <button className= "boton-asignar" type= "submit">
                                                ASIGNAR A TODOS
                                            </button>
                                        </div>
                                    </div>
                                    <div className= "contenedor-mitad-materias" >
                                        <div className= "seccion-input" style= {{height: '50px'}}>
                                            <label style= {{width: 'auto', top: '0px', marginRight: '10px'}}>
                                                IMPRIMIR:
                                            </label>
                                            <select className= "input-text-materias">
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
                                    <button className= "boton-guardar" type= "submit">
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