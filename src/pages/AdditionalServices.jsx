import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import axios from 'axios';

// Helper function for consistent time format conversion
const hourToTime = (hour) => {
  // If the hour is already in HH:MM:SS format, return it as is
  if (typeof hour === 'string' && hour.includes(':')) {
    return hour;
  }

  // Handle possible NaN or undefined values
  if (hour === undefined || isNaN(hour)) {
    return '08:00:00'; // Default fallback time
  }

  // Convert number to time string (e.g., 8.5 -> "08:30:00")
  const hrs = Math.floor(hour).toString().padStart(2, '0');
  const mins = (hour % 1 === 0.5) ? '30' : '00';
  return `${hrs}:${mins}:00`;
};

const AdditionalServices = () => {
  const navigate = useNavigate();
  const {
    customerDetails,
    pickup,
    delivery,
    selectedDate,
    setSelectedDate,
    journey,
    totalPrice,
    items,
    motorBike,
    piano,
    quoteRef,
    setQuoteRef,
    van,
    extraStops,
    itemsToAssemble,
    itemsToDismantle,
    setItemsToAssemble,
    setItemsToDismantle,
    additionalServices,
    setAdditionalServices,
    quoteDetails,
  } = useBooking();

  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [collectionTime, setCollectionTime] = useState({ start: 8, end: 18 });
  const [deliveryTime, setDeliveryTime] = useState('Same day');
  const [showAssemblyOptions, setShowAssemblyOptions] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize time values from context on component mount
  useEffect(() => {
    // Time conversion from string to decimal for slider display
    const convertTimeToDecimal = (timeStr) => {
      if (typeof timeStr !== 'string' || !timeStr.includes(':')) return null;

      const parts = timeStr.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      return hours + (minutes === 30 ? 0.5 : 0);
    };

    // Check if there are time values in the context
    if (selectedDate.pickupTime && selectedDate.dropTime) {
      // Convert string times to decimal for sliders if needed
      const pickupTimeDecimal = typeof selectedDate.pickupTime === 'string' && selectedDate.pickupTime.includes(':')
        ? convertTimeToDecimal(selectedDate.pickupTime)
        : selectedDate.pickupTime;

      const dropTimeDecimal = typeof selectedDate.dropTime === 'string' && selectedDate.dropTime.includes(':')
        ? convertTimeToDecimal(selectedDate.dropTime)
        : selectedDate.dropTime;

      setCollectionTime({
        start: pickupTimeDecimal || 8,
        end: dropTimeDecimal || 18
      });
    } else {
      // Use default values and update context with proper string format
      setCollectionTime({ start: 8, end: 18 });
      setSelectedDate(prev => ({
        ...prev,
        pickupTime: hourToTime(8),
        dropTime: hourToTime(18)
      }));
    }
  }, [selectedDate.pickupTime, selectedDate.dropTime, setSelectedDate]);

  // Format the date for display
  const formatDisplayDate = (date) => {
    if (!date) return 'Select date';
    try {
      const dateObj = new Date(date);
      if (isNaN(dateObj.getTime())) return 'Invalid date';
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      return dateObj.toLocaleDateString('en-GB', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  // Format time in 12-hour format with 30-minute increments (e.g. 8 -> "8:00am", 8.5 -> "8:30am")
  const formatTimeWithMinutes = (time) => {
    const hour = Math.floor(time);
    const minute = time % 1 === 0.5 ? 30 : 0;
    let period = 'am';
    let displayHour = hour;

    if (hour >= 12) {
      period = 'pm';
      if (hour > 12) {
        displayHour = hour - 12;
      }
    }

    if (hour === 0) {
      displayHour = 12; // midnight
    }

    return `${displayHour}:${minute === 0 ? '00' : minute}${period}`;
  };

  const validateExtraStops = (stops) => {
    if (!Array.isArray(stops) || stops.length === 0) return [];

    return stops.map(stop => ({
      ...stop,
      // Ensure doorNumber exists and is a string
      doorNumber: stop.doorNumber || stop.doorFlatNo || '',
      // Ensure lift exists and is a boolean
      lift: typeof stop.lift === 'boolean' ? stop.lift : Boolean(stop.liftAvailable),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setIsSubmitting(true); // Start loading animation

    try {

      const validatedStops = validateExtraStops(extraStops);

      // Create quoteData - no need to convert times again
      const quoteData = {
        username: customerDetails.name || 'NA',
        email: quoteDetails.email || 'NA',
        phoneNumber: customerDetails.phone || 'NA',
        price: totalPrice || 0,
        distance: parseInt(journey.distance) || 0,
        route: "default route",
        duration: journey.duration || "N/A",
        pickupDate: selectedDate.date || 'NA',
        pickupTime: selectedDate.pickupTime || '08:00:00', // Already in correct format
        pickupAddress: {
          postcode: pickup.postcode,
          addressLine1: pickup.addressLine1,
          addressLine2: pickup.addressLine2,
          city: pickup.city,
          country: pickup.country,
          contactName: pickup.contactName,
          contactPhone: pickup.contactPhone,
        },
        dropDate: selectedDate.date || 'NA',
        dropTime: selectedDate.dropTime || '18:00:00', // Already in correct format
        dropAddress: {
          postcode: delivery.postcode,
          addressLine1: delivery.addressLine1,
          addressLine2: delivery.addressLine2,
          city: delivery.city,
          country: delivery.country,
          contactName: delivery.contactName,
          contactPhone: delivery.contactPhone,
        },
        vanType: van.type || "N/A",
        worker: selectedDate.numberOfMovers || 1,
        itemsToDismantle: itemsToDismantle || 0,
        itemsToAssemble: itemsToAssemble || 0,
        stoppage: validatedStops,
        pickupLocation: {
          location: pickup.location || "N/A",
          floor: typeof pickup.floor === 'string' ? parseInt(pickup.floor) : pickup.floor,
          lift: pickup.liftAvailable,
          propertyType: pickup.propertyType || "standard"
        },
        dropLocation: {
          location: delivery.location || "N/A",
          floor: typeof delivery.floor === 'string' ? parseInt(delivery.floor) : delivery.floor,
          lift: delivery.liftAvailable,
          propertyType: delivery.propertyType || "standard"
        },
        details: {
          items: {
            name: items.map(item => item.name) || [],
            quantity: items.map(item => item.quantity) || [],
          },
          isBusinessCustomer: customerDetails.isBusinessCustomer,
          motorBike: motorBike.type,
          piano: piano.type,
          specialRequirements: additionalServices.specialRequirements
        },
      };

      console.log("Quotation Data being sent:", JSON.stringify(quoteData, null, 2));

      // 🔁 First: POST to /quote and get quotationRef
      const quoteResponse = await axios.post('https://api.reliancemove.com/quote', quoteData);
      const quotationRef = quoteResponse.data?.newQuote?.quotationRef;
      console.log("quotation reference: ", quotationRef);

      if (!quotationRef) {
        throw new Error("Quotation reference not received from server");
      }

      setQuoteRef(quotationRef);
      navigate('/booking-details');
    } catch (error) {
      console.error('Error submitting booking:', error);

      // Set appropriate error message based on the error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server error: ${error.response.data?.message || error.response.statusText || 'Unknown server error'}`);
        console.error('Error response data:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        setError('Network error: No response received from server. Please check your internet connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error: ${error.message || 'An unknown error occurred'}`);
      }
    } finally {
      setIsSubmitting(false); // Stop loading animation regardless of outcome
    }
  };

  const handleAddServices = () => {
    console.log('Items to assemble:', itemsToAssemble);
    console.log('Items to dismantle:', itemsToDismantle);
    setShowAssemblyOptions(false);
  };

  const handleTimeSlotChange = () => {
    setShowTimeSlotModal(true);
  };

  const handleCollectionTimeChange = (e, type) => {
    const value = parseFloat(e.target.value);
    const timeString = hourToTime(value); // Convert to time string immediately

    if (type === 'start') {
      setCollectionTime(prev => ({ ...prev, start: value }));
      // Store the formatted time string in context
      setSelectedDate(prev => ({ ...prev, pickupTime: timeString }));
    } else {
      setCollectionTime(prev => ({ ...prev, end: value }));
      // Store the formatted time string in context
      setSelectedDate(prev => ({ ...prev, dropTime: timeString }));
    }
  };

  const handleResetTimeSlots = () => {
    // Reset the local state
    setCollectionTime({ start: 8, end: 18 });

    // Update the context with properly formatted time strings
    setSelectedDate(prev => ({
      ...prev,
      pickupTime: hourToTime(8),
      dropTime: hourToTime(18)
    }));
  };

  const handleConfirmTimeSlot = () => {
    setShowTimeSlotModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* <Header title="Additional Services and Special Requirements" /> */}

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
              {/* Header with gradient */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h2 className="text-2xl font-bold flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                  Additional Services
                </h2>
                <p className="text-blue-100 mt-1">Customize your move with extra services and special requirements</p>
              </div>

              <div className="p-6">
                {/* Display error message if there is an error */}
                {error && (
                  <div className="bg-red-50/80 backdrop-blur-sm border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center" role="alert">
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <strong className="font-bold">Error: </strong>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* Collection & Delivery Section */}
                <div className="bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <h3 className="text-lg font-semibold text-gray-800">Collection & Delivery</h3>
                    </div>
                    <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {selectedDate.date ? formatDisplayDate(selectedDate.date) : 'No date selected'}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl mb-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-800 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Between {formatTimeWithMinutes(collectionTime.start)} - {formatTimeWithMinutes(collectionTime.end)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1 flex items-center">
                          <svg className="w-4 h-4 mr-1 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                          {deliveryTime} delivery
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleTimeSlotChange}
                        className="px-4 py-2 text-sm text-blue-600 font-medium border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
                      >
                        Change Time Slot
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 bg-amber-50 p-3 rounded-lg border border-amber-200 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-amber-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Live driver tracking and your time slots will be sent the day before your move
                  </div>
                </div>

                {/* Assembly Options */}
                <div className="bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Dismantling & Reassembly</h3>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl mb-4 border border-purple-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="font-semibold text-lg text-purple-700">£20</span>
                        </div>
                        <div className="text-gray-600 text-sm">per item, to dismantle</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                          <span className="font-semibold text-lg text-purple-700">£30</span>
                        </div>
                        <div className="text-gray-600 text-sm">per item, to assemble</div>
                      </div>
                    </div>
                  </div>

                  {showAssemblyOptions ? (
                    <div className="space-y-4 bg-gray-50/50 p-4 rounded-xl border border-gray-200">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <span className="font-medium text-gray-700">Items to dismantle: £20 per item</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setItemsToDismantle(Math.max(0, itemsToDismantle - 1));
                            }}
                            className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center font-semibold">{itemsToDismantle}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setItemsToDismantle(itemsToDismantle + 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <span className="font-medium text-gray-700">Items to assemble: £30 per item</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setItemsToAssemble(Math.max(0, itemsToAssemble - 1));
                            }}
                            className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                          </button>
                          <span className="w-8 text-center font-semibold">{itemsToAssemble}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setItemsToAssemble(itemsToAssemble + 1);
                            }}
                            className="w-8 h-8 flex items-center justify-center border-2 border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-4 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAssemblyOptions(false)}
                          className="px-6 py-2 text-sm text-gray-600 font-medium border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleAddServices}
                          className="px-6 py-2 text-sm text-white font-medium bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
                        >
                          Confirm Services
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setShowLearnMoreModal(true)}
                        className="px-6 py-3 text-sm text-blue-600 font-medium border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200"
                      >
                        Learn More
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAssemblyOptions(true)}
                        className="px-6 py-3 text-sm text-white font-medium bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-lg"
                      >
                        Add to Your Move
                      </button>
                    </div>
                  )}
                </div>

                {/* Special Requirements */}
                <div className="bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-gray-800">Special Requirements or Notes</h3>
                  </div>

                  <div className="relative">
                    <textarea
                      placeholder="E.g. Parking available opposite property, sofa comes apart, slightly awkward entrance etc. The more information, the better! Please note: you will receive tracking prior to arrival"
                      value={additionalServices.specialRequirements}
                      onChange={(e) => setAdditionalServices({
                        ...additionalServices,
                        specialRequirements: e.target.value
                      })}
                      className="w-full p-4 border-2 border-gray-200 rounded-xl h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white/50 backdrop-blur-sm resize-none"
                    />
                    <div className="absolute bottom-3 right-3 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => navigate('/date')}
                    className="flex items-center space-x-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                    disabled={isSubmitting}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                    </svg>
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl font-medium shadow-lg transition-all duration-200 min-w-[150px] justify-center ${
                      isSubmitting 
                        ? 'opacity-80 cursor-not-allowed' 
                        : 'hover:from-blue-700 hover:to-indigo-800 hover:shadow-xl transform hover:-translate-y-0.5'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>Next Step</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          <div className="lg:w-1/3">
            <OrderSummary />
          </div>
        </div>
      </div>


      {/* Time Slot Modal */}
{showTimeSlotModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 max-w-lg w-full overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Choose Time Slot
            </h3>
            <p className="text-blue-100 text-sm">Select your preferred time</p>
          </div>
          <button
            onClick={() => setShowTimeSlotModal(false)}
            className="text-blue-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <div className="mb-3 text-center">
            <div className="text-base font-medium text-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 px-3 py-2 rounded-lg border border-blue-100">
              {selectedDate.date ? formatDisplayDate(selectedDate.date) : 'No date selected'}
            </div>
          </div>

          <div className="mb-4">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-xs font-medium text-green-800 mb-1">Collection</div>
                <div className="text-green-700 font-semibold text-sm">
                  {formatTimeWithMinutes(collectionTime.start)} - {formatTimeWithMinutes(collectionTime.end)}
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-xs font-medium text-red-800 mb-1">Delivery</div>
                <div className="text-red-700 font-semibold text-sm">
                  {deliveryTime}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-medium text-gray-700">Start: {formatTimeWithMinutes(collectionTime.start)}</span>
                  <span className="text-xs font-medium text-gray-700">End: {formatTimeWithMinutes(collectionTime.end)}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Start time</label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="0.5"
                      value={collectionTime.start}
                      onChange={(e) => handleCollectionTimeChange(e, 'start')}
                      className="w-full h-3 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(collectionTime.start / 24) * 100}%, #e5e7eb ${(collectionTime.start / 24) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">End time</label>
                    <input
                      type="range"
                      min="0"
                      max="24"
                      step="0.5"
                      value={collectionTime.end}
                      onChange={(e) => handleCollectionTimeChange(e, 'end')}
                      className="w-full h-3 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(collectionTime.end / 24) * 100}%, #e5e7eb ${(collectionTime.end / 24) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-xs text-gray-600 px-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium">12am</span>
                  <div className="w-8 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-[3px] bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                  <span className="font-medium">12pm</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-4">
            <button
              type="button"
              onClick={handleResetTimeSlots}
              className="flex items-center space-x-2 px-3 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all duration-200 font-medium group text-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset to default</span>
            </button>
          </div>
        </div>

        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-xs text-blue-800">
              Live driver tracking and your time slots will be sent the day before your move
            </div>
          </div>
        </div> */}

        <div className="flex justify-end">
          <button
            onClick={handleConfirmTimeSlot}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm"
          >
            <span>Confirm Time Slot</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{showLearnMoreModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-white/20 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
              <div className="relative flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Dismantle & Assemble</h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowLearnMoreModal(false)}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all duration-200"
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-4">
              {/* Main description */}
              <div className="text-center mb-4">
                <p className="text-gray-700 leading-relaxed">
                  We can take apart your large items at pickup and reassemble them back at delivery
                </p>
              </div>

              {/* Service pricing */}
              <div className="bg-gray-50 p-4 rounded-xl mb-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Dismantling service</span>
                    <span className="font-semibold text-lg">£20 per item</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Assembly service</span>
                    <span className="font-semibold text-lg">£30 per item</span>
                  </div>
                </div>
              </div>

              {/* Additional info */}
              <div className="text-sm text-gray-600 mb-4">
                Our professional movers will carefully dismantle your furniture at the pickup location and reassemble it at your new home, saving you time and ensuring everything is properly set up.
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowLearnMoreModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setShowLearnMoreModal(false);
                    setShowAssemblyOptions(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add to your move
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalServices;