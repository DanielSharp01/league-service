import axios from "axios";

export const createAxios = (baseURL: string) => {
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      'X-Riot-Token': 'RGAPI-7ad7acd8-694e-4a0d-865c-174abb12acaa'
    }
  });
  axiosInstance.interceptors.response.use(res => res?.data, err => {
    return err.response.status === 404 ? Promise.resolve(null) : Promise.reject(err.response.data);
  });  return axiosInstance;
}