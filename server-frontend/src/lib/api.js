import axios from 'axios'


const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
})

// 요청 인터셉터 - JWT 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터 - 토큰 만료 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  signUp: (userData) => api.post('api/sign-up', userData),
  signIn: (userData) => api.post('api/sign-in', userData),
  logout: () => api.post('/logout'),
}

export const boardAPI = {
  getBoards: () => api.get('/boards/getBoard'),
  getBoard: (id) => api.get(`/boards/${id}/read`),
  createBoard: (boardData) => api.post('/boards/write', boardData),
  updateBoard: (id, boardData) => api.put(`/boards/${id}/modify`, boardData),
  deleteBoard: (id) => api.patch(`/boards/${id}/delete`),
  likeBoard: (id) => api.post(`/boards/${id}/like`),
  unlikeBoard: (id) => api.post(`/boards/${id}/unlike`),
  getTopBoards: (count = 10) => api.get(`/boards/top?count=${count}`),
  getBoardLikeCount: (boardId) => api.get(`/boards/${boardId}/likes/count`)
}

export const weatherAPI = {
  getWeatherImage: () => api.get('/weather-image'),
  getAllWeather: () => api.get('/find-all-weather'),
  getWeather: (id) => api.get(`/find-one-weather/${id}`),
}

export const commentAPI = {
  getComment: (boardId) => api.get(`/${boardId}/comment`),
  createWeatherComment: (boardId, commentData) => api.post(`/${boardId}/weatherComments`, commentData),
  createBoardComment: (boardId, commentData) => api.post(`/${boardId}/boardComments`, commentData),
  updateBoardComment: (boardId, commentId, commentData) => api.put(`/${boardId}/boardComments/${commentId}`, commentData),
  deleteComment: (commentId) => api.patch(`/admin/${commentId}/deletecomment`),
  commentBoard: (boardId, commentData) => api.post(`/${boardId}/comment`, commentData),
}

export default api
