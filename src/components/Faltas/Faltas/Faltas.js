import React, {useState, useEffect} from 'react';
import './Faltas.css';
import pencil from '../../../images/pencil.png';
import cerrar from '../../../images/cerrar.png';
import impresora from '../../../images/impresora.png';
import api from '../../../services/api';
import p from '../../../'
import swal from 'sweetalert';

const Faltas = () => {    
    const [materiasFaltas, setMateriasFaltas] = useState(false);
    const [visible, setVisible] = useState(false);
    useEffect( () => {
        const initialize = async() => {
            try { 
                let response = await api.getFaltas();
                let data = response.data.data;
                console.log("faltas", data);
                setMateriasFaltas(data);
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

        } else {
            setVisible(true);
        }
    }

    return (
        <div>
            <div className= "seccion-faltas hover-seccion">
                <div className= "seccion-centro">
                    <div className= "seccion-tabla-faltas">
                        <div className= "hover-elemento">
                            {/* TABLA */}
                            <div className= "contenedor-tabla-faltas">
                                <table className= "tabla-faltas">
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
                                        { materiasFaltas && materiasFaltas.map( (grade, i) => {
                                            return (
                                            <tr key={i}>
                                                {/* ID */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Id_Personal}</td>
                                                {/* CLAVE */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Id_Materia}</td>
                                                {/* MATERIAS */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Materia}</td>
                                                {/* NIVEL */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Id_Nivel}</td>
                                                {/* GRADO */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Id_Grado}</td>
                                                {/* GRUPO */}
                                                <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}>{grade.Grupo}</td>
                                                {/* CALIFICAR */}
                                                <td style={{display:'flex', textAlign:'center'}}>
                                                    <div className= "boton-pencil" >
                                                        <img src= {pencil} alt= "Calificar" 
                                                        name= "calificar" 
                                                        onClick= {calificar}
                                                        value= {materiasFaltas[i]} />
                                                    </div>
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
                <div className= "seccion-faltas hover-seccion fade-in">
                    <div style={{width: '44px', height: 'auto', float: 'right', margin: '3px'}}>
                        <div className= "boton-pencil">
                            <img src= {cerrar} alt= "Cerrar" name= "cerrar" onClick= {handleCerrar} />
                        </div>
                    </div>
                    <form>
                        <div className= "seccion-centro">
                            {/* TITULOS */}
                            <div className= "subtitulo-faltas">
                                <div className= "contenedor-mitad-faltas" >
                                    <h4>
                                        Listado de Alumnos del Grupo  de  de 
                                        <br/>
                                        Materia:
                                    </h4>
                                </div>
                                <div className= "contenedor-mitad-faltas" >
                                    <div className= "seccion-input">
                                        <label style= {{width: 'auto', top: '0px', marginRight: '10px'}}>
                                            Mes:
                                        </label>
                                        <select className= "input-text-faltas">
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
                            <div className= "seccion-tabla-faltas">
                                <div className= "hover-elemento">
                                    {/* TABLA */}
                                    <div className= "contenedor-tabla-faltas">
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
                                                    <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}></td>
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
                                <div className= "subtitulo-faltas" style= {{height: '30px'}}>
                                    <h4>
                                        Total de registros:
                                    </h4>
                                </div>
                                <div className= "subtitulo-faltas" style= {{padding: '0px', height: '80px'}}>
                                    <div className= "contenedor-mitad-faltas">
                                        <div className= "seccion-input" style= {{height: '50px'}}>
                                            <input className= "input-text-faltas" 
                                            style= {{width:'35px', marginRight: '10px'}}
                                            placeholder= "0">
                                            </input>
                                            <button className= "boton-asignar" type= "submit">
                                                ASIGNAR A TODOS
                                            </button>
                                        </div>
                                    </div>
                                    <div className= "contenedor-mitad-faltas" >
                                        <div className= "seccion-input" style= {{height: '50px'}}>
                                            <div className= "boton-pencil">
                                                <img src= {impresora} alt= "Imprimir Faltas del Mes" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button className= "boton-guardar" type= "submit">
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