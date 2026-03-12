import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, Shield, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }
    setLoading(true)
    setError('')

    try {
      const result = await login(email, password)
      if (result.success) {
        navigate('/dashboard', { replace: true })
      } else {
        setError(result.error || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-teal/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/20">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-bold text-white tracking-tight font-heading">
            PLANTIVE
          </h2>
          <p className="mt-2 text-[15px] font-medium text-brand-100">
            Sign in to access your agricultural dashboard
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="glass-panel !bg-red-500/10 !border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-200 shrink-0 mt-0.5" />
            <span className="text-red-100 text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="glass-panel p-8 sm:p-10 rounded-3xl space-y-6 shadow-2xl backdrop-blur-xl">

          {/* Email */}
          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-2 font-heading">
              Email Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 group-focus-within:text-brand-600 transition-colors" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/60 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:bg-white transition-all duration-300 text-[15px] text-gray-900 placeholder-gray-400 outline-none"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[14px] font-bold text-gray-700 mb-2 font-heading">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[18px] w-[18px] text-gray-400 group-focus-within:text-brand-600 transition-colors" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-12 py-3.5 bg-white/60 border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 focus:bg-white transition-all duration-300 text-[15px] text-gray-900 placeholder-gray-400 outline-none"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-gray-400 text-white py-3.5 px-4 rounded-xl font-bold text-[15px] shadow-lg shadow-brand-600/30 hover:shadow-xl hover:shadow-brand-600/40 transform hover:-translate-y-0.5 disabled:transform-none transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Signing In...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm font-medium text-brand-100/60 drop-shadow-sm">
          PLANTIVE — Agricultural Platform &copy; {new Date().getFullYear()}
        </div>
      </div>
    </div>
  )
}

export default Login