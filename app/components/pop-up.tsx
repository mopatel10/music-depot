import React, { useState, useEffect } from "react";

export default function DemoModePopup() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Show popup after a short delay when page loads
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => {
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden transform transition-all">
                {/* Header with music note accent */}
                <div className="bg-gradient-to-r from-blue-500 to-pink-500 p-4 flex items-center">
                    <div className="bg-white rounded-full p-2 mr-3">
                        <span className="text-2xl">🎵</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">The Music Depot</h3>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <h4 className="text-lg font-medium text-gray-900 mb-2">Demo Mode Active</h4>
                        <p className="text-gray-600">
                            This is a demonstration version of The Music Depot's scheduling system. This demo:
                        </p>
                        <ul className="mt-2 space-y-1 text-gray-600 list-disc list-inside">
                            <li>Is not connected to any database</li>
                            <li>Does not fetch data from APIs</li>
                            <li>Is for demonstration purposes only</li>
                        </ul>
                        <p className="mt-3 text-gray-600">
                            The actual application helps music instructors manage lesson scheduling and finances efficiently.
                        </p>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        <div className="text-sm text-gray-500">
                            <span className="inline-block align-middle mr-1">💡</span> Try any username/password
                        </div>
                        <button
                            onClick={closePopup}
                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-pink-500 text-white font-medium rounded-md hover:from-pink-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}