import React from 'react';
import './Faltas.css';
import HeaderComponent from '../../components/Faltas/Header/Header';
import FaltasComponent from '../../components/Faltas/Faltas/Faltas';

const Faltas = () => {
    return (
      <div className= "contenedor-derecho fade-in">
        <div>
            <HeaderComponent />
        </div>
        <div>
            <FaltasComponent />
        </div>
      </div>
    );
  };
  
export default Faltas;