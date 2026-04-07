import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
  timeout: 0, // No timeout for large PDF processing
});

export default client;
