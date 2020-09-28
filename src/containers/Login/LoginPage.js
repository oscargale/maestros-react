import React from 'react';
import { useHistory } from "react-router-dom";
import swal from 'sweetalert';
import api from '../../services/api';

import './LoginPage.css';
import InformacionComponent from '../../components/LogIn/Informacion/Informacion';
import FormilarioComponent from '../../components/LogIn/Formulario/Formulario';

const LoginPage = () => {

  const history = useHistory();

  async function login(usuario, password) {
    
    console.log(usuario, password);

    try { 

      const response = await api.postLogin(usuario, password);
      const data = response.data;
      
      const token = data.token;
      localStorage.setItem('appToken', token);
      history.push('/maestros-react/panel');
    }catch (e){

      if(!e.response && !e.response.data) {
        swal("Error", "Intente de nuevo más tarde.", "error");
        return;
      }
      
      switch(e.response.data.status) {
        case 400:
          swal("Datos incorrectos.", "Usuario o contraseña incorrecta.", "info");
      }

      console.log("ERROR" , e.response);
    }
  }

  return (
    <div className="contenedor-centro">
      <InformacionComponent />
      <FormilarioComponent login= {login} />
    </div>
  );
};

export default LoginPage;
