import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  created_at: string;
  estimated_delivery?: string;
  delivery_address?: string;
  items: OrderItem[];
}

interface OrderItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

const OrderTrackingPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  const { data: order, isLoading, error } = useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => api.get(`/orders/${orderId}`).then(res => res.data),
    enabled: !!orderId,
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  const getStatusStep = (status: string) => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: '📋' },
      { key: 'preparing', label: 'Preparing', icon: '👨‍🍳' },
      { key: 'ready', label: 'Ready', icon: '✅' },
      { key: 'delivered', label: 'Delivered', icon: '🚚' }
    ];
    
    const currentIndex = steps.findIndex(step => step.key === status.toLowerCase());
    return { steps, currentIndex: Math.max(0, currentIndex) };
  };

  const getEstimatedTime = () => {
    if (!order?.created_at) return null;
    
    const created = new Date(order.created_at);
    const estimated = new Date(created.getTime() + 45 * 60000); // 45 minutes from order time
    return estimated;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600">The order you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const { steps, currentIndex } = getStatusStep(order.status);
  const estimatedDelivery = getEstimatedTime();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString()} at{' '}
                {new Date(order.created_at).toLocaleTimeString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">${order.total_amount.toFixed(2)}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                order.status === 'ready' ? 'bg-blue-100 text-blue-800' :
                order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Order Progress</h2>
          <div className="relative">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center mb-8 last:mb-0">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                  index <= currentIndex 
                    ? 'bg-red-600 border-red-600 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }`}>
                  <span className="text-lg">{step.icon}</span>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className={`font-medium ${
                    index <= currentIndex ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {step.label}
                  </h3>
                  {index <= currentIndex && (
                    <p className="text-sm text-gray-600">
                      {index === currentIndex ? 'In progress...' : 'Completed'}
                    </p>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-0.5 h-8 ml-6 ${
                    index < currentIndex ? 'bg-red-600' : 'bg-gray-300'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Items */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h2>
            
            {order.delivery_address && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Delivery Address</h3>
                <p className="text-gray-600">{order.delivery_address}</p>
              </div>
            )}

            {estimatedDelivery && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Estimated Delivery</h3>
                <p className="text-gray-600">
                  {estimatedDelivery.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {Math.max(0, Math.ceil((estimatedDelivery.getTime() - currentTime.getTime()) / 60000))} minutes remaining
                </p>
              </div>
            )}

            <div>
              <h3 className="font-medium text-gray-900 mb-2">Current Status</h3>
              <p className="text-gray-600 capitalize">{order.status}</p>
              {order.status === 'preparing' && (
                <p className="text-sm text-gray-500 mt-1">
                  Our chefs are working hard to prepare your order!
                </p>
              )}
              {order.status === 'ready' && (
                <p className="text-sm text-gray-500 mt-1">
                  Your order is ready for pickup or delivery!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Real-time Updates Note */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-blue-800">
              This page updates automatically every 30 seconds. You'll see real-time updates as your order progresses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
