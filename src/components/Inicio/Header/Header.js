import React from 'react';
import './Header.css';

const Header = () => {
    return (
      <div className= "header-bienvenida">
        <div className= "contenedor-texto">
          <div className= "titulo-inicio">
            <h2 className= "h2-titulo">
              Bienvenido a Servicios Escolares
            </h2>
          </div>
          <div className= "subtitulo-inicio">
            <p>
              Instituto Cultural de Occidente
            </p>
          </div>
        </div>
      </div>
    );
  };
  
export default Header;