import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import './Usuario.css';
import api from '../../services/api';
import swal from 'sweetalert';
import imgStudentPortrait from '../../images/student_portrait.svg';

const Usuario = () => {

    const [userID, setUserID] = useState('');
    const [teacherName, setTeacherName] = useState('');

    useEffect( () => {

        const initialize = async() => {
            try { 
                const response = await api.getUserInfo();
                const data = response.data;

                setTeacherName(data.nombre_completo);
                setUserID("(" + data.id_personal + ")");

            }catch (e){
                if(!e.response && !e.response.data) {
                    swal("Error", "Intente de nuevo más tarde.", "error");
                    return;
                }
            }
        }

        initialize();

    }, []);

    return (
        <div className= "contenedor-usuario hover-seccion">
            <div className= "seccion-boton-perfil hover-subseccion">
                <Link to= "/">
                    <button className= "boton-cerrar">
                        Cerrar sesión
                    </button>
                </Link>
            </div>
            <div className= "seccion-perfil hover-subseccion">
                <div className= "seccion-img-perfil">
                    <div className= "img-perfil">
                        <img src={imgStudentPortrait} />
                    </div>
                </div>
            </div>
            <div className= "seccion-informacion hover-subseccion">
                <div className= "seccion-docente">
                    <div>
                        <div className="titulo-usuario">
                            Docente:
                        </div>
                        <div className= "informacion-usuario">
                            {teacherName} {userID}
                        </div>
                    </div>
                </div>
            </div>
      </div>
    );
  };

export default Usuario;