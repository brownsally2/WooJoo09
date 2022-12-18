import axios from "axios";
const HEADER = 'application/json';
const BASE_URL = "http://localhost:8090/developerKirby/";

const api = {
  userLogin: async function(id, pwd) {
    const loginObj = {
        id: id,
        pwd: pwd
    }
    return await axios.post(BASE_URL + "AdminLoginServlet", loginObj, HEADER);
  },
};

export default api;