import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import axios from "axios";

const MotorBikeLocationForm = (props) => {
  const { pickup, setPickup, delivery, setDelivery, motorBike, setMotorBike, pickupAddressWithPostalCode, setpickupAddressWithPostalCode, dropAddressWithPostalCode, setdropAddressWithPostalCode } = useBooking();

  const [pickupQuery, setPickupQuery] = useState(pickup.location || '');
  const [deliveryQuery, setDeliveryQuery] = useState(delivery.location || '');

  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);

  const [pickupPlaceId, setPickupPlaceId] = useState('');
  const [deliveryPlaceId, setDeliveryPlaceId] = useState('');

  const [pickupTypingTimeout, setPickupTypingTimeout] = useState(null);
  const [deliveryTypingTimeout, setDeliveryTypingTimeout] = useState(null);

  const [focusedPickupIndex, setFocusedPickupIndex] = useState(-1);
  const [focusedDeliveryIndex, setFocusedDeliveryIndex] = useState(-1);

  const [pickupError, setPickupError] = useState('');
  const [deliveryError, setDeliveryError] = useState('');

  // Track if user is currently selecting from suggestions
  const [pickupSelecting, setPickupSelecting] = useState(false);
  const [deliverySelecting, setDeliverySelecting] = useState(false);

  const navigate = useNavigate();

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

  // Autocomplete for pickup
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
      axios.post("https://reliance-orbit.onrender.com/autocomplete", { place: pickupQuery })
        .then(res => {
          setPickupSuggestions(res.data.predictions || []);
          setFocusedPickupIndex(-1);
        })
        .catch(() => setPickupSuggestions([]));
    }, 500);

    setPickupTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [pickupQuery]);

  // Autocomplete for delivery
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
      axios.post("https://reliance-orbit.onrender.com/autocomplete", { place: deliveryQuery })
        .then(res => {
          setDeliverySuggestions(res.data.predictions || []);
          setFocusedDeliveryIndex(-1);
        })
        .catch(() => setDeliverySuggestions([]));
    }, 500);

    setDeliveryTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [deliveryQuery]);

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

  // for address with postal code for pickup
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
        
        setpickupAddressWithPostalCode(formattedAddress);
        return { ...newPickup, location: formattedAddress };
      });
    });
  }, [pickupPlaceId]);

  // for address with postal code for delivery
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
        
        setdropAddressWithPostalCode(formattedAddress);
        return { ...newDelivery, location: formattedAddress };
      });
    });
  }, [deliveryPlaceId]);

  async function getPostalCode(place_id) {
    const response = await axios.get("https://reliance-orbit.onrender.com/postalcode/" + place_id);
    return response;
  }

  // Suggestion handlers
  const handlePickupSuggestionSelect = (suggestion) => {
    // Mark that we're selecting something, which will prevent suggestions
    setPickupSelecting(true);
    
    setPickupQuery(suggestion.description);
    setPickup({ ...pickup, location: suggestion.description });
    setPickupPlaceId(suggestion.place_id);
    setPickupSuggestions([]);
    setFocusedPickupIndex(-1);
    setPickupError('');
    
    // Reset the selection flag after a short delay to allow state updates
    setTimeout(() => setPickupSelecting(false), 100);
  };

  const handleDeliverySuggestionSelect = (suggestion) => {
    // Mark that we're selecting something, which will prevent suggestions
    setDeliverySelecting(true);
    
    setDeliveryQuery(suggestion.description);
    setDelivery({ ...delivery, location: suggestion.description });
    setDeliveryPlaceId(suggestion.place_id);
    setDeliverySuggestions([]);
    setFocusedDeliveryIndex(-1);
    setDeliveryError('');
    
    // Reset the selection flag after a short delay to allow state updates
    setTimeout(() => setDeliverySelecting(false), 100);
  };

  // Keyboard navigation for pickup
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

  // Keyboard navigation for delivery
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

  // Handle manual input change with focus on input field
  const handlePickupInputChange = (e) => {
    setPickupQuery(e.target.value);
    // If the user is typing manually, they're not selecting from suggestions
    setPickupSelecting(false);
  };

  const handleDeliveryInputChange = (e) => {
    setDeliveryQuery(e.target.value);
    // If the user is typing manually, they're not selecting from suggestions
    setDeliverySelecting(false);
  };

  const handleBikeTypeChange = (e) => {
    setMotorBike({ ...motorBike, type: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let valid = true;

    if (!pickupQuery.trim()) {
      setPickupError('Pickup address is required');
      valid = false;
    } else {
      setPickupError('');
    }

    if (!deliveryQuery.trim()) {
      setDeliveryError('Delivery address is required');
      valid = false;
    } else {
      setDeliveryError('');
    }

    if (valid) {
      navigate('/date', { state: { prepath: props.prepath } });
    }
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
                      onChange={handlePickupInputChange}
                      onKeyDown={handlePickupKeyDown}
                      className={`w-full px-4 py-2 border ${pickupError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter pickup address"
                    />

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
                  </div>
                  {pickupError && (
                    <p className="mt-1 text-sm text-red-600">{pickupError}</p>
                  )}
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
                      onChange={handleDeliveryInputChange}
                      onKeyDown={handleDeliveryKeyDown}
                      className={`w-full px-4 py-2 border ${deliveryError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter delivery address"
                    />

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
                  </div>
                  {deliveryError && (
                    <p className="mt-1 text-sm text-red-600">{deliveryError}</p>
                  )}
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
                  className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 font-medium"
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