import React from 'react';
import HeaderComponent from '../../components/Inicio/Header/Header';
import BienvenidaComponent from '../../components/Inicio/Bienvenida/Bienvenida';

const Inicio = () => {
    return (
        <div className= "contenedor-derecho fade-in">
            <div>
              <HeaderComponent />
            </div>
            <div>
              <BienvenidaComponent />
            </div>
        </div>
    );
  };
  
export default Inicio;