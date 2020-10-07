import React from 'react'
import { NavLink } from 'react-router-dom'
import './Menu.css';

const Menu = () => {
    return (
        <div className= "contenedor-menu">
            <div>
                <NavLink activeClassName= "activo" to= "/maestros-react/panel/inicio">
                    <div className= "contenedor-opc">
                        <div className= "opc">
                            Inicio
                        </div>
                    </div>
                </NavLink>
            </div>
            <div>
                <NavLink activeClassName= "activo" to= "/maestros-react/panel/materias">
                    <div className= "contenedor-opc">
                        <div className= "opc">
                            Materias Oficiales
                        </div>
                    </div>    
                </NavLink>
            </div>
            <div>
                <NavLink activeClassName= "activo" to= "/maestros-react/panel/faltas">
                    <div className= "contenedor-opc">
                        <div className= "opc">
                            Faltas
                        </div>
                    </div>    
                </NavLink>
            </div>
            <div>
                <NavLink activeClassName= "activo" to= "/maestros-react/panel/materias-optativas">
                    <div className= "contenedor-opc">
                        <div className= "opc">
                            Materias Optativas
                        </div>
                    </div>    
                </NavLink>
            </div>
            <div>
                <NavLink activeClassName= "activo" to= "/maestros-react/panel/faltas-optativas">
                    <div className= "contenedor-opc">
                        <div className= "opc">
                            Faltas Optativas
                        </div>
                    </div>    
                </NavLink>
            </div>
        </div>
    );
};

export default Menu;
