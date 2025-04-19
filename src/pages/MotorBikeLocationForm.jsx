import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import axios from "axios";

const MotorBikeLocationForm = (props) => {
  const { pickup, setPickup, delivery, setDelivery, motorBike, setMotorBike } = useBooking();
  const [pickupQuery, setPickupQuery] = useState(pickup.location || '');
  const [deliveryQuery, setDeliveryQuery] = useState(delivery.location || '');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);
  const [pickupTypingTimeout, setPickupTypingTimeout] = useState(null);
  const [deliveryTypingTimeout, setDeliveryTypingTimeout] = useState(null);
  const [focusedPickupIndex, setFocusedPickupIndex] = useState(-1);
  const [focusedDeliveryIndex, setFocusedDeliveryIndex] = useState(-1);

  const pickupSelectedRef = useRef(false);
  const deliverySelectedRef = useRef(false);

  const navigate = useNavigate();

  // Pickup location autocomplete
  useEffect(() => {
    if (pickupQuery.trim() === '' || pickupSelectedRef.current) {
      setPickupSuggestions([]);
      pickupSelectedRef.current = false; // Reset flag
      return;
    }

    if (pickupTypingTimeout) clearTimeout(pickupTypingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://reliance-orbit.onrender.com/autocomplete", {
        place: pickupQuery
      })
        .then(res => {
          setPickupSuggestions(res.data.predictions || []);
          setFocusedPickupIndex(-1); // Reset the focused index when new suggestions arrive
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
      deliverySelectedRef.current = false; // Reset the flag after use
      return;
    }

    if (deliveryTypingTimeout) clearTimeout(deliveryTypingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://reliance-orbit.onrender.com/autocomplete", {
        place: deliveryQuery
      })
        .then(res => {
          setDeliverySuggestions(res.data.predictions || []);
          setFocusedDeliveryIndex(-1); // Reset the focused index when new suggestions arrive
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
  };

  // Handle delivery suggestion selection
  const handleDeliverySuggestionSelect = (suggestion) => {
    deliverySelectedRef.current = true;
    setDeliveryQuery(suggestion.description);
    setDelivery({ ...delivery, location: suggestion.description });
    setDeliverySuggestions([]);
    setFocusedDeliveryIndex(-1);
  };

  // Handle keyboard navigation for pickup suggestions
  const handlePickupKeyDown = (e) => {
    if (pickupSuggestions.length === 0) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedPickupIndex(prev =>
        prev < pickupSuggestions.length - 1 ? prev + 1 : 0
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedPickupIndex(prev =>
        prev > 0 ? prev - 1 : pickupSuggestions.length - 1
      );
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedPickupIndex >= 0) {
        handlePickupSuggestionSelect(pickupSuggestions[focusedPickupIndex]);
      } else if (pickupSuggestions.length > 0) {
        handlePickupSuggestionSelect(pickupSuggestions[0]);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      setPickupSuggestions([]);
      setFocusedPickupIndex(-1);
    }
  };

  // Handle keyboard navigation for delivery suggestions
  const handleDeliveryKeyDown = (e) => {
    if (deliverySuggestions.length === 0) return;

    // Arrow down
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedDeliveryIndex(prev =>
        prev < deliverySuggestions.length - 1 ? prev + 1 : 0
      );
    }
    // Arrow up
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedDeliveryIndex(prev =>
        prev > 0 ? prev - 1 : deliverySuggestions.length - 1
      );
    }
    // Enter
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedDeliveryIndex >= 0) {
        handleDeliverySuggestionSelect(deliverySuggestions[focusedDeliveryIndex]);
      } else if (deliverySuggestions.length > 0) {
        handleDeliverySuggestionSelect(deliverySuggestions[0]);
      }
    }
    // Escape
    else if (e.key === 'Escape') {
      setDeliverySuggestions([]);
      setFocusedDeliveryIndex(-1);
    }
  };

  const handleBikeTypeChange = (e) => {
    setMotorBike({ ...motorBike, type: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/date', { state: { prepath: props.prepath } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Where are you moving from and to?" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Motor Bike Details</h2>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Bike Type</label>
                  <select
                    value={motorBike.type || ''}
                    onChange={handleBikeTypeChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="">Select bike type</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Sport Bike">Sport Bike</option>
                    <option value="Cruiser">Cruiser</option>
                    <option value="Touring">Touring</option>
                    <option value="Off-Road">Off-Road</option>
                    <option value="Standard">Standard</option>
                    <option value="Adventure">Adventure</option>
                  </select>
                </div>
              </div>

              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pickup Details</h2>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pickupQuery}
                      onChange={(e) => setPickupQuery(e.target.value)}
                      onKeyDown={handlePickupKeyDown}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter pickup address"
                    />

                    {pickupSuggestions.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
                        {pickupSuggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            onClick={() => handlePickupSuggestionSelect(suggestion)}
                            className={`px-4 py-2 cursor-pointer ${idx === focusedPickupIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
                              }`}
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
                </div>
              </div>

              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Delivery Details</h2>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={deliveryQuery}
                      onChange={(e) => setDeliveryQuery(e.target.value)}
                      onKeyDown={handleDeliveryKeyDown}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter delivery address"
                    />

                    {deliverySuggestions.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md max-h-60 overflow-y-auto">
                        {deliverySuggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            onClick={() => handleDeliverySuggestionSelect(suggestion)}
                            className={`px-4 py-2 cursor-pointer ${idx === focusedDeliveryIndex ? 'bg-blue-100' : 'hover:bg-gray-100'
                              }`}
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
                </div>
              </div>

              <div className="p-6 flex items-center justify-between">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => navigate(-1)}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Next Step
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

export default MotorBikeLocationForm;