import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';

const DateSelection = () => {
    const navigate = useNavigate();
    const { selectedDate, setSelectedDate } = useBooking();

    const calendar = [
        // Week 1
        [
            { day: 'Mon', date: 7, price: 169 },
            { day: 'Tue', date: 8, price: 139, active: true },
            { day: 'Wed', date: 9, price: 169 },
            { day: 'Thu', date: 10, price: 139 },
            { day: 'Fri', date: 11, price: 169 },
            { day: 'Sat', date: 12, price: 179 },
            { day: 'Sun', date: 13, price: 179 }
        ],
        // Week 2
        [
            { day: 'Mon', date: 14, price: 169 },
            { day: 'Tue', date: 15, price: 139 },
            { day: 'Wed', date: 16, price: 169 },
            { day: 'Thu', date: 17, price: 139 },
            { day: 'Fri', date: 18, price: 179, selected: true },
            { day: 'Sat', date: 19, price: 189 },
            { day: 'Sun', date: 20, price: 189 }
        ],
        // Week 3
        [
            { day: 'Mon', date: 21, price: 179 },
            { day: 'Tue', date: 22, price: 139 },
            { day: 'Wed', date: 23, price: 169 },
            { day: 'Thu', date: 24, price: 139 },
            { day: 'Fri', date: 25, price: 169 },
            { day: 'Sat', date: 26, price: 179 },
            { day: 'Sun', date: 27, price: 179 }
        ],
        // Week 4
        [
            { day: 'Mon', date: 28, price: 169 },
            { day: 'Tue', date: 29, price: 139 },
            { day: 'Wed', date: 30, price: 169 },
            { day: 'Thu', date: 1, price: 139 },
            { day: 'Fri', date: 2, price: 169 },
            { day: 'Sat', date: 3, price: 179 },
            { day: 'Sun', date: 4, price: 179 }
        ],
        // Week 5
        [
            { day: 'Mon', date: 5, price: 169 },
            { day: 'Tue', date: 6, price: 139 },
            { day: 'Wed', date: 7, price: 169 },
            { day: 'Thu', date: 8, price: 169 },
            { day: 'Fri', date: 9, price: 169 },
            { day: 'Sat', date: 10, price: 179 },
            { day: 'Sun', date: 11, price: 179 }
        ]
    ];

    const handleSelectDate = (day, date, price) => {
        setSelectedDate({
            date: `${date} Apr`,
            price: price,
            numberOfMovers: selectedDate.numberOfMovers
        });
    };

    const handleSelectMovers = (count, price) => {
        setSelectedDate({
            ...selectedDate,
            numberOfMovers: count,
            price: price
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/additional-services');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <Header title="Select a date" />
            <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
                Your delivery will be same day
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:gap-8">
                <div className="md:w-2/3">
                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
                        {/* Movers Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <button
                                type="button"
                                className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${selectedDate.numberOfMovers === 1
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                                onClick={() => handleSelectMovers(1, 139)}
                            >
                                <span className="text-2xl mb-2">👤</span>
                                <span className="font-medium">1 Person</span>
                                <div className="mt-2 text-lg font-semibold">£139</div>
                            </button>

                            <button
                                type="button"
                                className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${selectedDate.numberOfMovers === 2
                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                    : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                    }`}
                                onClick={() => handleSelectMovers(2, 189)}
                            >
                                <span className="text-2xl mb-2">👥</span>
                                <span className="font-medium">2 People</span>
                                <div className="mt-2 text-lg font-semibold">£189</div>
                            </button>
                        </div>

                        {/* Calendar */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <button type="button" className="p-2 text-gray-600 hover:text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                    </svg>
                                </button>
                                <div className="text-lg font-semibold">April 2025</div>
                                <button type="button" className="p-2 text-gray-600 hover:text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </button>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                                <div className="grid grid-cols-7 bg-gray-100 text-center text-sm font-medium text-gray-700">
                                    <div className="py-2">Mon</div>
                                    <div className="py-2">Tue</div>
                                    <div className="py-2">Wed</div>
                                    <div className="py-2">Thu</div>
                                    <div className="py-2">Fri</div>
                                    <div className="py-2">Sat</div>
                                    <div className="py-2">Sun</div>
                                </div>

                                {calendar.map((week, weekIndex) => (
                                    <div key={weekIndex} className="grid grid-cols-7 border-t border-gray-200">
                                        {week.map((day, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                className={`relative p-2 cursor-pointer border-r border-b ${dayIndex === 6 ? '' : 'border-r' // No right border on last column
                                                    } ${selectedDate?.date === `${day.date} Apr`
                                                        ? 'bg-blue-600 text-white'
                                                        : day.active
                                                            ? 'bg-green-50'
                                                            : 'hover:bg-blue-50'
                                                    }`}
                                                onClick={() => handleSelectDate(day.day, day.date, day.price)}
                                            >
                                                <div className="text-center py-3">
                                                    <div className={`text-lg ${selectedDate?.date === `${day.date} Apr` ? 'text-white' : ''}`}>{day.date}</div>
                                                    <div className={`text-sm font-medium ${selectedDate?.date === `${day.date} Apr` ? 'text-white' : 'text-gray-700'}`}>£{day.price}</div>

                                                    {day.active && (
                                                        <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded-sm">
                                                            Best Price!
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Klarna Info */}
                        <div className="mb-8">
                            <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-center">
                                <div className="font-medium text-pink-700">You can now pay with Klarna</div>
                                <div className="text-sm text-pink-600 mt-1">Pay in 3 interest-free installments</div>
                                <div className="text-xs text-pink-500 mt-1">18+. T&C apply. Credit subject to status.</div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => navigate('/items')}
                                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                            >
                                Edit Job Info
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
                            >
                                Next Step
                            </button>
                        </div>
                    </form>
                </div>

                <div className="md:w-1/3">
                    <OrderSummary />
                </div>
            </div>
        </div>
    );
};

export default DateSelection;