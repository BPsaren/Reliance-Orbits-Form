import React, { useState } from 'react';

const EmailPopup = ({ onContinue }) => {
    const [email, setEmail] = useState('');
    const [checkedItems, setCheckedItems] = useState({
        prices: true,
        booking: true,
        aboutUs: true
    });

    const handleCheckboxChange = (item) => {
        setCheckedItems(prev => ({
            ...prev,
            [item]: !prev[item]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email) {
            onContinue(email);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4 border border-gray-300"> {/* Added border here */}
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
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md mb-4"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700"
                    >
                        View Prices Now
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EmailPopup;