import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import LoginPage from './containers/Login/LoginPage';
import PanelPage from './containers/Panel/PanelPage';
import InicioPage from './containers/Inicio/Inicio';
import CalificacionesPage from './containers/Calificaciones/Calificaciones';
import FaltasPage from './containers/Faltas/Faltas';
import OptativasPage from './containers/Optativas/Optativas';
import FaltasOptativasPage from './containers/FaltasOptativas/Faltas';

import './index.css';

ReactDOM.render(
    <BrowserRouter>
    <Route exact path='/' component= {LoginPage} />
      <Route exact path='/maestros-react/' component= {LoginPage} />
      <Route path='/maestros-react/panel' component= {PanelPage} />
      <Switch>
        <Route path='/maestros-react/panel/inicio' component= {InicioPage} />
        <Route path='/maestros-react/panel/materias' component= {CalificacionesPage} />
        <Route path='/maestros-react/panel/faltas' component= {FaltasPage} />
        <Route path='/maestros-react/panel/materias-optativas' component= {OptativasPage} />
        <Route path='/maestros-react/panel/faltas-optativas' component= {FaltasOptativasPage} />
        <Redirect from='/maestros-react/panel' to='/maestros-react/panel/inicio' />
      </Switch>
    </BrowserRouter>,
  document.getElementById('md-react-app-teacher')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
