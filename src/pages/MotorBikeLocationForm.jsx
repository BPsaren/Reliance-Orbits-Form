import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import axios from "axios";

const MotorBikeLocationForm = (props) => {
  const { 
    pickup, 
    setPickup, 
    delivery, 
    setDelivery, 
    motorBike, 
    setMotorBike, 
    pickupAddressWithPostalCode, 
    setpickupAddressWithPostalCode, 
    dropAddressWithPostalCode, 
    setdropAddressWithPostalCode,
    extraStops,
     setExtraStops 
  } = useBooking();

  // Address and autocomplete states
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
  const [pickupSelecting, setPickupSelecting] = useState(false);
  const [deliverySelecting, setDeliverySelecting] = useState(false);
  
  const navigate = useNavigate();

  // Utility functions
  const containsUKPostalCode = (str) => {
    const ukPostcodeRegex = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/i;
    return ukPostcodeRegex.test(str);
  };

  const containsUK = (str) => {
    return str.trim().endsWith("UK") || str.trim().endsWith("UK,");
  };

  const formatAddressWithPostcode = (address, postcode) => {
    let cleanAddress = address;
    if (containsUK(cleanAddress)) {
      cleanAddress = cleanAddress.replace(/,?\s*UK,?$/, '');
    }
    
    if (!containsUKPostalCode(cleanAddress)) {
      return `${cleanAddress} ${postcode}, UK`;
    } else {
      return containsUK(cleanAddress) ? cleanAddress : `${cleanAddress}, UK`;
    }
  };

  // Autocomplete effects
  useEffect(() => {
    if (pickupQuery.trim() === '' || pickupSelecting) {
      setPickupSuggestions([]);
      return;
    }

    if (pickupTypingTimeout) clearTimeout(pickupTypingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://orbit-0pxd.onrender.com/autocomplete", { place: pickupQuery })
        .then(res => {
          setPickupSuggestions(res.data.predictions || []);
          setFocusedPickupIndex(-1);
        })
        .catch(() => setPickupSuggestions([]));
    }, 500);

    setPickupTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [pickupQuery]);

  useEffect(() => {
    if (deliveryQuery.trim() === '' || deliverySelecting) {
      setDeliverySuggestions([]);
      return;
    }

    if (deliveryTypingTimeout) clearTimeout(deliveryTypingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://orbit-0pxd.onrender.com/autocomplete", { place: deliveryQuery })
        .then(res => {
          setDeliverySuggestions(res.data.predictions || []);
          setFocusedDeliveryIndex(-1);
        })
        .catch(() => setDeliverySuggestions([]));
    }, 500);

    setDeliveryTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [deliveryQuery]);

  // Postal code effects
  useEffect(() => {
    if (!pickupPlaceId) return;
    
    getPostalCode(pickupPlaceId).then((res) => {
      setPickup(prev => {
        const formattedAddress = formatAddressWithPostcode(prev.location, res.data.long_name);
        setPickupSelecting(true);
        setPickupQuery(formattedAddress);
        setTimeout(() => setPickupSelecting(false), 100);
        setpickupAddressWithPostalCode(formattedAddress);
        return { ...prev, postcode: res.data.long_name, location: formattedAddress };
      });
    });
  }, [pickupPlaceId]);

  useEffect(() => {
    if (!deliveryPlaceId) return;
    
    getPostalCode(deliveryPlaceId).then((res) => {
      setDelivery(prev => {
        const formattedAddress = formatAddressWithPostcode(prev.location, res.data.long_name);
        setDeliverySelecting(true);
        setDeliveryQuery(formattedAddress);
        setTimeout(() => setDeliverySelecting(false), 100);
        setdropAddressWithPostalCode(formattedAddress);
        return { ...prev, postcode: res.data.long_name, location: formattedAddress };
      });
    });
  }, [deliveryPlaceId]);

  // Helper functions
  async function getPostalCode(place_id) {
    const response = await axios.get(`https://orbit-0pxd.onrender.com/postalcode/${place_id}`);
    return response;
  }

  const handlePickupSuggestionSelect = (suggestion) => {
    setPickupSelecting(true);
    setPickupQuery(suggestion.description);
    setPickup({ ...pickup, location: suggestion.description });
    setPickupPlaceId(suggestion.place_id);
    setPickupSuggestions([]);
    setFocusedPickupIndex(-1);
    setPickupError('');
    setTimeout(() => setPickupSelecting(false), 100);
  };

  const handleDeliverySuggestionSelect = (suggestion) => {
    setDeliverySelecting(true);
    setDeliveryQuery(suggestion.description);
    setDelivery({ ...delivery, location: suggestion.description });
    setDeliveryPlaceId(suggestion.place_id);
    setDeliverySuggestions([]);
    setFocusedDeliveryIndex(-1);
    setDeliveryError('');
    setTimeout(() => setDeliverySelecting(false), 100);
  };

  const handlePickupKeyDown = (e) => {
    if (!pickupSuggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedPickupIndex(prev => (prev < pickupSuggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedPickupIndex(prev => (prev > 0 ? prev - 1 : pickupSuggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        const index = focusedPickupIndex >= 0 ? focusedPickupIndex : 0;
        if (pickupSuggestions[index]) handlePickupSuggestionSelect(pickupSuggestions[index]);
        break;
      case 'Escape':
        setPickupSuggestions([]);
        break;
      default:
        break;
    }
  };

  const handleDeliveryKeyDown = (e) => {
    if (!deliverySuggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedDeliveryIndex(prev => (prev < deliverySuggestions.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedDeliveryIndex(prev => (prev > 0 ? prev - 1 : deliverySuggestions.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        const index = focusedDeliveryIndex >= 0 ? focusedDeliveryIndex : 0;
        if (deliverySuggestions[index]) handleDeliverySuggestionSelect(deliverySuggestions[index]);
        break;
      case 'Escape':
        setDeliverySuggestions([]);
        break;
      default:
        break;
    }
  };

  const handlePickupInputChange = (e) => {
    setPickupQuery(e.target.value);
    setPickupSelecting(false);
    setPickupError('');
  };

  const handleDeliveryInputChange = (e) => {
    setDeliveryQuery(e.target.value);
    setDeliverySelecting(false);
    setDeliveryError('');
  };

  const handleBikeTypeChange = (e) => {
    setMotorBike({ ...motorBike, type: e.target.value });
  };

  // Extra stop functions
  const handleAddExtraStop = (stopAddress) => {
    setExtraStops([...extraStops, stopAddress]);
  };

  // Form submission
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
              {/* Motor Bike Details */}
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

              {/* Pickup Section */}
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
                  {pickupError && <p className="mt-1 text-sm text-red-600">{pickupError}</p>}
                </div>
              </div>

              {/* Delivery Section */}
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
                  {deliveryError && <p className="mt-1 text-sm text-red-600">{deliveryError}</p>}
                </div>
              </div>

              {/* Footer Buttons */}
              {/* Buttons */}
              <div className="p-6 flex justify-between items-center">
              <div></div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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