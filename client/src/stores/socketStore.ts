import { create } from 'zustand'
import { io, Socket } from 'socket.io-client'

interface SocketState {
  socket: Socket | null
  isConnected: boolean
  orderUpdates: Record<string, any>
}

interface SocketActions {
  initializeSocket: () => void
  disconnectSocket: () => void
  joinOrderRoom: (orderId: string) => void
  leaveOrderRoom: (orderId: string) => void
  updateOrderStatus: (orderId: string, status: any) => void
}

type SocketStore = SocketState & SocketActions

export const useSocketStore = create<SocketStore>((set, get) => ({
  // State
  socket: null,
  isConnected: false,
  orderUpdates: {},

  // Actions
  initializeSocket: () => {
    const { socket } = get()
    
    // Don't initialize if already connected
    if (socket?.connected) return

    // DISABLED FOR DEMO - no socket connection
    console.log('Socket connection disabled for demo');
    return;

    // Create new socket connection
    const newSocket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
    })

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
      set({ isConnected: true })
    })

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected')
      set({ isConnected: false })
    })

    newSocket.on('order-update', (data) => {
      const { orderUpdates } = get()
      set({
        orderUpdates: {
          ...orderUpdates,
          [data.order_id]: data,
        },
      })
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      set({ isConnected: false })
    })

    set({ socket: newSocket })
  },

  disconnectSocket: () => {
    const { socket } = get()
    if (socket) {
      socket.disconnect()
      set({ socket: null, isConnected: false, orderUpdates: {} })
    }
  },

  joinOrderRoom: (orderId: string) => {
    const { socket } = get()
    if (socket?.connected) {
      socket.emit('join-order', orderId)
      console.log('Joined order room:', orderId)
    }
  },

  leaveOrderRoom: (orderId: string) => {
    const { socket } = get()
    if (socket?.connected) {
      socket.emit('leave-order', orderId)
      console.log('Left order room:', orderId)
    }
  },

  updateOrderStatus: (orderId: string, status: any) => {
    const { orderUpdates } = get()
    set({
      orderUpdates: {
        ...orderUpdates,
        [orderId]: status,
      },
    })
  },
}))

// Helper hook to get order updates
export const useOrderUpdate = (orderId: string) => {
  const { orderUpdates, joinOrderRoom, leaveOrderRoom } = useSocketStore()
  
  return {
    orderUpdate: orderUpdates[orderId] || null,
    joinOrderRoom: () => joinOrderRoom(orderId),
    leaveOrderRoom: () => leaveOrderRoom(orderId),
  }
}
