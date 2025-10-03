import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../lib/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    const savedUserInfo = localStorage.getItem('userInfo')
    
    if (token && savedUserInfo) {
      try {
        const userInfo = JSON.parse(savedUserInfo)
        setUser({ 
          token,
          userCode: userInfo.userCode,
          username: userInfo.username
        })
      } catch (error) {
        console.error('사용자 정보 파싱 실패:', error)
        localStorage.removeItem('userInfo')
      }
    }
    setLoading(false)
  }, [])

  const login = async (userData) => {
    try {
      const response = await authAPI.signIn(userData)
      console.log('로그인 응답:', response.data)
      
      const { accessToken, refreshToken, user: userInfo } = response.data
      
      localStorage.setItem('accessToken', accessToken)
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      
      // 사용자 정보도 localStorage에 저장
      localStorage.setItem('userInfo', JSON.stringify({
        userCode: userInfo.userCode,
        username: userInfo.username
      }))
      
      // user 상태에 모든 필요한 정보 포함
      setUser({ 
        token: accessToken,
        userCode: userInfo.userCode,
        username: userInfo.username
      })
      
      console.log('설정된 user:', { 
        token: accessToken,
        userCode: userInfo.userCode,
        username: userInfo.username
      })
      
      return { success: true }
    } catch (error) {
      console.error('로그인 실패:', error)
      return { 
        success: false, 
        error: error.response?.data || '로그인에 실패했습니다.' 
      }
    }
  }

  const register = async (userData) => {
    try {
      await authAPI.signUp(userData)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data || '회원가입에 실패했습니다.' 
      }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
