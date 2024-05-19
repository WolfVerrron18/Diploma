import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_BASE_API
})

http.interceptors.request.use(
  (response) => response,
  ({ config }) => {
    console.log(config)
  }
)

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('AccessToken')

    if (token) config.headers['Authorization'] = 'Bearer ' + token

    return config
  },
  (error) => error
)

export { http }
