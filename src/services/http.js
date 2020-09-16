import axios from 'axios';

const request = (method, headers, data, url) => {
  const options = {
    method,
    url,
    headers: headers || {'Content-Type': 'application/json'},
    data: JSON.stringify(data),
  };

  return axios(options).then(res => res);
}

export {
  request,
};