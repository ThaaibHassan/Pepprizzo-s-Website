import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance for production
export const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://peprizzos-backend.onrender.com/api'  // Production backend URL
    : 'http://localhost:5001/api', // Local development backend URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth-storage')
    if (token) {
      try {
        const authData = JSON.parse(token)
        if (authData.state?.token) {
          config.headers.Authorization = `Bearer ${authData.state.token}`
        }
      } catch (error) {
        console.error('Error parsing auth token:', error)
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const { response } = error

    // Handle different error scenarios
    if (response) {
      const { status, data } = response

      switch (status) {
        case 401:
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem('auth-storage')
          window.location.href = '/login'
          toast.error('Session expired. Please login again.')
          break
        case 403:
          toast.error('Access denied. You do not have permission to perform this action.')
          break
        case 404:
          toast.error('Resource not found.')
          break
        case 422:
          // Validation errors
          if (data?.details) {
            data.details.forEach((detail: any) => {
              toast.error(detail.msg || 'Validation error')
            })
          } else {
            toast.error(data?.error || 'Validation error')
          }
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(data?.error || 'An error occurred')
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.')
    } else {
      // Other error
      toast.error('An unexpected error occurred')
    }

    return Promise.reject(error)
  }
)

// API endpoints
export const endpoints = {
  // Auth
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
    profile: '/auth/profile',
    changePassword: '/auth/change-password',
  },

  // Menu
  menu: {
    list: '/menu',
    categories: '/menu/categories',
    featured: '/menu/featured',
    search: '/menu/search',
    filters: '/menu/filters',
    item: (id: string) => `/menu/${id}`,
    category: (id: string) => `/menu/category/${id}`,
  },

  // Orders
  orders: {
    create: '/orders',
    list: '/orders',
    details: (id: string) => `/orders/${id}`,
    updateStatus: (id: string) => `/orders/${id}/status`,
    cancel: (id: string) => `/orders/${id}/cancel`,
  },

  // Users
  users: {
    addresses: '/users/addresses',
    addAddress: '/users/addresses',
    updateAddress: (id: string) => `/users/addresses/${id}`,
    deleteAddress: (id: string) => `/users/addresses/${id}`,
    orders: '/users/orders',
  },

  // Loyalty
  loyalty: {
    points: '/loyalty/points',
    transactions: '/loyalty/transactions',
    earn: '/loyalty/earn',
    redeem: '/loyalty/redeem',
    rewards: '/loyalty/rewards',
    redeemReward: (id: string) => `/loyalty/rewards/${id}/redeem`,
  },

  // Payments
  payments: {
    createIntent: '/payments/create-payment-intent',
    confirm: '/payments/confirm-payment',
    methods: '/payments/methods',
    refund: '/payments/refund',
  },

  // Admin
  admin: {
    dashboard: '/admin/dashboard',
    orders: '/admin/orders',
    orderDetails: (id: string) => `/admin/orders/${id}`,
    updateOrderStatus: (id: string) => `/admin/orders/${id}/status`,
    menu: '/admin/menu',
    addMenuItem: '/admin/menu',
    updateMenuItem: (id: string) => `/admin/menu/${id}`,
    deleteMenuItem: (id: string) => `/admin/menu/${id}`,
    customers: '/admin/customers',
  },
}

// API helper functions
export const apiHelpers = {
  // Generic GET request
  get: async (url: string, params?: any) => {
    const response = await api.get(url, { params })
    return response.data
  },

  // Generic POST request
  post: async (url: string, data?: any) => {
    const response = await api.post(url, data)
    return response.data
  },

  // Generic PUT request
  put: async (url: string, data?: any) => {
    const response = await api.put(url, data)
    return response.data
  },

  // Generic DELETE request
  delete: async (url: string) => {
    const response = await api.delete(url)
    return response.data
  },

  // Upload file
  upload: async (url: string, file: File, onProgress?: (progress: number) => void) => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })

    return response.data
  },
}

export default api
