import React, { createContext, useContext, useState, useEffect } from 'react'
import apiClient from '../services/api/apiClient'

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
    // Restore session from localStorage
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch {
        localStorage.removeItem('authToken')
        localStorage.removeItem('userData')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      // Call backend directly — apiClient already has baseURL set to http://localhost:5000/api
      const response = await apiClient.post('/auth/login', { email, password })
      const data = response.data  // axios unwraps the HTTP response into .data

      // Backend returns: { success: true, token, user: { id, name, email, role } }
      if (data && data.success && data.token) {
        localStorage.setItem('authToken', data.token)
        const userData = data.user || data.data
        setUser(userData)
        localStorage.setItem('userData', JSON.stringify(userData))
        return { success: true }
      } else {
        return { success: false, error: data?.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      // Get the backend error message if available
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your credentials.'
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  }

  const value = { user, login, logout, loading }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}