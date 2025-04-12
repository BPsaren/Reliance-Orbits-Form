import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';

const PianoLocationForm = () => {
    const navigate = useNavigate();
    const { pickup, setPickup, delivery, setDelivery, piano, setPiano } = useBooking();

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/date');
    };

    const pianoTypes = [
        "Upright Piano",
        "Baby Grand Piano",
        "Grand Piano",
        "Digital Piano",
        "Electric Piano",
        "Console Piano"
    ];

    const floorOptions = [
        "Ground floor",
        "1st floor",
        "2nd floor",
        "3rd floor",
        "4th floor",
        "5th floor +"
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header title="Where are you moving from and to?" />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <div className="mb-4">
                                    <select
                                        value={piano?.type || ""}
                                        onChange={(e) => setPiano({ ...piano, type: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="" disabled>Please Select Your Piano Type</option>
                                        {pianoTypes.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-700 mb-4">Pickup Details</h2>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={pickup.location}
                                        onChange={(e) => setPickup({ ...pickup, location: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Postcode or Address"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm mb-2">Floor</label>
                                    <select
                                        value={pickup.floor}
                                        onChange={(e) => setPickup({ ...pickup, floor: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {floorOptions.map((floor) => (
                                            <option key={floor} value={floor}>
                                                {floor}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-700 mb-4">Delivery Details</h2>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm mb-2">Location</label>
                                    <input
                                        type="text"
                                        value={delivery.location}
                                        onChange={(e) => setDelivery({ ...delivery, location: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Enter Postcode or Address"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-500 text-sm mb-2">Floor</label>
                                    <select
                                        value={delivery.floor}
                                        onChange={(e) => setDelivery({ ...delivery, floor: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        {floorOptions.map((floor) => (
                                            <option key={floor} value={floor}>
                                                {floor}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => navigate('/')}
                                    className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center"
                                >
                                    <span className="mr-1">←</span> Back
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 font-medium flex items-center"
                                >
                                    Next Step <span className="ml-1">→</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <OrderSummary />
                </div>
            </div>
        </div>
    );
};

export default PianoLocationForm;