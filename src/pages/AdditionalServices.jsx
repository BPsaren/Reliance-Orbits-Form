import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';

const AdditionalServices = () => {
  const navigate = useNavigate();
  const { additionalServices, setAdditionalServices, selectedDate } = useBooking();
  const [showTimeSlotModal, setShowTimeSlotModal] = useState(false);
  const [collectionTime, setCollectionTime] = useState({ start: 8, end: 18 });
  const [deliveryTime, setDeliveryTime] = useState('Same day');
  const [dismantleCount, setDismantleCount] = useState(0);
  const [assemblyCount, setAssemblyCount] = useState(0);
  const [showAssemblyOptions, setShowAssemblyOptions] = useState(false);

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

  // Format time in 12-hour format (e.g. 8 -> "8am", 14 -> "2pm")
  const formatTime = (hour) => {
    if (hour === 0) return '12am';
    if (hour < 12) return `${hour}am`;
    if (hour === 12) return '12pm';
    return `${hour - 12}pm`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/booking-details');
  };

  const handleAddServices = () => {
    // Create arrays with the correct number of items
    const dismantlingItems = Array(dismantleCount).fill({ service: 'dismantling', price: 20 });
    const reassemblyItems = Array(assemblyCount).fill({ service: 'reassembly', price: 30 });
    
    setAdditionalServices({
      ...additionalServices,
      dismantling: dismantlingItems,
      reassembly: reassemblyItems
    });
    setShowAssemblyOptions(false);
  };

  const handleTimeSlotChange = () => {
    setShowTimeSlotModal(true);
  };

  const handleCollectionTimeChange = (e, type) => {
    const value = parseInt(e.target.value);
    if (type === 'start') {
      setCollectionTime(prev => ({ ...prev, start: value }));
    } else {
      setCollectionTime(prev => ({ ...prev, end: value }));
    }
  };

  const handleResetTimeSlots = () => {
    setCollectionTime({ start: 8, end: 18 });
  };

  const handleConfirmTimeSlot = () => {
    setShowTimeSlotModal(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="Additional Services and Special Requirements" />
      <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
        Our included insurance is twice the industry standard!
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:gap-8">
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
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
                  <div className="font-medium">Between {formatTime(collectionTime.start)} - {formatTime(collectionTime.end)}</div>
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
                // In your Assembly Options section, update the buttons to prevent default behavior:
<div className="space-y-4">
  <div className="flex items-center justify-between">
    <span>Items to dismantle: £20 per item</span>
    <div className="flex items-center gap-2">
      <button 
        type="button" // Add type="button" to prevent form submission
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
        type="button" // Add type="button" to prevent form submission
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
        type="button" // Add type="button" to prevent form submission
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
        type="button" // Add type="button" to prevent form submission
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
              >
                Back
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
                      Collection: {formatTime(collectionTime.start)} - {formatTime(collectionTime.end)}
                    </div>
                    <div className="font-medium">
                      Delivery: {deliveryTime}
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Start: {formatTime(collectionTime.start)}</span>
                        <span className="text-sm text-gray-600">End: {formatTime(collectionTime.end)}</span>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <label className="mr-4 text-sm text-gray-500">Start time</label>
                          <input
                            type="range"
                            min="0"
                            max="24"
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
                            value={collectionTime.end}
                            onChange={(e) => handleCollectionTimeChange(e, 'end')}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer transition-all duration-200 ease-in-out"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <span>AM</span>
                        <div className="w-8 h-[2px] bg-blue-500"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-[2px] bg-blue-500"></div>
                        <span>PM</span>
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