import React from 'react';
import './PanelPage.css';
import UsuarioComponent from '../../components/Usuario/Usuario';
import MenuComponent from '../../components/Menu/Menu';

const PanelPage = () => {

  return (
    <div className= "contenedor-izquierdo">
      <div id= "panelUsuario">
        <UsuarioComponent />
      </div>
      <div id= "panelMenu">
        <MenuComponent />
      </div>
    </div>
  );

};

export default PanelPage;
