'use client';
import React, { useState, useEffect } from 'react';

function Financials() {
  const [financials, setFinancials] = useState([
    {
      client_name: 'John Doe',
      lesson_name: 'Beginner Piano',
      payment_method: 'Credit Card',
      amount: 150.00,
      paid: true,
    },
    {
      client_name: 'Jane Smith',
      lesson_name: 'Intermediate Guitar',
      payment_method: 'PayPal',
      amount: 200.00,
      paid: false,
    },

  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-300 to-purple-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-gray-700 text-center">
            Loading financial data...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-300 to-purple-600 flex items-center justify-center">
        <div className="bg-red-50 p-8 border border-red-200 rounded-lg shadow-xl">
          <h2 className="text-xl font-semibold text-red-600 text-center">
            Error: {error}
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden ">
        <div className="px-6 py-4 bg-gray-50 border-b bg-gradient-to-r from-blue-300 to-purple-600">
          <h2 className="text-xl font-semibold text-gray-800 ">Financial Overview</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lesson Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount Paid
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {financials.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No financial records found
                  </td>
                </tr>
              ) : (
                financials.map((financial, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {financial.client_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {financial.lesson_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {financial.payment_method}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${financial.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${financial.paid
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {financial.paid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Financials;
