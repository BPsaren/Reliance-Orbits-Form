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
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className={`
                bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4 border border-gray-300
                transition-all duration-300 ease-out
                ${isVisible ? 
                    'opacity-100 scale-100' : 
                    'opacity-0 scale-95'
                }
                transform-gpu
            `}>
                <h2 className="text-2xl font-bold text-center mb-4">RELIANCE</h2>
                <p className="text-center mb-6">Please enter email for instant prices</p>
                
                <div className="mb-6">
                    <h3 className="font-medium mb-2">Our Email includes:</h3>
                    <div className="space-y-2">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={checkedItems.prices}
                                onChange={() => handleCheckboxChange('prices')}
                                className="mr-2"
                            />
                            Guaranteed Lowest Prices!
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={checkedItems.booking}
                                onChange={() => handleCheckboxChange('booking')}
                                className="mr-2"
                            />
                            Easy Booking Link
                        </label>
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={checkedItems.aboutUs}
                                onChange={() => handleCheckboxChange('aboutUs')}
                                className="mr-2"
                            />
                            Important Bits About Us!
                        </label>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mb-4">
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError(''); // Clear error when user types
                        }}
                        className={`w-full p-3 border rounded-md mb-2 ${
                            error ? 'border-red-500' : 'border-gray-300'
                        }`}
                        required
                        disabled={isLoading}
                    />
                    
                    {error && (
                        <div className="text-red-500 text-sm mb-4 text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-md font-medium transition-colors ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        } text-white`}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Validating...
                            </div>
                        ) : (
                            'View Prices Now'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmailPopup;