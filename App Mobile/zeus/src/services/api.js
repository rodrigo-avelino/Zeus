import axios from "axios";

const instance = axios.create({
    baseURL: 'http://10.50.53.83:3000'
})

export default instance;