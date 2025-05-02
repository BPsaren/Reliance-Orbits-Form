import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EmailPopup from '../components/EmailPopup';
import './Date.css';

const DateSelection = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const prepath = location.state?.prepath;
    const { selectedDate, setSelectedDate, van, setVan } = useBooking();
    const [value, setValue] = useState(new Date());
    const [calendarPrices, setCalendarPrices] = useState({});
    const [bestPriceDates, setBestPriceDates] = useState([]);
    const [currentView, setCurrentView] = useState(new Date());
    const currentMonth = currentView.toLocaleString('default', { month: 'long' });
    const currentYear = currentView.getFullYear();
    const [selectedMovers, setSelectedMovers] = useState(selectedDate.numberOfMovers || 0);
    const [selectedVanType, setSelectedVanType] = useState(van.type || '');
    const [showEmailPopup, setShowEmailPopup] = useState(true);
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        generatePriceData();
    }, []);

    const handleEmailSubmit = (email) => {
        setUserEmail(email);
        setShowEmailPopup(false);
    };

    const generatePriceData = () => {
        const prices = {};
        const bestPrices = [];
        const today = new Date();

        for (let i = 0; i < 60; i++) {
            const date = new Date();
            date.setDate(today.getDate() + i);
            let price;
            const day = date.getDay();

            if (day === 0 || day === 6) {
                price = 179 + Math.floor(Math.random() * 20);
            } else if (day === 2 || day === 4) {
                price = 139 + Math.floor(Math.random() * 10);
                if (Math.random() > 0.6) {
                    bestPrices.push(date.toDateString());
                }
            } else {
                price = 169 + Math.floor(Math.random() * 10);
            }

            prices[date.toDateString()] = price;
        }

        setCalendarPrices(prices);
        setBestPriceDates(bestPrices);
    };

    const formatSelectedDate = (date) => {
        return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`;
    };

    const handleSelectDate = (date) => {
        setValue(date);
        const formattedDate = formatSelectedDate(date);
        const datePrice = calendarPrices[date.toDateString()] || 169;

        setSelectedDate({
            date: formattedDate,
            price: datePrice,
            numberOfMovers: selectedMovers || 1
        });
    };

    const vanOptions = [
        { type: 'Small', price: 60, emoji: '🚐' },
        { type: 'Medium', price: 70, emoji: '🚚' },
        { type: 'Large', price: 80, emoji: '🚛' },
        { type: 'Luton', price: 90, emoji: '📦' }
    ];

    const handleSelectMovers = (count) => {
        setSelectedMovers(count);
        setSelectedDate({
            ...selectedDate,
            numberOfMovers: count
        });
    };

    const handleSelectVanType = (type) => {
        setSelectedVanType(type);
        setVan({ ...van, type: type });
    };

    const getVanEmoji = (type) => {
        const emojis = {
            'Small': '🚐',
            'Medium': '🚚',
            'Large': '🚛',
            'Luton': '📦'
        };
        return emojis[type] || '🚐';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!van.type || !selectedDate.numberOfMovers) {
            alert("Please select both the van type and number of persons (movers) before continuing.");
            return;
        }
        navigate('/additional-services');
    };

    const tileContent = ({ date, view }) => {
        if (view !== 'month') return null;
        const dateString = date.toDateString();
        const price = calendarPrices[dateString];
        const isBestPrice = bestPriceDates.includes(dateString);

        return (
            <div className="text-center py-1">
                {price && <div className="text-sm font-medium text-gray-700">£{price}</div>}
                {isBestPrice && (
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-1 rounded-sm">
                        Best Price!
                    </div>
                )}
            </div>
        );
    };

    const tileClassName = ({ date, view }) => {
        if (view !== 'month') return '';
        const dateString = date.toDateString();
        const selectedDateString = value.toDateString();
        const isBestPrice = bestPriceDates.includes(dateString);

        if (dateString === selectedDateString) {
            return 'bg-blue-600 text-white rounded-lg';
        } else if (isBestPrice) {
            return 'bg-green-50 rounded-lg';
        }
        return '';
    };

    const handlePrevMonth = () => {
        const newDate = new Date(currentView);
        newDate.setMonth(newDate.getMonth() - 1);
        setCurrentView(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(currentView);
        newDate.setMonth(newDate.getMonth() + 1);
        setCurrentView(newDate);
    };

    const isCurrentMonth = () => {
        const today = new Date();
        return currentView.getMonth() === today.getMonth() && currentView.getFullYear() === today.getFullYear();
    };

    const isDateDisabled = ({ date, view }) => {
        if (view === 'month') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return date < today;
        }
        return false;
    };

    return (
        <>
            {showEmailPopup && <EmailPopup onContinue={handleEmailSubmit} />}
            
            <div className={`bg-gray-50 min-h-screen ${showEmailPopup ? 'blur-sm' : ''}`}>
                <Header title="Select a date" />
                <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
                    Your delivery will be same day
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:gap-8">
                    <div className="md:w-2/3">
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <button
                                    type="button"
                                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${selectedMovers === 1
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                    onClick={() => handleSelectMovers(1)}
                                >
                                    <span className="text-2xl mb-2">👤</span>
                                    <span className="font-medium">1 Person</span>
                                </button>

                                <button
                                    type="button"
                                    className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-all ${selectedMovers === 2
                                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                                        : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
                                        }`}
                                    onClick={() => handleSelectMovers(2)}
                                >
                                    <span className="text-2xl mb-2">👥</span>
                                    <span className="font-medium">2 People</span>
                                </button>
                                
                                <div className="flex flex-col items-center justify-center p-4 border rounded-lg border-gray-300">
                                    <span className="text-2xl mb-2">{getVanEmoji(van.type)}</span>
                                    <select
                                        value={van.type || ''}
                                        onChange={(e) => {
                                            const selectedType = e.target.value;
                                            handleSelectVanType(selectedType);
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-md font-medium text-center"
                                    >
                                        <option value="" disabled>Select Van</option>
                                        {vanOptions.map((option) => (
                                            <option key={option.type} value={option.type}>
                                                {option.emoji} {option.type}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <button
                                        type="button"
                                        className={`p-2 ${isCurrentMonth() ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:text-blue-600'}`}
                                        onClick={!isCurrentMonth() ? handlePrevMonth : undefined}
                                        disabled={isCurrentMonth()}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                                        </svg>
                                    </button>
                                    <div className="text-lg font-semibold">{currentMonth} {currentYear}</div>
                                    <button
                                        type="button"
                                        className="p-2 text-gray-600 hover:text-blue-600"
                                        onClick={handleNextMonth}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="border rounded-lg overflow-hidden calendar-container">
                                    <Calendar
                                        onChange={handleSelectDate}
                                        value={value}
                                        activeStartDate={currentView}
                                        onActiveStartDateChange={({ activeStartDate }) => setCurrentView(activeStartDate)}
                                        tileContent={tileContent}
                                        tileClassName={tileClassName}
                                        showNavigation={false}
                                        minDate={new Date()}
                                        tileDisabled={isDateDisabled}
                                        className="custom-calendar"
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <div className="bg-pink-50 border border-pink-100 rounded-lg p-4 text-center">
                                    <div className="font-medium text-pink-700">You can now pay with Klarna</div>
                                    <div className="text-sm text-pink-600 mt-1">Pay in 3 interest-free installments</div>
                                    <div className="text-xs text-pink-500 mt-1">18+. T&C apply. Credit subject to status.</div>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <button
                                    type="button"
                                    onClick={() => navigate(prepath)}
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
        </>
    );
};

export default DateSelection;