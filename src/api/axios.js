import axios from 'axios';

const setAuthToken = (token) => {
  // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else delete axios.defaults.headers.common['Authorization'];
};

export { setAuthToken };
