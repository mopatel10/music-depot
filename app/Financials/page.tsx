import React from "react";


function Financials() {
  const payments = [
    { client: "John Doe", amount: "$150", paid: true },
    { client: "Jane Smith", amount: "$200", paid: false },
  ];


  return (

    <div className="bg-white p-5 rounded-lg shadow-md max-w-lg mx-auto mt-5 text-center">
      <h3 className="text-blue-500 mb-4 text-lg font-semibold">Financial Overview</h3>
      <div className="flex flex-col gap-4">
        {payments.map((payment, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm text-left">
            <h5 className="text-gray-800 font-medium">{payment.client}</h5>
            <p className="text-sm text-gray-700">Amount: {payment.amount}</p>
            <p className={`text-sm font-bold ${payment.paid ? 'text-green-500' : 'text-red-500'}`}>
              Status: {payment.paid ? "Paid" : "Pending"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Financials;
