import React from 'react';
import './Calificaciones.css';
import HeaderComponent from '../../components/Calificaciones/Header/Header';
import CalificacionesComponent from '../../components/Calificaciones/Materias/Materias';

const Calificaciones = () => {
    return (
      <div className= "contenedor-derecho fade-in">
        <div>
            <HeaderComponent />
        </div>
        <div>
            <CalificacionesComponent />
        </div>
      </div>
    );
  };
  
export default Calificaciones;