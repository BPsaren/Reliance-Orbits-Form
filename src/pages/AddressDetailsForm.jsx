import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import axios from "axios";
import './CalendarStyles.css'; // Custom styles for the calendar component
import ExtraStopModal from '../components/ExtraStopModal';
const AddressDetailsForm = () => {
  const navigate = useNavigate();
  const { pickup, setPickup, delivery, setDelivery,extraStops, setExtraStops } = useBooking();
  
  // State for date selection
  const [hasSelectedDate, setHasSelectedDate] = useState(true);
  const [pickupDate, setPickupDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // State for address autocomplete
  const [pickupQuery, setPickupQuery] = useState(pickup.location || '');
  const [deliveryQuery, setDeliveryQuery] = useState(delivery.location || '');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);
  const [pickupTypingTimeout, setPickupTypingTimeout] = useState(null);
  const [deliveryTypingTimeout, setDeliveryTypingTimeout] = useState(null);
  const [focusedPickupIndex, setFocusedPickupIndex] = useState(-1);
  const [focusedDeliveryIndex, setFocusedDeliveryIndex] = useState(-1);
  
  // Track if user is currently selecting from suggestions
  const [pickupSelecting, setPickupSelecting] = useState(false);
  const [deliverySelecting, setDeliverySelecting] = useState(false);
  
  // State for place IDs from Google Places API
  const [pickupPlaceId, setPickupPlaceId] = useState('');
  const [deliveryPlaceId, setDeliveryPlaceId] = useState('');
 //for extraStopmodal
    const [isExtraStopModalOpen, setIsExtraStopModalOpen] = useState(false);
  
  // Form validation errors
  const [errors, setErrors] = useState({
    pickupLocation: false,
    deliveryLocation: false
  });

  // Refs for calendar
  const calendarRef = useRef(null);

  /**
   * Formats date for display (e.g., "21 April 2025")
   * @param {Date} date - The date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date) => {
    if (!date) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  /**
   * Checks if a date is in the past (before today)
   * @param {Date} date - The date to check
   * @returns {boolean} True if the date is in the past
   */
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  /**
   * Handles date selection from calendar, only allowing future dates
   * @param {Date} date - The selected date
   */
  const handleDateChange = (date) => {
    if (!isPastDate(date)) {
      setSelectedDate(date);
      setPickupDate(date);
      setShowCalendar(false);
    }
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

  /**
   * Generates days array for the current month view including previous/next month days
   * @returns {Array} Array of day objects with date and status flags
   */
  const generateDays = () => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    
    // Adjust for Monday as first day of week (0=Sunday in JS)
    const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
    
    const days = [];
    
    // Previous month's days (disabled)
    for (let i = firstDayIndex; i > 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i + 1),
        isCurrentMonth: false,
        isDisabled: true,
        isSelected: false
      });
    }
    
    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(currentYear, currentMonth, i);
      const isPast = isPastDate(dayDate);
      days.push({
        date: dayDate,
        isCurrentMonth: true,
        isDisabled: isPast,
        isSelected: selectedDate && 
          selectedDate.getDate() === i && 
          selectedDate.getMonth() === currentMonth &&
          selectedDate.getFullYear() === currentYear,
        isToday: dayDate.toDateString() === new Date().toDateString()
      });
    }
    
    // Next month's days to complete the grid
    const totalDays = days.length;
    const remainingDays = 42 - totalDays; // 6 weeks x 7 days
    for (let i = 1; i <= remainingDays; i++) {
      const dayDate = new Date(currentYear, currentMonth + 1, i);
      days.push({
        date: dayDate,
        isCurrentMonth: false,
        isDisabled: false,
        isSelected: selectedDate && 
          selectedDate.getDate() === i && 
          selectedDate.getMonth() === currentMonth + 1 &&
          selectedDate.getFullYear() === currentYear
      });
    }
    
    return days;
  };

  /**
   * Handles month navigation
   * @param {number} increment - Number of months to change (+1 or -1)
   */
  const handleMonthChange = (increment) => {
    let newMonth = currentMonth + increment;
    let newYear = currentYear;
    
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    
    // Don't allow navigating to past months
    const currentDate = new Date();
    if (newYear < currentDate.getFullYear() || 
        (newYear === currentDate.getFullYear() && newMonth < currentDate.getMonth())) {
      return;
    }
    
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  // Check if a string contains a UK postal code pattern
  const containsUKPostalCode = (str) => {
    // Regex for UK postal code pattern - this is a basic version
    const ukPostcodeRegex = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/i;
    return ukPostcodeRegex.test(str);
  };

  // Check if a string contains "UK" at the end
  const containsUK = (str) => {
    return str.trim().endsWith("UK") || str.trim().endsWith("UK,");
  };

  // Format the address with postal code and UK
  const formatAddressWithPostcode = (address, postcode) => {
    // Remove any trailing UK if present
    let cleanAddress = address;
    if (containsUK(cleanAddress)) {
      cleanAddress = cleanAddress.replace(/,?\s*UK,?$/, '');
    }
    
    // Add postcode if not already present and format with UK
    if (!containsUKPostalCode(cleanAddress)) {
      return `${cleanAddress} ${postcode}, UK`;
    } else {
      // If it already has a postcode, just ensure it ends with UK
      return containsUK(cleanAddress) ? cleanAddress : `${cleanAddress}, UK`;
    }
  };

  // Pickup location autocomplete
  useEffect(() => {
    // Don't show suggestions when:
    // 1. The query is empty
    // 2. User just selected an item from suggestions
    if (pickupQuery.trim() === '' || pickupSelecting) {
      setPickupSuggestions([]);
      return;
    }

    if (pickupTypingTimeout) clearTimeout(pickupTypingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://orbit-0pxd.onrender.com/autocomplete", {
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
    // Don't show suggestions when:
    // 1. The query is empty
    // 2. User just selected an item from suggestions
    if (deliveryQuery.trim() === '' || deliverySelecting) {
      setDeliverySuggestions([]);
      return;
    }

    if (deliveryTypingTimeout) clearTimeout(deliveryTypingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://orbit-0pxd.onrender.com/autocomplete", {
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

  // Get postal code for pickup address
  useEffect(() => {
    if (!pickupPlaceId) return;
    
    getPostalCode(pickupPlaceId).then((res) => {
      setPickup(prev => {
        const newPickup = { ...prev, postcode: res.data.long_name };
        
        // Format the address properly
        const formattedAddress = formatAddressWithPostcode(prev.location, res.data.long_name);
        
        // Update the query in a way that doesn't trigger suggestions
        setPickupSelecting(true);
        setPickupQuery(formattedAddress);
        setTimeout(() => setPickupSelecting(false), 100);
        
        return { ...newPickup, location: formattedAddress };
      });
    });
  }, [pickupPlaceId]);

  // Get postal code for delivery address
  useEffect(() => {
    if (!deliveryPlaceId) return;
    
    getPostalCode(deliveryPlaceId).then((res) => {
      setDelivery(prev => {
        const newDelivery = { ...prev, postcode: res.data.long_name };
        
        // Format the address properly
        const formattedAddress = formatAddressWithPostcode(prev.location, res.data.long_name);
        
        // Update the query in a way that doesn't trigger suggestions
        setDeliverySelecting(true);
        setDeliveryQuery(formattedAddress);
        setTimeout(() => setDeliverySelecting(false), 100);
        
        return { ...newDelivery, location: formattedAddress };
      });
    });
  }, [deliveryPlaceId]);

  async function getPostalCode(place_id) {
    const response = await axios.get("https://orbit-0pxd.onrender.com/postalcode/" + place_id);
    return response;
  }

  /**
   * Handles pickup suggestion selection
   * @param {Object} suggestion - Selected suggestion object
   */
  const handlePickupSuggestionSelect = (suggestion) => {
    // Mark that we're selecting something, which will prevent suggestions
    setPickupSelecting(true);
    
    setPickupQuery(suggestion.description);
    setPickup({ ...pickup, location: suggestion.description });
    setPickupPlaceId(suggestion.place_id);
    setPickupSuggestions([]);
    setFocusedPickupIndex(-1);
    setErrors(prev => ({ ...prev, pickupLocation: false }));
    
    // Reset the selection flag after a short delay to allow state updates
    setTimeout(() => setPickupSelecting(false), 100);
  };

  /**
   * Handles delivery suggestion selection
   * @param {Object} suggestion - Selected suggestion object
   */
  const handleDeliverySuggestionSelect = (suggestion) => {
    // Mark that we're selecting something, which will prevent suggestions
    setDeliverySelecting(true);
    
    setDeliveryQuery(suggestion.description);
    setDelivery({ ...delivery, location: suggestion.description });
    setDeliveryPlaceId(suggestion.place_id);
    setDeliverySuggestions([]);
    setFocusedDeliveryIndex(-1);
    setErrors(prev => ({ ...prev, deliveryLocation: false }));
    
    // Reset the selection flag after a short delay to allow state updates
    setTimeout(() => setDeliverySelecting(false), 100);
  };

  /**
   * Handles keyboard navigation for pickup suggestions
   * @param {Object} e - Keyboard event
   */
  const handlePickupKeyDown = (e) => {
    if (!pickupSuggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedPickupIndex((prev) => (prev < pickupSuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedPickupIndex((prev) => (prev > 0 ? prev - 1 : pickupSuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const index = focusedPickupIndex >= 0 ? focusedPickupIndex : 0;
      if (pickupSuggestions[index]) {
        handlePickupSuggestionSelect(pickupSuggestions[index]);
      }
    } else if (e.key === 'Escape') {
      setPickupSuggestions([]);
    }
  };

  /**
   * Handles keyboard navigation for delivery suggestions
   * @param {Object} e - Keyboard event
   */
  const handleDeliveryKeyDown = (e) => {
    if (!deliverySuggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedDeliveryIndex((prev) => (prev < deliverySuggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedDeliveryIndex((prev) => (prev > 0 ? prev - 1 : deliverySuggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const index = focusedDeliveryIndex >= 0 ? focusedDeliveryIndex : 0;
      if (deliverySuggestions[index]) {
        handleDeliverySuggestionSelect(deliverySuggestions[index]);
      }
    } else if (e.key === 'Escape') {
      setDeliverySuggestions([]);
    }
  };

  /**
   * Handles manual input change with focus on pickup input field
   */
  const handlePickupInputChange = (e) => {
    setPickupQuery(e.target.value);
    // If the user is typing manually, they're not selecting from suggestions
    setPickupSelecting(false);
    setErrors(prev => ({ ...prev, pickupLocation: false }));
  };

  /**
   * Handles manual input change with focus on delivery input field
   */
  const handleDeliveryInputChange = (e) => {
    setDeliveryQuery(e.target.value);
    // If the user is typing manually, they're not selecting from suggestions
    setDeliverySelecting(false);
    setErrors(prev => ({ ...prev, deliveryLocation: false }));
  };

  /**
   * Handles form submission
   * @param {Object} e - Form submit event
   */
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Where are you moving from and to?" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form Section */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Pickup Details Column */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Pickup Details</h2>

                  {/* Pickup Location Input */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={pickupQuery}
                        onChange={handlePickupInputChange}
                        onKeyDown={handlePickupKeyDown}
                        className={`w-full px-4 py-2 border ${errors.pickupLocation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Enter pickup address"
                      />

                      {/* Pickup Suggestions Dropdown */}
                      {pickupSuggestions.length > 0 && !pickupSelecting && (
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

                      {/* Checkmark for selected pickup location */}
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

                  {/* Pickup Property Type Select */}
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

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Select floor</label>
                    <div className="relative">
                      <select
                        value={pickup.floor}
                        onChange={(e) => setPickup({ ...pickup, floor: e.target.value })}
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
                  
                  {/* Pickup Lift Availability */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pickupLift"
                      checked={pickup.liftAvailable}
                      onChange={(e) => setPickup({ ...pickup, liftAvailable: e.target.checked })}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <label htmlFor="pickupLift" className="ml-2">Lift Available</label>
                  </div>
                </div>

                {/* Delivery Details Column */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Delivery Details</h2>

                  {/* Delivery Location Input */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={deliveryQuery}
                        onChange={handleDeliveryInputChange}
                        onKeyDown={handleDeliveryKeyDown}
                        className={`w-full px-4 py-2 border ${errors.deliveryLocation ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="Enter delivery address"
                      />

                      {/* Delivery Suggestions Dropdown */}
                      {deliverySuggestions.length > 0 && !deliverySelecting && (
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

                      {/* Checkmark for selected delivery location */}
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

                  {/* Delivery Property Type Select */}
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

                  {/* Delivery Floor Select */}
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
                  {/* Pickup Lift Availability */}
                  <div className="flex items-center">
                         <input
                            type="checkbox"
                             id="pickupLift"
                            checked={delivery.liftAvailable}
                            onChange={(e) => setDelivery({ ...delivery, liftAvailable: e.target.checked })}
                            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                            />
                         <label htmlFor="pickupLift" className="ml-2">Lift Available</label>
                     </div>
                </div>
                     
             </div>

              {/* Estimated Move Date Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Estimated Move Date</h2>

                <div className="space-y-4">
                  {/* Date Selection Radio Option */}
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
                            setSelectedDate(pickupDate);
                            setShowCalendar(true);
                          }}
                          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md cursor-pointer"
                        />
                        <span 
                          className="absolute right-3 top-2.5 text-gray-400 cursor-pointer"
                          onClick={() => {
                            setSelectedDate(pickupDate);
                            setShowCalendar(true);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>

                      {/* Availability Confirmation */}
                      <div className="bg-green-50 border border-green-100 rounded-md p-3 mt-4 flex items-start">
                        <span className="text-green-700 mt-0.5 mr-2">👍</span>
                        <p className="text-sm text-green-800">
                          Great! We have availability on {formatDate(pickupDate)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* No Date Selected Option */}
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

              {/* Form Submit Button */}
                           {/* Buttons */}
              <div className="p-6 flex justify-between items-center">
                <button
                      type="button"
                      onClick={() => setIsExtraStopModalOpen(true)}
                      className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                      >
                      Add an extra stop
              </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next Step
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <OrderSummary />
          </div>
        </div>
        < ExtraStopModal
       isOpen={isExtraStopModalOpen}
       onClose={() => setIsExtraStopModalOpen(false)}
       onAddStop={(stop) => setExtraStops([...extraStops, stop])}
        />

        
      </div>

      {/* Custom Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" ref={calendarRef}>
            <div className="mb-4">
              <h3 className="text-lg font-bold text-center">Select a move date</h3>
              
              {/* Month/Year Navigation */}
              <div className="flex justify-between items-center my-4">
                <button 
                  onClick={() => handleMonthChange(-1)}
                  disabled={currentMonth <= new Date().getMonth() && currentYear <= new Date().getFullYear()}
                  className={`p-1 rounded-full ${currentMonth <= new Date().getMonth() && currentYear <= new Date().getFullYear() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="text-lg font-medium">
                  {new Date(currentYear, currentMonth, 1).toLocaleString('en-US', { month: 'long' })} {currentYear}
                </div>
                
                <button 
                  onClick={() => handleMonthChange(1)}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Calendar Grid */}
              <div className="mb-4">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {generateDays().map((day, index) => (
                    <button
                      key={index}
                      onClick={() => !day.isDisabled && handleDateChange(day.date)}
                      className={`h-10 rounded-md flex items-center justify-center text-sm
                        ${day.isDisabled ? 'text-gray-400 cursor-not-allowed' : day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                        ${day.isSelected ? 'bg-blue-100 text-blue-800 font-medium' : ''}
                        ${day.isToday ? 'border border-blue-500' : ''}
                        ${!day.isDisabled && day.isCurrentMonth && !day.isSelected ? 'hover:bg-gray-100' : ''}
                      `}
                      disabled={day.isDisabled}
                    >
                      {day.date.getDate()}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Selected Date Display */}
              {/* {selectedDate && (
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600">Selected: {formatDate(selectedDate)}</p>
                </div>
              )} */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressDetailsForm;