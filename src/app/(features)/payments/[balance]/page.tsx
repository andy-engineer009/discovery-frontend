'use client';

import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Header from "@/components/header";
import { Toaster, toast } from 'react-hot-toast';
import { useParams, useRouter } from 'next/navigation';
import { API_ROUTES } from '@/appApi';

// Mock data - replace with actual API calls
const mockUserData = {
  balance: 1000, // Total balance in Rs
  userBalance: 100 // Number of user balances (1 user = 10 Rs)
};

export default function PaymentPage() {
  const params = useParams();
  const balanceParam = params.balance as string;
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance]: any = useState(balanceParam);

  // Validation schema
const WithdrawalSchema = Yup.object().shape({
  withdraw_amount: Yup.number()
    .required('Withdrawal amount is required')
    .min(1000, 'Minimum withdrawal amount is 1000 Rs')
    .max(balance, 'Cannot withdraw more than your balance')
    .test('multiple-of-1000', 'Amount must be in multiples of 1000', (value) => {
      return value ? value % 1000 === 0 : false;
    }),
  upi: Yup.string()
    .required('UPI ID is required')
    .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/, 'Please enter a valid UPI ID'),
});


  const handleSubmit = async (values: { withdraw_amount: number; upi: string }, { resetForm }: any) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      // Fetch a POST API with token from localStorage
      const token = localStorage.getItem('token');
      const response = await fetch(API_ROUTES.withdraw, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          withdraw_amount: values.withdraw_amount,
          upi: values.upi,
        }),
      });

      const responseData = await response.json();
      if (responseData.status != 1) {
        toast.error(responseData.message);
        return
      }
      
      toast.success(responseData.message);
      resetForm();
      setSelectedAmount(100);
    } catch (error) {
      toast.error('Withdrawal request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#ffffff',
            border: '1px solid #333',
          },
        }}
      />
      
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Withdraw Funds</h1>
          <p className="text-gray-400">Request withdrawal to your UPI account</p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl p-6 mb-8 shadow-xl border border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Available Balance</p>
              <p className="text-4xl font-bold text-white mt-2">
                ₹{balance.toLocaleString()}
              </p>
      
            </div>
            <div className="bg-green-500/20 p-4 rounded-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        {/* Withdrawal Form */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-6">Withdrawal Request</h2>
          
          <Formik
            initialValues={{ withdraw_amount: 100, upi: '' }}
            validationSchema={WithdrawalSchema}
            onSubmit={handleSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="space-y-6">
                {/* Withdrawal Amount Section */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-4">
                    Select Withdrawal Amount
                  </label>
                  
       

                  {/* Custom Amount Input */}
                  <div>
                    <Field
                      type="number"
                      name="withdraw_amount"
                      placeholder="Enter custom amount (multiples of 100)"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      onChange={(e: any) => {
                        const value = parseInt(e.target.value);
                        setFieldValue('withdraw_amount', value);
                        setSelectedAmount(value);
                      }}
                    />
                    <ErrorMessage name="withdraw_amount" component="div" className="text-red-400 text-sm mt-1" />
                  </div>

                </div>

                {/* UPI ID Input */}
                <div>
                  <label htmlFor="upiId" className="block text-sm font-medium text-gray-300 mb-2">
                    UPI ID
                  </label>
                  <Field
                    type="text"
                    id="upi"
                    name="upi"
                    placeholder="example@upi"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <ErrorMessage name="upi" component="div" className="text-red-400 text-sm mt-1" />
                  <p className="text-gray-500 text-sm mt-1">Enter your UPI ID to receive the payment</p>
                </div>

                {/* Withdrawal Rules */}
                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                  <h3 className="text-blue-300 font-medium mb-2">Withdrawal Rules:</h3>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Minimum withdrawal amount: ₹1000</li>
                    <li>• Amount must be in multiples of ₹1000</li>
                    <li>• Processing time: 2 hours</li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Withdrawal...
                    </div>
                  ) : (
                    'Submit Withdrawal Request'
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
