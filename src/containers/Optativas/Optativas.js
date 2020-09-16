import React from 'react';
import './Optativas.css';
import HeaderComponent from '../../components/Optativas/Header/Header';
import MateriasComponent from '../../components/Optativas/Materias/Materias';

const Optativas = () => {
    return (
      <div className= "contenedor-derecho fade-in">
        <div>
            <HeaderComponent />
        </div>
        <div>
            <MateriasComponent />
        </div>
      </div>
    );
  };
  
export default Optativas;