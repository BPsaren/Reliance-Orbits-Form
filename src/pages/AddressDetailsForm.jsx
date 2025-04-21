import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import axios from "axios";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CalendarStyles.css'; // Custom styles for the calendar component

const AddressDetailsForm = () => {
  const navigate = useNavigate();
  const { pickup, setPickup, delivery, setDelivery } = useBooking();
  const [hasSelectedDate, setHasSelectedDate] = useState(true);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [pickupQuery, setPickupQuery] = useState(pickup.location || '');
  const [deliveryQuery, setDeliveryQuery] = useState(delivery.location || '');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);
  const [pickupTypingTimeout, setPickupTypingTimeout] = useState(null);
  const [deliveryTypingTimeout, setDeliveryTypingTimeout] = useState(null);
  const [focusedPickupIndex, setFocusedPickupIndex] = useState(-1);
  const [focusedDeliveryIndex, setFocusedDeliveryIndex] = useState(-1);
  const [errors, setErrors] = useState({
    pickupLocation: false,
    deliveryLocation: false
  });
  const [selectedDate, setSelectedDate] = useState(null); // Track selected date separately

  const pickupSelectedRef = useRef(false);
  const deliverySelectedRef = useRef(false);
  const calendarRef = useRef(null);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  // Handle date selection from calendar
  const handleDateChange = (date) => {
    setSelectedDate(date); // Store the selected date
  };

  // Confirm date selection when "Select Date" button is clicked
  const confirmDateSelection = () => {
    if (selectedDate) {
      setPickupDate(selectedDate);
    }
    setShowCalendar(false);
  };

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Pickup location autocomplete
  useEffect(() => {
    if (pickupQuery.trim() === '' || pickupSelectedRef.current) {
      setPickupSuggestions([]);
      pickupSelectedRef.current = false;
      return;
    }

    if (pickupTypingTimeout) clearTimeout(pickupTypingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://reliance-orbit.onrender.com/autocomplete", {
        place: pickupQuery
      })
        .then(res => {
          setPickupSuggestions(res.data.predictions || []);
          setFocusedPickupIndex(-1);
        })
        .catch(() => {
          setPickupSuggestions([]);
        });
    }, 500);

    setPickupTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [pickupQuery]);

  // Delivery location autocomplete
  useEffect(() => {
    if (deliveryQuery.trim() === '' || deliverySelectedRef.current) {
      setDeliverySuggestions([]);
      deliverySelectedRef.current = false;
      return;
    }

    if (deliveryTypingTimeout) clearTimeout(deliveryTypingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://reliance-orbit.onrender.com/autocomplete", {
        place: deliveryQuery
      })
        .then(res => {
          setDeliverySuggestions(res.data.predictions || []);
          setFocusedDeliveryIndex(-1);
        })
        .catch(err => {
          console.error('Delivery autocomplete error:', err);
          setDeliverySuggestions([]);
        });
    }, 500);

    setDeliveryTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [deliveryQuery]);

  // Handle pickup suggestion selection
  const handlePickupSuggestionSelect = (suggestion) => {
    pickupSelectedRef.current = true;
    setPickupQuery(suggestion.description);
    setPickup({ ...pickup, location: suggestion.description });
    setPickupSuggestions([]);
    setFocusedPickupIndex(-1);
    setErrors(prev => ({ ...prev, pickupLocation: false }));
  };

  // Handle delivery suggestion selection
  const handleDeliverySuggestionSelect = (suggestion) => {
    deliverySelectedRef.current = true;
    setDeliveryQuery(suggestion.description);
    setDelivery({ ...delivery, location: suggestion.description });
    setDeliverySuggestions([]);
    setFocusedDeliveryIndex(-1);
    setErrors(prev => ({ ...prev, deliveryLocation: false }));
  };

  // Handle keyboard navigation for pickup suggestions
  const handlePickupKeyDown = (e) => {
    if (pickupSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedPickupIndex(prev =>
        prev < pickupSuggestions.length - 1 ? prev + 1 : 0
      );
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedPickupIndex(prev =>
        prev > 0 ? prev - 1 : pickupSuggestions.length - 1
      );
    }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedPickupIndex >= 0) {
        handlePickupSuggestionSelect(pickupSuggestions[focusedPickupIndex]);
      } else if (pickupSuggestions.length > 0) {
        handlePickupSuggestionSelect(pickupSuggestions[0]);
      }
    }
    else if (e.key === 'Escape') {
      setPickupSuggestions([]);
      setFocusedPickupIndex(-1);
    }
  };

  // Handle keyboard navigation for delivery suggestions
  const handleDeliveryKeyDown = (e) => {
    if (deliverySuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedDeliveryIndex(prev =>
        prev < deliverySuggestions.length - 1 ? prev + 1 : 0
      );
    }
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedDeliveryIndex(prev =>
        prev > 0 ? prev - 1 : deliverySuggestions.length - 1
      );
    }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedDeliveryIndex >= 0) {
        handleDeliverySuggestionSelect(deliverySuggestions[focusedDeliveryIndex]);
      } else if (deliverySuggestions.length > 0) {
        handleDeliverySuggestionSelect(deliverySuggestions[0]);
      }
    }
    else if (e.key === 'Escape') {
      setDeliverySuggestions([]);
      setFocusedDeliveryIndex(-1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate location form
    const newErrors = {
      pickupLocation: !pickupQuery.trim(),
      deliveryLocation: !deliveryQuery.trim()
    };
    
    setErrors(newErrors);
    
    if (newErrors.pickupLocation || newErrors.deliveryLocation) {
      return;
    }
    
    navigate('/items-home');
  };

  // Handle month/year change from dropdowns
  const handleMonthYearChange = (newDate) => {
    setPickupDate(newDate);
    setSelectedDate(newDate); // Keep the selected date in sync
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Where are you moving from and to?" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Pickup Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Pickup Details</h2>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={pickupQuery}
                        onChange={(e) => {
                          setPickupQuery(e.target.value);
                          setErrors(prev => ({ ...prev, pickupLocation: false }));
                        }}
                        onKeyDown={handlePickupKeyDown}
                        className={`w-full px-4 py-2 border ${errors.pickupLocation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Enter pickup address"
                      />

                      {pickupSuggestions.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
                          {pickupSuggestions.map((suggestion, idx) => (
                            <li
                              key={idx}
                              onClick={() => handlePickupSuggestionSelect(suggestion)}
                              className={`px-4 py-2 cursor-pointer ${idx === focusedPickupIndex ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            >
                              {suggestion.description}
                            </li>
                          ))}
                        </ul>
                      )}

                      {pickup.location && (
                        <span className="absolute right-3 top-2.5 text-green-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    {errors.pickupLocation && (
                      <p className="mt-1 text-sm text-red-600">Please enter your pickup location</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Select property type</label>
                    <div className="relative">
                      <select
                        value={pickup.propertyType || '2 Bed House'}
                        onChange={(e) => setPickup({ ...pickup, propertyType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none"
                      >
                        <option value="Studio">Studio</option>
                        <option value="1 Bed Flat">1 Bed Flat</option>
                        <option value="2 Bed Flat">2 Bed Flat</option>
                        <option value="1 Bed House">1 Bed House</option>
                        <option value="2 Bed House">2 Bed House</option>
                        <option value="3 Bed House">3 Bed House</option>
                        <option value="4+ Bed House">4+ Bed House</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Delivery Details</h2>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={deliveryQuery}
                        onChange={(e) => {
                          setDeliveryQuery(e.target.value);
                          setErrors(prev => ({ ...prev, deliveryLocation: false }));
                        }}
                        onKeyDown={handleDeliveryKeyDown}
                        className={`w-full px-4 py-2 border ${errors.deliveryLocation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Enter delivery address"
                      />

                      {deliverySuggestions.length > 0 && (
                        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
                          {deliverySuggestions.map((suggestion, idx) => (
                            <li
                              key={idx}
                              onClick={() => handleDeliverySuggestionSelect(suggestion)}
                              className={`px-4 py-2 cursor-pointer ${idx === focusedDeliveryIndex ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            >
                              {suggestion.description}
                            </li>
                          ))}
                        </ul>
                      )}

                      {delivery.location && (
                        <span className="absolute right-3 top-2.5 text-green-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                    {errors.deliveryLocation && (
                      <p className="mt-1 text-sm text-red-600">Please enter your delivery location</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Select property type</label>
                    <div className="relative">
                      <select
                        value={delivery.propertyType || '3 Bed Flat'}
                        onChange={(e) => setDelivery({ ...delivery, propertyType: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none"
                      >
                        <option value="Studio">Studio</option>
                        <option value="1 Bed Flat">1 Bed Flat</option>
                        <option value="2 Bed Flat">2 Bed Flat</option>
                        <option value="3 Bed Flat">3 Bed Flat</option>
                        <option value="1 Bed House">1 Bed House</option>
                        <option value="2 Bed House">2 Bed House</option>
                        <option value="3 Bed House">3 Bed House</option>
                        <option value="4+ Bed House">4+ Bed House</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Select floor</label>
                    <div className="relative">
                      <select
                        value={delivery.floor}
                        onChange={(e) => setDelivery({ ...delivery, floor: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none"
                      >
                        <option value="Ground floor">Ground floor</option>
                        <option value="1st floor">1st floor</option>
                        <option value="2nd floor">2nd floor</option>
                        <option value="3rd floor">3rd floor</option>
                        <option value="4th floor">4th floor</option>
                        <option value="5th floor +">5th floor +</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Estimated Move Date */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Estimated Move Date</h2>

                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="hasDate"
                      name="dateOption"
                      checked={hasSelectedDate}
                      onChange={() => setHasSelectedDate(true)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="hasDate" className="ml-2 block text-sm font-medium text-gray-700">
                      Select a move date
                    </label>
                  </div>

                  {hasSelectedDate && (
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Pickup date</label>
                      <div className="relative">
                        <input
                          type="text"
                          readOnly
                          value={formatDate(pickupDate)}
                          onClick={() => {
                            setSelectedDate(pickupDate); // Initialize with current pickup date
                            setShowCalendar(true);
                          }}
                          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <span 
                          className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                          onClick={() => {
                            setSelectedDate(pickupDate); // Initialize with current pickup date
                            setShowCalendar(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>

                      <div className="bg-green-50 border border-green-100 rounded-md p-3 mt-4 flex items-start">
                        <span className="text-green-700 mt-0.5 mr-2">👍</span>
                        <p className="text-sm text-green-800">
                          Great! We have availability on {formatDate(pickupDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="noDate"
                      name="dateOption"
                      checked={!hasSelectedDate}
                      onChange={() => setHasSelectedDate(false)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="noDate" className="ml-2 block text-sm font-medium text-gray-700">
                      I don't have a move date yet
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Next Step
                </button>
              </div>
            </form>
          </div>

          <div className="lg:w-1/3">
            <OrderSummary />
          </div>
        </div>
      </div>

      {/* Enhanced Calendar Modal - Styled to match reference image */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-4 max-w-md w-full" ref={calendarRef}>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate || pickupDate} // Use selectedDate if available, otherwise fallback to pickupDate
              minDate={new Date()}
              className="border-0 w-full"
              view="month"
              showNavigation={true}
              prevLabel={<span className="text-gray-600">‹</span>}
              nextLabel={<span className="text-gray-600">›</span>}
              next2Label={null} // Hide double arrows
              prev2Label={null} // Hide double arrows
              key={`${(selectedDate || pickupDate).getMonth()}-${(selectedDate || pickupDate).getFullYear()}`} // Force re-render when month/year changes
              formatShortWeekday={(locale, date) => 
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][date.getDay()]
              }
              navigationLabel={({ date, locale }) => (
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <select
                    value={date.getMonth()}
                    onChange={(e) => {
                      const newDate = new Date(date);
                      newDate.setMonth(parseInt(e.target.value));
                      handleMonthYearChange(newDate);
                    }}
                    className="border rounded px-2 py-1 text-sm font-medium"
                  >
                    {[...Array(12).keys()].map((month) => (
                      <option key={month} value={month}>
                        {new Date(date.getFullYear(), month, 1).toLocaleString(locale, { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select
                    value={date.getFullYear()}
                    onChange={(e) => {
                      const newDate = new Date(date);
                      newDate.setFullYear(parseInt(e.target.value));
                      handleMonthYearChange(newDate);
                    }}
                    className="border rounded px-2 py-1 text-sm font-medium"
                  >
                    {[...Array(10).keys()].map((yearOffset) => {
                      const year = new Date().getFullYear() + yearOffset;
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            />
            <div className="mt-4 flex justify-center">
              <button
                onClick={confirmDateSelection}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Select Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressDetailsForm;