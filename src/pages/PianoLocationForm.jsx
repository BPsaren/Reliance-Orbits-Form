import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import axios from "axios";

const PianoLocationForm = () => {
  const navigate = useNavigate();
  const { 
    pickup, 
    setPickup, 
    delivery, 
    setDelivery, 
    piano, 
    setPiano, 
    pickupAddressWithPostalCode, 
    setpickupAddressWithPostalCode, 
    dropAddressWithPostalCode, 
    setdropAddressWithPostalCode,
  } = useBooking();

  // State for address inputs and autocomplete
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
  

  // Constants
  const floorOptions = [
    "Ground floor", "1st floor", "2nd floor", "3rd floor", "4th floor", "5th floor +"
  ];

  const pianoTypes = [
    "Upright Piano", "Baby Grand Piano", "Grand Piano",
    "Digital Piano", "Electric Piano", "Console Piano"
  ];

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

  // Validation functions
  const validatePickupAddress = () => {
    if (!pickupQuery.trim()) {
      setPickupError('Please enter your pickup location');
      return false;
    }
    if (!pickupPlaceId) {
      setPickupError('Please select a valid pickup location from suggestions');
      return false;
    }
    setPickupError('');
    return true;
  };

  const validateDeliveryAddress = () => {
    if (!deliveryQuery.trim()) {
      setDeliveryError('Please enter your delivery location');
      return false;
    }
    if (!deliveryPlaceId) {
      setDeliveryError('Please select a valid delivery location from suggestions');
      return false;
    }
    setDeliveryError('');
    return true;
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
    if (e.target.value.trim() === '') {
      setPickupError('Please enter your pickup location');
    } else {
      setPickupError('');
    }
  };

  const handleDeliveryInputChange = (e) => {
    setDeliveryQuery(e.target.value);
    setDeliverySelecting(false);
    if (e.target.value.trim() === '') {
      setDeliveryError('Please enter your delivery location');
    } else {
      setDeliveryError('');
    }
  };

  // Extra stop functions
  const handleAddExtraStop = (stopAddress) => {
    setExtraStops([...extraStops, stopAddress]);
  };

  // Form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const isPickupValid = validatePickupAddress();
    const isDeliveryValid = validateDeliveryAddress();
    
    if (!isPickupValid || !isDeliveryValid) {
      return;
    }

    if (!piano?.type) {
      alert('Please select your piano type');
      return;
    }

    navigate('/date');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Where are you moving from and to?" />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Piano Type */}
              <div className="p-6 border-b border-gray-200">
                <select
                  value={piano?.type || ''}
                  onChange={(e) => setPiano({ ...piano, type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="" disabled>Select Your Piano Type</option>
                  {pianoTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Pickup Section */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Pickup Details</h2>

                <div className="mb-4">
                  <label className="block mb-1">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={pickupQuery}
                      onChange={handlePickupInputChange}
                      onKeyDown={handlePickupKeyDown}
                      onBlur={validatePickupAddress}
                      className={`w-full px-4 py-2 border ${pickupError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter pickup address"
                    />
                    {pickupSuggestions.length > 0 && !pickupSelecting && (
                      <ul className="absolute z-10 bg-white border mt-1 rounded-md w-full shadow max-h-60 overflow-y-auto">
                        {pickupSuggestions.map((s, idx) => (
                          <li
                            key={idx}
                            className={`px-4 py-2 cursor-pointer ${idx === focusedPickupIndex ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            onClick={() => handlePickupSuggestionSelect(s)}
                          >
                            {s.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {pickupError && <p className="text-red-600 text-sm mt-1">{pickupError}</p>}
                </div>

                {/* Pickup Floor */}
                <div className="mb-4">
                  <label className="block mb-1">Select Floor</label>
                  <select
                    value={pickup.floor}
                    onChange={(e) => setPickup({ ...pickup, floor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option>Ground floor</option>
                    <option>1st floor</option>
                    <option>2nd floor</option>
                    <option>3rd floor</option>
                    <option>4th floor</option>
                    <option>5th floor +</option>
                  </select>
                </div>

                {/* Pickup Lift */}
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

              {/* Delivery Section */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Delivery Details</h2>

                <div className="mb-4">
                  <label className="block mb-1">Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={deliveryQuery}
                      onChange={handleDeliveryInputChange}
                      onKeyDown={handleDeliveryKeyDown}
                      onBlur={validateDeliveryAddress}
                      className={`w-full px-4 py-2 border ${deliveryError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter delivery address"
                    />
                    {deliverySuggestions.length > 0 && !deliverySelecting && (
                      <ul className="absolute z-10 bg-white border mt-1 rounded-md w-full shadow max-h-60 overflow-y-auto">
                        {deliverySuggestions.map((s, idx) => (
                          <li
                            key={idx}
                            className={`px-4 py-2 cursor-pointer ${idx === focusedDeliveryIndex ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                            onClick={() => handleDeliverySuggestionSelect(s)}
                          >
                            {s.description}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {deliveryError && <p className="text-red-600 text-sm mt-1">{deliveryError}</p>}
                </div>

                 {/* Delivery Floor */}
                 <div className="mb-4">
                  <label className="block mb-1">Select Floor</label>
                  <select
                    value={delivery.floor}
                    onChange={(e) => setDelivery({ ...delivery, floor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  >
                    <option>Ground floor</option>
                    <option>1st floor</option>
                    <option>2nd floor</option>
                    <option>3rd floor</option>
                    <option>4th floor</option>
                    <option>5th floor +</option>
                  </select>
                </div>

                {/* Delivery Lift */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="deliveryLift"
                    checked={delivery.liftAvailable}
                    onChange={(e) => setDelivery({ ...delivery, liftAvailable: e.target.checked })}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="deliveryLift" className="ml-2">Lift Available</label>
                </div>
              </div>

              {/* Footer Buttons */}
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

export default PianoLocationForm;