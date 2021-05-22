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
        Nivel: null,
        Materia_Optativa: null
    });
    const [asignarTodos, setAsignarTodos] = useState(0);
    const [infoT, setInfoT] = useState(false);
    const [teacher, setTeacher] = useState('');
    const [habilitarBoton, setHabilitarBoton] = useState(false);

    useEffect( () => {
        const initialize = async() => {
            try { 
                let response = await api.getOptionalGrades();
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
                Nivel: dataRow.Nivel,
                Materia_Optativa: dataRow.Materia_Optativa
            });
            funcionAlumnos(dataRow);
        }
    }

    async function funcionAlumnos (dataRow) {
        try {
            const responseOptativa = await api.getCapturaOptional(dataRow);
            const dataAlumnos = responseOptativa.data.data.alumnos;
            const dataMeses = responseOptativa.data.data.meses;
            if (dataMeses.length === 0) {
                setHabilitarBoton(false);
            } else {
                setHabilitarBoton(true);
            }
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
            /*const responseGuardar = await api.postCalificacionesOptativas(dataAlumnos);
            if (responseGuardar) {
                swal("Completado", "Se guardó la informacion con exito", "success");
                const dataAlumnos = responseGuardar.data.data;
                setAlumnos(dataAlumnos);
                return;
            }*/
            for (let row of dataAlumnos) {
                if (row.Calificacion <=4 && row.Calificacion >= 0) {
                    pass = 1;
                    break;
                }
            }
            switch (pass) {
                case 0:
                    const responseGuardar = await api.postCalificacionesOptativas(dataAlumnos);
                    if (responseGuardar) {
                        swal("Completado", "Se guardó la informacion con exito", "success");
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

    const handleImprimir = (e) => {
        e.preventDefault();
        setTeacher(infoT.nombre_completo + " (" + infoT.id_personal + ")");
        setTimeout(() => window.print(), 1000)
        setTimeout(() => setTeacher(""), 1000)
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
                                                <th style={{textAlign:'center'}}><label>CLAVE</label></th>
                                                <th style={{textAlign:'center'}}><label>MATERIAS OPTATIVAS</label></th>
                                                <th style={{textAlign:'center'}}><label>MATERIAS</label></th>
                                                <th style={{textAlign:'center'}}><label>NIVEL</label></th>
                                                <th style={{textAlign:'center'}}><label>GRADO</label></th>
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
                    <div className= "seccion-centro">
                        <div className= "seccion-docente-imprimir">
                            {teacher}
                        </div>
                        {/* TITULOS */}
                        <div className= "subtitulo-materias">
                            <div className= "contenedor-mitad-materias" >
                                <h4>
                                    Listado de Alumnos de {informacion.Grado}° de {informacion.Nivel} 
                                    <br/>
                                    Materia: {informacion.Materia} - {informacion.Materia_Optativa}
                                </h4>
                            </div>
                            <div className= "contenedor-mitad-materias" >
                                {
                                    habilitarBoton &&
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
                                }
                                
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
                                                <th style={{textAlign:'center', width:'100px', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>MATRICULA</label></th>
                                                <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderLeft: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>NO. DE LISTA</label></th>
                                                <th style={{textAlign:'center', borderRight: '1px solid rgb(230, 236, 240)', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>ALUMNO</label></th>
                                                <th style={{textAlign:'center', width:'100px', borderBottom: '1px solid rgb(230, 236, 240)'}}><label>CALIFICACIÓN</label></th>
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
                    <div className= "subseccion hover-subseccion">
                        <div>
                            <div className= "subtitulo-materias" style= {{height: '30px'}}>
                                <h4>
                                    Total de registros: {registros}
                                </h4>
                            </div>
                            <div className= "subtitulo-materias imprimir" style= {{padding: '0px', height: '80px'}}>
                                {
                                    habilitarBoton &&
                                    <div className= "contenedor-mitad-materias">
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
                                
                                <div className= "contenedor-mitad-materias" >
                                    <div className= "seccion-input" style= {{height: '50px'}}>
                                        <button className= "boton-pencil impresora" 
                                        name= "impresora"
                                        onClick= {handleImprimir}>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {
                                    habilitarBoton &&
                                    <div className= "imprimir">
                                        <button className= "boton-guardar"
                                        type= "submit"
                                        onClick={handleGuardar}>
                                            Guardar calificaciones
                                        </button>
                                    </div>
                                }
                            </div>
                            
                        </div>
                        
                    </div>
                </div>
            }
        </div>
    );
};

export default Materias;