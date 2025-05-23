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
  const [collectionTime, setCollectionTime] = useState({ start: 8, end: 18 });
  const [deliveryTime, setDeliveryTime] = useState('Same day');
  const [showAssemblyOptions, setShowAssemblyOptions] = useState(false);
  const [error, setError] = useState('');
  const [dismantleCount, setDismantleCount] = useState(itemsToDismantle || 0);
  const [assemblyCount, setAssemblyCount] = useState(itemsToAssemble || 0);
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

    setDismantleCount(itemsToDismantle);
    setAssemblyCount(itemsToAssemble);
  }, [itemsToDismantle, itemsToAssemble, selectedDate.pickupTime, selectedDate.dropTime, setSelectedDate]);

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
      const quoteResponse = await axios.post('https://orbit-0pxd.onrender.com/quote', quoteData);
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
    setItemsToDismantle(dismantleCount);
    setItemsToAssemble(assemblyCount);
    console.log(itemsToAssemble);
    console.log(itemsToDismantle);
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
    <div className="bg-gray-50 min-h-screen">
      <Header title="Additional Services and Special Requirements" />


      <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:gap-8">
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Display error message if there is an error */}
            {error && (
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {/* Collection & Delivery Section */}
            <div className="border rounded-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Collection & delivery</h3>
                <span className="text-sm text-gray-500">
                  {selectedDate.date ? formatDisplayDate(selectedDate.date) : 'No date selected'}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                <div>
                  <div className="font-medium">Between {formatTimeWithMinutes(collectionTime.start)} - {formatTimeWithMinutes(collectionTime.end)}</div>
                  <div className="text-sm text-gray-600">{deliveryTime} delivery</div>
                </div>
                <button
                  type="button"
                  onClick={handleTimeSlotChange}
                  className="px-4 py-2 text-sm text-blue-600 font-medium border border-blue-600 rounded-md hover:bg-blue-50"
                >
                  Change your time slot
                </button>
              </div>

              <div className="text-sm text-gray-600">
                Live driver tracking and your time slots will be sent the day before your move
              </div>
            </div>

            {/* Assembly Options */}
            <div className="border rounded-lg p-6 mb-8">
              <div className="mb-3">
                <h3 className="text-lg font-semibold">Dismantling & reassembly</h3>
              </div>

              <div className="text-gray-600 mb-4">
                Dismantling and assembly can be arranged per item. Just tell us how many items require this service and we'll do the rest!
              </div>

              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-lg">£20</div>
                  <div className="text-gray-600">per item, to dismantle</div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="font-semibold text-lg">£30</div>
                  <div className="text-gray-600">per item, to assemble</div>
                </div>
              </div>

              {showAssemblyOptions ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Items to dismantle: £20 per item</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setDismantleCount(Math.max(0, dismantleCount - 1));
                        }}
                        className="px-3 py-1 border rounded-md hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span>{dismantleCount}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setDismantleCount(dismantleCount + 1);
                        }}
                        className="px-3 py-1 border rounded-md hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Items to assemble: £30 per item</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setAssemblyCount(Math.max(0, assemblyCount - 1));
                        }}
                        className="px-3 py-1 border rounded-md hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span>{assemblyCount}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setAssemblyCount(assemblyCount + 1);
                        }}
                        className="px-3 py-1 border rounded-md hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAssemblyOptions(false)}
                      className="px-4 py-2 text-sm text-blue-600 font-medium border border-blue-600 rounded-md hover:bg-blue-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddServices}
                      className="px-4 py-2 text-sm text-white font-medium bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm text-blue-600 font-medium border border-blue-600 rounded-md hover:bg-blue-50"
                  >
                    Learn more
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAssemblyOptions(true)}
                    className="px-4 py-2 text-sm text-white font-medium bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Add to your move
                  </button>
                </div>
              )}
            </div>

            {/* Special Requirements */}
            <div className="mb-8">
              <div className="mb-3">
                <h3 className="text-lg font-semibold">Any special requirements or notes?</h3>
              </div>

              <textarea
                placeholder="E.g. Parking available opposite property, sofa comes apart, slightly awkward entrance etc. The more information, the better! Please note: you will receive tracking prior to arrival"
                value={additionalServices.specialRequirements}
                onChange={(e) => setAdditionalServices({
                  ...additionalServices,
                  specialRequirements: e.target.value
                })}
                className="w-full p-3 border rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/date')}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-blue-600 text-white rounded-md font-medium flex items-center justify-center min-w-[120px] ${isSubmitting ? 'opacity-80 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Next Step'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="md:w-1/3">
          <OrderSummary />
        </div>
      </div>

      {/* Time Slot Modal */}
      {showTimeSlotModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Choose Time Slot</h3>
                <button
                  onClick={() => setShowTimeSlotModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="mb-6">
                <div className="mb-4 text-center">
                  <div className="text-lg font-medium text-gray-700">
                    {selectedDate.date ? formatDisplayDate(selectedDate.date) : 'No date selected'}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between mb-4">
                    <div className="font-medium">
                      Collection: {formatTimeWithMinutes(collectionTime.start)} - {formatTimeWithMinutes(collectionTime.end)}
                    </div>
                    <div className="font-medium">
                      Delivery: {deliveryTime}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Start: {formatTimeWithMinutes(collectionTime.start)}</span>
                        <span className="text-sm text-gray-600">End: {formatTimeWithMinutes(collectionTime.end)}</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <label className="mr-4 text-sm text-gray-500">Start time</label>
                          <input
                            type="range"
                            min="0"
                            max="24"
                            step="0.5"
                            value={collectionTime.start}
                            onChange={(e) => handleCollectionTimeChange(e, 'start')}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 ease-in-out"
                          />
                        </div>
                        <div className="flex items-center">
                          <label className="mr-4 text-sm text-gray-500">End time</label>
                          <input
                            type="range"
                            min="0"
                            max="24"
                            step="0.5"
                            value={collectionTime.end}
                            onChange={(e) => handleCollectionTimeChange(e, 'end')}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 ease-in-out"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>12am</span>
                        <div className="w-8 h-[2px] bg-blue-500"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-[2px] bg-blue-500"></div>
                        <span>12pm</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handleResetTimeSlots}
                    className="text-blue-600 text-sm font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Reset to default
                  </button>
                </div>
              </div>

              <div className="text-sm text-gray-600 mb-6">
                Live driver tracking and your time slots will be sent the day before your move
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleConfirmTimeSlot}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Confirm Time Slot
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