'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// Interfaces for dynamic data
interface Client {
  client_id: string;
  first_name: string;
  last_name: string;
}

interface Lesson {
  lesson_id: string;
  lesson_name: string;
  instructor_name: string;
}

// The shape of the financial entry
interface FinancialEntry {
  client_id: string;
  lesson_id: string;
  amount_paid: number;
  payment_method: string;
  paid: boolean;
}

const AddFinancial: React.FC = () => {
  const router = useRouter();
  const { userRole } = useAuth();

  // State for form fields
  const [clientId, setClientId] = useState<string>('');
  const [lessonId, setLessonId] = useState<string>('');
  const [amountPaid, setAmountPaid] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // State for dynamic dropdowns
  const [clients, setClients] = useState<Client[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  // Error and success state
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch clients and lessons on component mount
  useEffect(() => {
    const fetchClientsAndLessons = async () => {
      try {
        // Fetch clients
        const clientResponse = await fetch('/api/getClients');
        if (!clientResponse.ok) {
          throw new Error('Failed to fetch clients');
        }
        const clientData = await clientResponse.json();
        setClients(clientData);

        // Fetch lessons
        const lessonResponse = await fetch('/api/getLessons');
        if (!lessonResponse.ok) {
          throw new Error('Failed to fetch lessons');
        }
        const lessonData = await lessonResponse.json();
        setLessons(lessonData);

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        setIsLoading(false);
      }
    };

    fetchClientsAndLessons();
  }, []);

  // Validate form before submission
  const validateForm = (): boolean => {
    if (!clientId || !lessonId || !amountPaid || !paymentMethod) {
      setError('All fields are required');
      return false;
    }

    const amount = parseFloat(amountPaid);
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a positive number');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Check user role
    if (userRole !== 'admin') {
      setError('Only administrators can add financial records');
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    // Prepare financial entry
    const financialEntry: FinancialEntry = {
      client_id: clientId,
      lesson_id: lessonId,
      amount_paid: parseFloat(amountPaid),
      payment_method: paymentMethod,
      paid: isPaid
    };

    try {
      // API call to add financial record
      const response = await fetch('/api/addFinancial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(financialEntry),
      });
      router.push('/ViewFinancials');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add financial record');
      }

      // Success handling
      setSuccess('Financial record added successfully');
      
      // Reset form
      setClientId('');
      setLessonId('');
      setAmountPaid('');
      setPaymentMethod('');
      setIsPaid(false);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Add Financial Record</h1>
          </div>
          <p className="text-white/80 mt-2">Record financial transactions for clients</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}
          
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
              {success}
            </div>
          )}

          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              id="clientId"
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.client_id} value={client.client_id}>
                  {`${client.first_name} ${client.last_name}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="lessonId" className="block text-sm font-medium text-gray-700 mb-1">
              Lesson
            </label>
            <select
              id="lessonId"
              value={lessonId}
              onChange={(e) => setLessonId(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
            >
              <option value="">Select Lesson</option>
              {lessons.map((lesson) => (
                <option key={lesson.lesson_id} value={lesson.lesson_id}>
                  {`${lesson.lesson_name} (${lesson.instructor_name})`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amountPaid" className="block text-sm font-medium text-gray-700 mb-1">
              Amount Paid
            </label>
            <input
              type="number"
              id="amountPaid"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              step="0.01"
              min="0"
              placeholder="Enter Amount"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
            />
          </div>

          <div>
            <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              id="paymentMethod"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition"
            >
              <option value="">Select Payment Method</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPaid"
              checked={isPaid}
              onChange={(e) => setIsPaid(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPaid" className="ml-2 block text-sm text-gray-900">
              Payment Completed
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white font-bold rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            Add Financial Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddFinancial;