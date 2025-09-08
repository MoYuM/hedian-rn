import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, ReactNode, useContext, useEffect, useReducer } from 'react'

// 认证状态类型
interface AuthState {
  token: string | null
  user: { username: string } | null
  isAuthenticated: boolean
  isLoading: boolean
}

// 认证动作类型
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_TOKEN'; payload: string }
  | { type: 'SET_USER'; payload: { username: string } }
  | { type: 'LOGIN'; payload: { token: string; user: { username: string } } }
  | { type: 'LOGOUT' }

// 认证上下文类型
interface AuthContextType extends AuthState {
  setToken: (token: string) => void
  setUser: (user: { username: string }) => void
  login: (token: string, user: { username: string }) => void
  logout: () => void
}

// 初始状态
const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
}

// Reducer 函数
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_TOKEN':
      return { ...state, token: action.payload, isAuthenticated: true }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'LOGIN':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      }
    default:
      return state
  }
}

// 创建上下文
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// 认证提供者组件
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // 从 AsyncStorage 加载认证状态
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const token = await AsyncStorage.getItem('auth-token')
        const userStr = await AsyncStorage.getItem('auth-user')
        
        if (token && userStr) {
          const user = JSON.parse(userStr)
          dispatch({ type: 'LOGIN', payload: { token, user } })
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Failed to load auth state:', error)
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadAuthState()
  }, [])

  // 设置 token
  const setToken = async (token: string) => {
    try {
      await AsyncStorage.setItem('auth-token', token)
      dispatch({ type: 'SET_TOKEN', payload: token })
    } catch (error) {
      console.error('Failed to save token:', error)
    }
  }

  // 设置用户信息
  const setUser = async (user: { username: string }) => {
    try {
      await AsyncStorage.setItem('auth-user', JSON.stringify(user))
      dispatch({ type: 'SET_USER', payload: user })
    } catch (error) {
      console.error('Failed to save user:', error)
    }
  }

  // 登录
  const login = async (token: string, user: { username: string }) => {
    try {
      await AsyncStorage.setItem('auth-token', token)
      await AsyncStorage.setItem('auth-user', JSON.stringify(user))
      dispatch({ type: 'LOGIN', payload: { token, user } })
    } catch (error) {
      console.error('Failed to save auth data:', error)
    }
  }

  // 登出
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('auth-token')
      await AsyncStorage.removeItem('auth-user')
      dispatch({ type: 'LOGOUT' })
    } catch (error) {
      console.error('Failed to clear auth data:', error)
    }
  }

  const value: AuthContextType = {
    ...state,
    setToken,
    setUser,
    login,
    logout,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

// 使用认证上下文的 Hook
export function useAuthStore() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthStore must be used within an AuthProvider')
  }
  return context
}