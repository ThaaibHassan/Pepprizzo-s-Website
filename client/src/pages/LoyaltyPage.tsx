import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface LoyaltyData {
  points: number;
  tier: string;
  transactions: LoyaltyTransaction[];
  rewards: Reward[];
}

interface LoyaltyTransaction {
  id: number;
  type: 'earned' | 'redeemed';
  points: number;
  description: string;
  created_at: string;
}

interface Reward {
  id: number;
  name: string;
  description: string;
  points_required: number;
  is_available: boolean;
}

const LoyaltyPage: React.FC = () => {
  const { data: loyaltyData, isLoading } = useQuery<LoyaltyData>({
    queryKey: ['loyalty'],
    queryFn: () => api.get('/loyalty').then(res => res.data)
  });

  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return 'bg-amber-100 text-amber-800';
      case 'silver':
        return 'bg-gray-100 text-gray-800';
      case 'gold':
        return 'bg-yellow-100 text-yellow-800';
      case 'platinum':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Loyalty Program</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!loyaltyData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Loyalty Program</h1>
          <div className="text-center py-12">
            <p className="text-gray-600">Unable to load loyalty information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Loyalty Program</h1>
        
        {/* Points Summary */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg shadow-sm p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Points</h2>
              <p className="text-red-100">Earn points with every order!</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{loyaltyData.points}</div>
              <div className="text-red-100">points</div>
            </div>
          </div>
          
          <div className="mt-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(loyaltyData.tier)}`}>
              {loyaltyData.tier} Tier
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Rewards */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Rewards</h2>
            
            {loyaltyData.rewards.length === 0 ? (
              <p className="text-gray-600">No rewards available at the moment.</p>
            ) : (
              <div className="space-y-4">
                {loyaltyData.rewards.map((reward) => (
                  <div key={reward.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{reward.name}</h3>
                      <span className="text-sm font-medium text-gray-600">
                        {reward.points_required} points
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                    <button
                      disabled={!reward.is_available || loyaltyData.points < reward.points_required}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        reward.is_available && loyaltyData.points >= reward.points_required
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {reward.is_available && loyaltyData.points >= reward.points_required
                        ? 'Redeem Reward'
                        : 'Not Enough Points'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transaction History */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Transaction History</h2>
            
            {loyaltyData.transactions.length === 0 ? (
              <p className="text-gray-600">No transactions yet. Start ordering to earn points!</p>
            ) : (
              <div className="space-y-3">
                {loyaltyData.transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`text-right ${
                      transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <span className="font-medium">
                        {transaction.type === 'earned' ? '+' : '-'}{transaction.points}
                      </span>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Order & Earn</h3>
              <p className="text-sm text-gray-600">
                Earn 1 point for every $1 spent on your orders
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Accumulate Points</h3>
              <p className="text-sm text-gray-600">
                Build up your points balance with each order
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <span className="text-red-600 font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Redeem Rewards</h3>
              <p className="text-sm text-gray-600">
                Use your points to get discounts and free items
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;
