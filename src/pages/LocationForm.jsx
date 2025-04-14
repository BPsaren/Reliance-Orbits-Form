import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import axios from "axios"

const LocationForm = () => {
  const { pickup, setPickup, delivery, setDelivery } = useBooking();
  const [pickupQuery, setPickupQuery] = useState(pickup.location || '');
  const [deliveryQuery, setDeliveryQuery] = useState(delivery.location || '');
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);
  const [pickupTypingTimeout, setPickupTypingTimeout] = useState(null);
  const [deliveryTypingTimeout, setDeliveryTypingTimeout] = useState(null);
  const navigate = useNavigate();

  // Pickup location autocomplete
  useEffect(() => {
    if (pickupQuery.trim() === '') {
      setPickupSuggestions([]);
      return;
    }

    if (pickupTypingTimeout) clearTimeout(pickupTypingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://reliance-orbit.onrender.com/autocomplete", {
        place: pickupQuery
      })
      .then(res => {
        console.log("Pickup suggestions:", res.data);
        setPickupSuggestions(res.data.predictions || []);
      })
      .catch(err => {
        console.error('Pickup autocomplete error:', err);
        setPickupSuggestions([]);
      });
    }, 500);

    setPickupTypingTimeout(timeout);

    return () => clearTimeout(timeout);
  }, [pickupQuery]);

  // Delivery location autocomplete
  useEffect(() => {
    if (deliveryQuery.trim() === '') {
      setDeliverySuggestions([]);
      return;
    }

    if (deliveryTypingTimeout) clearTimeout(deliveryTypingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://reliance-orbit.onrender.com/autocomplete", {
        place: deliveryQuery
      })
      .then(res => {
        console.log("Delivery suggestions:", res.data);
        setDeliverySuggestions(res.data.predictions || []);
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
    setPickupQuery(suggestion.description);
    
    setPickup({
      ...pickup,
      location: suggestion.description
    });
    
    setPickupSuggestions([]);
  };

  // Handle delivery suggestion selection
  const handleDeliverySuggestionSelect = (suggestion) => {
    setDeliveryQuery(suggestion.description);
    
    setDelivery({
      ...delivery,
      location: suggestion.description
    });
    
    setDeliverySuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/items');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Where are you moving from and to?" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Pickup Details</h2>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pickupQuery}
                      onChange={(e) => setPickupQuery(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter pickup address"
                    />

                    {pickupSuggestions.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                        {pickupSuggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            onClick={() => handlePickupSuggestionSelect(suggestion)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    )}

                    <span className="absolute right-3 top-2.5 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Floor</label>
                  <select
                    value={pickup.floor}
                    onChange={(e) => setPickup({ ...pickup, floor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="Ground floor">Ground floor</option>
                    <option value="1st floor">1st floor</option>
                    <option value="2nd floor">2nd floor</option>
                    <option value="3rd floor">3rd floor</option>
                    <option value="4th floor">4th floor</option>
                    <option value="5th floor +">5th floor +</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="liftAvailable"
                    checked={pickup.liftAvailable}
                    onChange={(e) => setPickup({ ...pickup, liftAvailable: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="liftAvailable" className="ml-2 block text-gray-700">
                    Lift Available
                  </label>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter delivery address"
                    />
                    
                    {deliverySuggestions.length > 0 && (
                      <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-md">
                        {deliverySuggestions.map((suggestion, idx) => (
                          <li
                            key={idx}
                            onClick={() => handleDeliverySuggestionSelect(suggestion)}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    )}
                    
                    <span className="absolute right-3 top-2.5 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Floor</label>
                  <select
                    value={delivery.floor}
                    onChange={(e) => setDelivery({ ...delivery, floor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                  >
                    <option value="Ground floor">Ground floor</option>
                    <option value="1st floor">1st floor</option>
                    <option value="2nd floor">2nd floor</option>
                    <option value="3rd floor">3rd floor</option>
                    <option value="4th floor">4th floor</option>
                    <option value="5th floor +">5th floor +</option>
                  </select>
                </div>
              </div>

              <div className="p-6 flex items-center justify-between">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Add an extra stop
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

export default LocationForm;