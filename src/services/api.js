import * as HttpService from './http';

import { http } from '../utils/constants';

const hasResponse = (res) => !res.success || res.responseCode !== 200 || !res.responseData;
const getToken = () => {
  const token = localStorage.getItem('appToken');
  if(!token) {
    return false;
  }

  return token;
}

const postLogin = async(usuario, password) => {
  const url = `${http.API_END_POINT.BASE}/auth`;
  const method = http.METHOD_TYPE.POST;

  const header = {
    'Content-Type': http.CONTENT_TYPE.APPLICATION_JSON,
  };

  const data = {
    usuario,
    password,
  }

  return HttpService.request(method, header, data, url)
    .then((response) => {
      return response;
    });
};

const getUserInfo = async(a) => {
  const url = `${http.API_END_POINT.BASE}/auth/me`;
  const method = http.METHOD_TYPE.GET;

  const header = {
    'Content-Type': http.CONTENT_TYPE.APPLICATION_JSON,
  };

  const token = getToken();
  if(token) {
    header['Authorization']=token;
  }

  return HttpService.request(method, header, null, url)
    .then((response) => {
      return response;
    });
};


const getGrades = async(a) => {
  const url = `${http.API_END_POINT.BASE}/official-grades/materias-oficiales`;
  const method = http.METHOD_TYPE.GET;

  const header = {
    'Content-Type': http.CONTENT_TYPE.APPLICATION_JSON,
  };

  const token = getToken();
  if(token) {
    header['Authorization']=token;
  }

  return HttpService.request(method, header, null, url)
    .then((response) => {
      return response;
    });
};

const getCaptura = async(materia) => {
  const url = `${http.API_END_POINT.BASE}/official-grades/materias-alumnos`;
  const method = http.METHOD_TYPE.POST;

  const header = {
    'Content-Type': http.CONTENT_TYPE.APPLICATION_JSON,
  };

  const token = getToken();
  if(token) {
    header['Authorization']=token;
  }

  return HttpService.request(method, header, materia, url)
    .then((response) => {
      return response;
    });
};

const postCalificaciones = async(calificaciones) => {
  const url = `${http.API_END_POINT.BASE}/official-grades/materias-oficiales-calificaciones`;
  const method = http.METHOD_TYPE.POST;

  const header = {
    'Content-Type': http.CONTENT_TYPE.APPLICATION_JSON,
  };

  console.log("api - calificaciones", calificaciones);

  const token = getToken();
  if(token) {
    header['Authorization']=token;
  }

  return HttpService.request(method, header, calificaciones, url)
    .then((response) => {
      return response;
    });
};

const getFaltas = async(a) => {
  const url = `${http.API_END_POINT.BASE}/faltas-oficiales/faltas`;
  const method = http.METHOD_TYPE.GET;

  const header = {
    'Content-Type': http.CONTENT_TYPE.APPLICATION_JSON,
  };

  const token = getToken();
  if(token) {
    header['Authorization']=token;
  }

  return HttpService.request(method, header, null, url)
    .then((response) => {
      return response;
    });
};

const getCapturaFaltas = async(materia) => {
  const url = `${http.API_END_POINT.BASE}/faltas-oficiales/faltas-alumnos`;
  const method = http.METHOD_TYPE.POST;

  const header = {
    'Content-Type': http.CONTENT_TYPE.APPLICATION_JSON,
  };

  console.log("api - captura faltas", materia);

  const token = getToken();
  if(token) {
    header['Authorization']=token;
  }

  return HttpService.request(method, header, materia, url)
    .then((response) => {
      return response;
    });
};

const getOptionalGrades = async(a) => {
  const url = `${http.API_END_POINT.BASE}/optional-grades/materias-optativas`;
  const method = http.METHOD_TYPE.GET;

  const header = {
    'Content-Type': http.CONTENT_TYPE.APPLICATION_JSON,
  };

  const token = getToken();
  if(token) {
    header['Authorization']=token;
  }

  return HttpService.request(method, header, null, url)
    .then((response) => {
      return response;
    });
};

const getCapturaOptional = async(materia) => {
  const url = `${http.API_END_POINT.BASE}/optional-grades/alumnos-optativas`;
  const method = http.METHOD_TYPE.POST;

  const header = {
    'Content-Type': http.CONTENT_TYPE.APPLICATION_JSON,
  };

  console.log("api - captura optativas", materia);

  const token = getToken();
  if(token) {
    header['Authorization']=token;
  }

  return HttpService.request(method, header, materia, url)
    .then((response) => {
      return response;
    });
};


export default {
  postLogin,
  getUserInfo,
  getGrades,
  getCaptura,
  postCalificaciones,
  getOptionalGrades,
  getCapturaOptional,
  getFaltas,
  getCapturaFaltas,
};