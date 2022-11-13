import axios from 'axios';

const setAuthToken = (token) => {
  // axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else delete axios.defaults.headers.common['Authorization'];
};

const hasJWT = () => {
  const token = localStorage.getItem('token');
  if (token) {
    setAuthToken(token);
    return true;
  }
  return false;
}

const sendLoginRequest = async (data) => {
  const sent = await axios
    .post('http://localhost:9000/login', data)
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem('token', token);
      console.log(token);
      setAuthToken(token);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
  return sent;
};

const sendSignupRequest = async (data) => {
  await axios.post('http://localhost:9000/signup', data);
  const sent = await sendLoginRequest(data);
  return sent;
};

export { setAuthToken, hasJWT, sendLoginRequest, sendSignupRequest };
