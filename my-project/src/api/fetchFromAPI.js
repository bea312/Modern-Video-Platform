import axios from 'axios'

const BASE_URL = 'https://youtube-v3-alternative.p.rapidapi.com'

const apiClient = axios.create({
  baseURL: BASE_URL,
  params: { geo: 'US', lang: 'en' },
  headers: {
    'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
    'X-RapidAPI-Host': 'youtube-v3-alternative.p.rapidapi.com',
  },
})

export const fetchFromAPI = async (endpoint) => {
  const { data } = await apiClient.get(`/${endpoint}`)
  return data
}
