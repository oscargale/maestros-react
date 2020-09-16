import React from 'react';
import './Informacion.css';

const Informacion = () => {
    return (
        <div>
            {/* TITULO */}
            <div className= "contenedor-titulo">
            <h2 className= "titulo-login">
                Acceso a docentes
            </h2>
            </div>
            {/* PARRAFOS */}
            <div className= "contenedor-parrafo">
            <p className= "parrafo-01">
                Para Accesar a la Red Escolar deberá ser un Usuario Registrado. 
                Por favor introduzca los dígitos de su Usuario y la Contraseña que le fue proporcionada.
            </p>
            </div>
        </div>  
    );
};

export default Informacion;