import axios from 'axios'


const api = axios.create({
  baseURL: '/api/', // ✨ baseURL에 슬래시 추가
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
  signUp: (userData) => api.post('sign-up', userData), // ✨ 슬래시 제거
  signIn: (userData) => api.post('sign-in', userData), // ✨ 슬래시 제거
  logout: () => api.post('logout'), // ✨ 슬래시 제거
}

export const boardAPI = {
  getBoards: () => api.get('boards/getBoard'), // ✨ 슬래시 제거
  getBoard: (id) => api.get(`boards/${id}/read`), // ✨ 슬래시 제거
  createBoard: (boardData) => api.post('boards/write', boardData), // ✨ 슬래시 제거
  updateBoard: (id, boardData) => api.put(`boards/${id}/modify`, boardData), // ✨ 슬래시 제거
  deleteBoard: (id) => api.patch(`boards/${id}/delete`), // ✨ 슬래시 제거
  likeBoard: (id) => api.post(`boards/${id}/like`), // ✨ 슬래시 제거
  unlikeBoard: (id) => api.post(`boards/${id}/unlike`), // ✨ 슬래시 제거
  getTopBoards: (count = 10) => api.get(`boards/top?count=${count}`), // ✨ 슬래시 제거
  getBoardLikeCount: (boardId) => api.get(`boards/${boardId}/likes/count`) // ✨ 슬래시 제거
}

export const weatherAPI = {
  getWeatherImage: () => api.get('weather-image'), // ✨ 슬래시 제거
  getAllWeather: () => api.get('find-all-weather'), // ✨ 슬래시 제거
  getWeather: (id) => api.get(`find-one-weather/${id}`), // ✨ 슬래시 제거
}

export const commentAPI = {
  getComment: (boardId) => api.get(`${boardId}/comment`), // ✨ 슬래시 제거
  createWeatherComment: (boardId, commentData) => api.post(`${boardId}/weatherComments`, commentData), // ✨ 슬래시 제거
  createBoardComment: (boardId, commentData) => api.post(`${boardId}/boardComments`, commentData), // ✨ 슬래시 제거
  updateBoardComment: (boardId, commentId, commentData) => api.put(`${boardId}/boardComments/${commentId}`, commentData), // ✨ 슬래시 제거
  deleteComment: (commentId) => api.patch(`admin/${commentId}/deletecomment`), // ✨ 슬래시 제거
  commentBoard: (boardId, commentData) => api.post(`${boardId}/comment`, commentData), // ✨ 슬래시 제거
}

export default api