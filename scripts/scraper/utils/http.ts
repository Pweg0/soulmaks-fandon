import axios from 'axios'

export const http = axios.create({
  headers: {
    'User-Agent': 'SoulmaskBR-Wiki-Bot/1.0 (+https://soulmaskbr.com.br)',
  },
  timeout: 15000,
})

let lastRequest = 0

http.interceptors.request.use(async (config) => {
  const now = Date.now()
  const wait = Math.max(0, 1500 - (now - lastRequest))
  if (wait > 0) await new Promise(r => setTimeout(r, wait))
  lastRequest = Date.now()
  return config
})
