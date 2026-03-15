import axios from "axios";

const API_KEY = import.meta.env.VITE_RAPID_API_KEY;


const youtubeAPI = axios.create({
  baseURL: "https://youtube-v31.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Key": API_KEY,
    "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
  },
});

export const fetchFromAPI = async (endpoint, params = {}) => {
  const { data } = await youtubeAPI.get(endpoint, { params });
  return data;
};