import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

const s3Api = axios.create()

// Add JWT token to backend API requests.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Redirect to login when the backend says the token is no longer valid.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  signUp: (userData) => api.post('/sign-up', userData),
  signIn: (userData) => api.post('/sign-in', userData),
  logout: () => api.post('/logout'),
}

export const sellerAPI = {
  register: (sellerData) => api.post('/seller/register', sellerData),
  getMe: () => api.get('/seller/me'),
  updateMe: (sellerData) => api.put('/seller/me', sellerData),
}

export const sellerProductAPI = {
  createPresignedUrl: ({ fileName, contentType }) =>
    api.post('/seller/products/images/presigned-url', { fileName, contentType }),
  uploadOriginalImage: (uploadUrl, file, contentType = file?.type, config = {}) =>
    s3Api.put(uploadUrl, file, {
      ...config,
      headers: {
        ...config.headers,
        'Content-Type': contentType || 'application/octet-stream',
      },
    }),
  createProduct: (productData) => api.post('/seller/products', productData),
  getMyProducts: () => api.get('/seller/products'),
  generateAiImage: (productId) => api.post(`/seller/products/${productId}/ai-image`),
  updateProduct: (productId, productData) => api.put(`/seller/products/${productId}`, productData),
  deleteProduct: (productId) => api.delete(`/seller/products/${productId}`),
  stockIn: (productId, stockData) => api.post(`/seller/products/${productId}/stock/in`, stockData),
  startDiscount: (productId, discountData) => api.post(`/seller/products/${productId}/discount`, discountData),
}

export const productAPI = {
  getProducts: ({ category, status = 'ACTIVE' } = {}) =>
    api.get('/products', {
      params: {
        category,
        status,
      },
    }),
  getProduct: (productId) => api.get(`/products/${productId}`),
}

export const boardAPI = {
  getBoards: () => api.get('/boards/getBoard'),
  getBoard: (id) => api.get(`/boards/${id}/read`),
  createBoard: (boardData) => api.post('/boards/write', boardData),
  createSellerProductBoard: (boardData) => api.post('/boards/seller/write', boardData),
  updateBoard: (id, boardData) => api.put(`/boards/${id}/modify`, boardData),
  deleteBoard: (id) => api.patch(`/boards/${id}/delete`),
  likeBoard: (id) => api.post(`/boards/${id}/like`),
  unlikeBoard: (id) => api.post(`/boards/${id}/unlike`),
  getTopBoards: (options = 10) => {
    const params = typeof options === 'number' ? { count: options } : options
    return api.get('/boards/top', { params })
  },
  getBoardLikeCount: (boardId) => api.get(`/boards/${boardId}/likes/count`),
  createOrderFromBoard: (boardId, orderData) => api.post(`/boards/${boardId}/orders`, orderData),
}

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/me'),
  getOrder: (orderId) => api.get(`/orders/${orderId}`),
  getOrdersByUserId: (userId) => api.get(`/orders/users/${userId}`),
  cancelOrder: (orderId) => api.patch(`/orders/${orderId}/cancel`),
}

export const paymentAPI = {
  createPayment: (paymentData) => api.post('/payments', paymentData),
  getPayment: (paymentId) => api.get(`/payments/${paymentId}`),
  getPaymentByOrderId: (orderId) => api.get(`/payments/orders/${orderId}`),
  paymentSuccess: (paymentData) => api.get('/payments/success', { params: paymentData }),
  paymentFail: (orderId) => api.get('/payments/fail', { params: { orderId } }),
}

export const weatherAPI = {
  getWeatherImage: () => api.get('/weather-image'),
  getAllWeather: () => api.get('/find-all-weather'),
  getWeather: (id) => api.get(`/find-one-weather/${id}`),
  regenerateWeatherImage: () => api.delete('/weather-image/cache'),
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
