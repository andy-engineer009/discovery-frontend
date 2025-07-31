'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from "@/components/header";
import { Toaster, toast } from 'react-hot-toast';
import { API_ROUTES } from '@/appApi';

const WithdrawListPage = () => {
  const [withdrawals, setWithdrawals]:any = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    try {
      const user = JSON.parse(userData);
      if (user.role_id !== 1) {
        toast.error('Access denied. Admin privileges required.');
        router.push('/dashboard');
        return;
      }
    } catch (error) {
      router.push('/login');
      return;
    }

    fetchWithdrawals();
  }, [router]);

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ROUTES.withdrawList, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.status === 1) {
        setWithdrawals(data.data || []);
      } else {
        toast.error(data.message || 'Failed to fetch withdrawals');
      }
    } catch (error) {
      toast.error('Network error while fetching withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (withdrawalId: number, status: 'approved' | 'rejected') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(API_ROUTES.updateWithdrawalStatus, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          withdrawal_id: withdrawalId,
          status: status
        })
      });

      const data = await response.json();
      if (data.status === 1) {
        toast.success(`Withdrawal ${status == 2 ? 'approved' : 'rejected'} successfully`);
        fetchWithdrawals(); // Refresh the list
      } else {
        toast.error(data.message || `Failed to ${status} withdrawal`);
      }
    } catch (error) {
      toast.error('Network error while updating status');
    }
  };

  const copyUpiId = async (upiId: string) => {
    try {
      await navigator.clipboard.writeText(upiId);
      toast.success('UPI ID copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy UPI ID');
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            <span className="px-2 py-1 text-xs font-medium bg-yellow-500/20 text-yellow-300 rounded-full border border-yellow-500/30">
              Pending
            </span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-300 rounded-full border border-green-500/30">
              Approved
            </span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
              Rejected
            </span>
          </div>
        );
      default:
        return <span className="px-2 py-1 text-xs font-medium bg-gray-500/20 text-gray-300 rounded-full">{status}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading withdrawals...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Withdrawal Requests</h1>
            <p className="text-gray-400 text-sm">
              Manage user withdrawal requests efficiently
            </p>
          </div>

          {withdrawals.length === 0 ? (
            <div className="bg-gray-900 rounded-xl p-8 text-center border border-gray-800">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No withdrawal requests</h3>
              <p className="text-gray-400">There are currently no pending withdrawal requests to process.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {withdrawals.map((withdrawal: any) => (
                <div key={withdrawal.id} className="bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors duration-200 overflow-hidden">
                  {/* Compact Header */}
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-400 font-medium text-sm">
                            {withdrawal.user_id}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-sm truncate max-w-20">
                            {withdrawal.User?.name || 'Unknown'}
                          </h3>
                        </div>
                      </div>
                      {getStatusBadge(withdrawal.status)}
                    </div>
                  </div>

                  {/* Compact Content */}
                  <div className="p-4 space-y-3">
                    {/* Amount */}
                    <div className="text-center py-2 bg-green-500/10 rounded-lg border border-green-500/20">
                      <p className="text-xs text-green-300 mb-1">Amount</p>
                      <div className="text-lg font-bold text-green-400">
                        Rs {withdrawal.withdraw_amount.toFixed(2)}
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Email:</span>
                        <span className="text-gray-300 truncate max-w-24">
                          {withdrawal.User?.email || 'No email'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">UPI ID:</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-300 max-w-20" style={{whiteSpace: 'normal', wordBreak: 'break-word'}}>
                            {withdrawal.upi || 'No UPI'}
                          </span>
                          {withdrawal.upi && (
                            <button
                              onClick={() => copyUpiId(withdrawal.upi)}
                              className="w-4 h-4 text-gray-400 hover:text-blue-400 transition-colors duration-200 flex-shrink-0"
                              title="Copy UPI ID"
                            >
                              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">Date:</span>
                        <span className="text-gray-300">
                          {formatDate(withdrawal.payment_date)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2">
                      {withdrawal.status === 1 ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleStatusUpdate(withdrawal.id, 2)}
                            className="bg-green-500/20 hover:bg-green-500/30 text-green-300 hover:text-green-200 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 border border-green-500/30 hover:border-green-500/50"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(withdrawal.id,3)}
                            className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-200 border border-red-500/30 hover:border-red-500/50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-2">
                          <span className={`text-xs font-medium ${
                            withdrawal.status === 2 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {withdrawal.status === 2 ? '✓ Approved' : '✗ Rejected'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #333',
          },
        }}
      />
    </>
  );
};

export default WithdrawListPage; 