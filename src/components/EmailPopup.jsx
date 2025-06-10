import React, { useState, useEffect } from 'react';
import { useBooking } from '../context/BookingContext';

const EmailPopup = ({ onContinue }) => {
    const [email, setEmail] = useState('');
    const [checkedItems, setCheckedItems] = useState({
        prices: true,
        booking: true,
        aboutUs: true
    });
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const {quoteDetails, setQuoteDetails} = useBooking();

    useEffect(() => {
        // Trigger the animation when component mounts
        setIsVisible(true);
    }, []);

    const handleCheckboxChange = (item) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const validateEmail = async (emailToValidate) => {
        try {
            const response = await fetch('https://api.reliancemove.com/user/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: emailToValidate
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };
        } catch (error) {
            console.error('Email validation error:', error);
            return { success: false, error: error.message };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setError('Please enter an email address');
            return;
        }

        setIsLoading(true);
        setError('');

        const validationResult = await validateEmail(email);

        if (validationResult.success) {
            // Email is valid, proceed
            setQuoteDetails({...quoteDetails, email: email});
            setIsVisible(false);
            setTimeout(() => onContinue(email), 300); // Match the animation duration
        } else {
            // Email validation failed
            setError('Invalid email address. Please check and try again.');
        }

        setIsLoading(false);
    };

return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
        <div className={`
            bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl max-w-md w-full mx-4 border border-white/20 overflow-hidden
            transition-all duration-300 ease-out
            ${isVisible ? 
                'opacity-100 scale-100' : 
                'opacity-0 scale-95'
            }
            transform-gpu
        `}>
            {/* Header with gradient matching LocationForm */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h2 className="text-2xl font-bold text-center flex items-center justify-center">
                    <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    RELIANCE
                </h2>
                <p className="text-blue-100 mt-1 text-center">Please enter email for instant prices</p>
            </div>

            <div className="p-6">
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Our Email includes:
                    </h3>
                    <div className="space-y-3">
                        <label className="flex items-center p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={checkedItems.prices}
                                onChange={() => handleCheckboxChange('prices')}
                                className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 mr-3"
                            />
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Guaranteed Lowest Prices!</span>
                            </div>
                        </label>
                        <label className="flex items-center p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={checkedItems.booking}
                                onChange={() => handleCheckboxChange('booking')}
                                className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 mr-3"
                            />
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Easy Booking Link</span>
                            </div>
                        </label>
                        <label className="flex items-center p-3 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={checkedItems.aboutUs}
                                onChange={() => handleCheckboxChange('aboutUs')}
                                className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 mr-3"
                            />
                            <div className="flex items-center">
                                <svg className="w-4 h-4 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Important Bits About Us!</span>
                            </div>
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError(''); // Clear error when user types
                                }}
                                className={`w-full px-4 py-3 border-2 rounded-xl transition-all duration-200 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-200 ${
                                    error ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                }`}
                                required
                                disabled={isLoading}
                            />
                            <div className="absolute right-3 top-3 text-gray-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        
                        {error && (
                            <div className="text-red-500 text-sm flex items-center justify-center bg-red-50 p-2 rounded-lg">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed text-white' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white'
                        }`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Validating...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center space-x-2">
                                <span>View Prices Now</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        )}
                    </button>
                </form>
            </div>
        </div>
    </div>
);
};

export default EmailPopup;