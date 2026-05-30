import axios from 'axios'
import { authStore } from '../store/authStore'

export const api = axios.create({ baseURL: import.meta.env.API_URL })

api.interceptors.request.use(config => {
	const token = authStore.getState().token
	if (token) config.headers.Authorization = `Bearer ${token}`
	return config
})
