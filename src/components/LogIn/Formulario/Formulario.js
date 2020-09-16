import React, { useState } from 'react';
import './Formulario.css';

const Formulario = ({login}) => {
    const [mostrar, setMostrar] = useState(false);

    const [usuario, setUsuario] = useState({
        usuario:'',
        contrasena:''
    })

    const handleInputChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    }

    const handleChecked = (e) => {
        setMostrar(e.target.checked)
    }

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            login(usuario.usuario, usuario.contrasena)
        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <div className= "contenedor-login">
            <form onSubmit= {handleSubmit}>
            {/* MATRICULA */}
            <div className= "contenedor-input">
                {/* LABEL */}
                <div className= "contenedor-label">
                <label>
                    Usuario:
                </label>
                </div>
                {/* INPUT */}
                <input
                className= "input-text"
                type= "text"
                name= "usuario"
                value={usuario.usuario}
                onChange={handleInputChange}
                />
            </div>
            
            {/* CONTRASEÑA */}
            <div className= "contenedor-input">
                {/* LABEL */}
                <div className= "contenedor-label">
                <label>
                    Contraseña:
                </label>
                {/* <label className= "contrasena">
                    ¿Olvidaste tu contraseña?
                </label> */}
                </div>
                {/* INPUT */}
                <input
                className= "input-text"
                type= {mostrar ? "text" : "password"}
                name= "contrasena"
                value={usuario.contrasena}
                onChange={handleInputChange}
                />
                {/* CHECK BOX */}
                <div className= "contenedor-label">
                <label style={{fontSize:'14px'}}>
                    <input
                    type="checkbox"
                    value= "true"
                    onClick= {handleChecked}
                    />
                    Mostrar contraseña
                </label>
                </div>
            </div>
                {/* BUTTON */}
                <div>
                <button
                    type= "submit"
                    className= "boton-login">
                    Siguiente
                </button>
                </div> 
            </form>
        </div>      
    );
};

export default Formulario;