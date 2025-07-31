'use client';

import { useState, useEffect } from 'react';
import Header from "@/components/header";
import { Toaster, toast } from 'react-hot-toast';
import { API_ROUTES } from '@/appApi';
import { useRouter } from 'next/navigation';

// Mock data - replace with actual API calls
const mockUserData = {
  name: "John Doe",
  referralCode: "DISCOVERY2024",
  totalUsers: 1250,
  balance: 2847.50,
  withdrawnAmount: 1250.00
};

const DashboardPage = () => {
  const [copied, setCopied] = useState(false);
  const [userData, setUserData]:any = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ROUTES.getdashboardData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    console.log(data)
    if(data.status == 1) {
      setUserData(data.data);
    }else {
      toast.error(data.message);
    }
  }

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(userData?.referral_code);
      setCopied(true);
      toast.success('Referral code copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy referral code');
    }
  };

  return (
    <div className="min-h-screen bg-black">
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
      
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {userData?.name}
            </span>!
          </h1>
          <p className="text-gray-400">Here's your dashboard overview</p>
        </div>

        {/* Referral Code Section */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-semibold text-white mb-2">Your Unique Referral Code</h2>
              <p className="text-gray-400 text-sm">Share this code with friends to earn rewards</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-800 px-4 py-3 rounded-lg border border-gray-700">
                <span className="text-2xl font-mono font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                  {userData?.referral_code}
                </span>
              </div>
              <button
                onClick={copyReferralCode}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  copied 
                    ? 'bg-green-600 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {copied ? (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Copied!
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users Card */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 shadow-xl border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Current Balance</p>
                <p className="text-3xl font-bold text-white mt-2">
                  RS {userData?.total_amount?.toLocaleString()}
                </p>
                {/* <p className="text-blue-200 text-sm mt-1">+12% from last month</p> */}
                <button
                  className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                  onClick={() => {
                    // Redirect to withdraw page or open modal
                    // Example: router.push(`/payments/${userData?.total_amount}`);
                    router.push(`/payments/${userData?.total_amount}`);

                  }}
                >
                  Withdraw Amount
                </button>
              </div>
              <div className="bg-blue-500/20 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Balance Card */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 shadow-xl border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Withdraw balance</p>
                <p className="text-3xl font-bold text-white mt-2">
                  RS {userData?.total_withdraw_amount?.toLocaleString()}
                </p>
                {/* <p className="text-green-200 text-sm mt-1">+$245 this week</p> */}
              </div>
              <div className="bg-green-500/20 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Withdrawn Amount Card */}
          {/* <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl p-6 shadow-xl border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Withdrawn</p>
                <p className="text-3xl font-bold text-white mt-2">
                  ${userData?.withdrawn_amount?.toLocaleString()}
                </p>
                <p className="text-purple-200 text-sm mt-1">+$180 this month</p>
              </div>
              <div className="bg-purple-500/20 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
            </div>
          </div> */}
        </div>

        {/* Quick Actions */}
        {/* <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Funds
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Withdraw
            </button>
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Reports
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default DashboardPage;