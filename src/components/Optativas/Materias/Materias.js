import React, {useState, useEffect} from 'react';
import './Materias.css';
import pencil from '../../../images/pencil.png';
import cerrar from '../../../images/cerrar.png';
import impresora from '../../../images/impresora.png';
import api from '../../../services/api';
import p from '../../..'
import swal from 'sweetalert';

const Materias = () => {   

    const [visible, setVisible] = useState(false);

    const showDiv = (e) => {
        e.preventDefault();
        console.log(visible);
        console.log(e.target.name);
        if (e.target.name === 'calificar') {
            if (visible === false) {
                setVisible(true);
            }
        } else if (e.target.name === 'cerrar') {
            if (visible === true) {
                setVisible(false);
            }
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
                                            <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderLeft: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>CLAVE</label></th>
                                            <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>MATERIAS OPTATIVAS</label></th>
                                            <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>NIVEL</label></th>
                                            <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)'}}><label>GRADO</label></th>
                                            <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)'}}><label>GRUPO</label></th>
                                            <th style={{textAlign:'center'}}><label>CALIFICAR</label></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {/* ID */}
                                            <td style={{borderRight: '3px solid rgb(230, 236, 240)'}}></td>
                                            {/* CLAVE */}
                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}></td>
                                            {/* MATERIAS */}
                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}></td>
                                            {/* NIVEL */}
                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}></td>
                                            {/* GRADO */}
                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}></td>
                                            {/* GRUPO */}
                                            <td style={{borderRight: '1px solid rgb(230, 236, 240)'}}></td>
                                            {/* CALIFICAR */}
                                            <td style={{display:'flex', textAlign:'center'}}>
                                                <div className= "boton-pencil" >
                                                    <img src= {pencil} alt= "Calificar" name= "calificar" onClick= {showDiv} />
                                                </div>
                                            </td>
                                        </tr>
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
                        <div className= "boton-pencil">
                            <img src= {cerrar} alt= "Cerrar" name= "cerrar" onClick= {showDiv} />
                        </div>
                    </div>
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
                                        <button className= "boton-asignar">
                                            ASIGNAR A TODOS
                                        </button>
                                    </div>
                                </div>
                                <div className= "contenedor-mitad-materias" >
                                    <div className= "seccion-input" style= {{height: '50px'}}>
                                        <div className= "boton-pencil">
                                            <img src= {impresora} alt= "Imprimir Faltas del Mes" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className= "boton-guardar">
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