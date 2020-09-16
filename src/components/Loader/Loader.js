import React, {useState, useEffect} from 'react';
import './Loader.css';

const Loader = ({visible , text }) => {

    const display = visible ? 'block' : 'none';
    const visibleText = text ? text : 'Cargando...';

    return (
        <div id="overlay" style={ { display } }>
            <div className="spinner"></div>
            <br/>
            {visibleText}
        </div>
    );
};

export default Loader;