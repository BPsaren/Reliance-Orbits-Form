import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useBooking } from '../context/BookingContext';

const ExtraStopModal = ({ isOpen, onClose, onAddStop }) => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [placeId, setPlaceId] = useState('');
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [selecting, setSelecting] = useState(false);
  const [addressWithPostalCode, setAddressWithPostalCode] = useState('');
  const [error, setError] = useState('');
  const { extraStops, setExtraStops } = useBooking();
  const [doorFlatNo, setDoorFlatNo] = useState(''); // New state for door/flat number

  // New state for property type, floor, and lift availability
  const [propertyType, setPropertyType] = useState('Studio');
  const [floor, setFloor] = useState('Ground floor');
  const [liftAvailable, setLiftAvailable] = useState(false);

    const floorToNumber = (floor) => {
    const map = {
      "Ground floor": 0,
      "1st floor": 1,
      "2nd floor": 2,
      "3rd floor": 3,
      "4th floor": 4,
      "5th floor +": 5
    };
    return typeof floor === 'string' ? map[floor] ?? 0 : floor;
  };

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAddress('');
      setSuggestions([]);
      setPlaceId('');
      setError('');
      setPropertyType('Studio');
      setFloor('Ground floor');
      setLiftAvailable(false);
      setDoorFlatNo(''); // Reset door/flat number
    }
  }, [isOpen]);

  // ... (keep all your existing useEffect hooks and other functions the same)
 // Autocomplete logic
  useEffect(() => {
    if (address.trim() === '' || selecting) {
      setSuggestions([]);
      return;
    }

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      axios.post("https://api.reliancemove.com/autocomplete", { place: address })
        .then(res => {
          setSuggestions(res.data.predictions || []);
          setFocusedIndex(-1);
        })
        .catch(() => setSuggestions([]));
    }, 500);

    setTypingTimeout(timeout);
    return () => clearTimeout(timeout);
  }, [address]);

  // Get postal code when place_id is set
  useEffect(() => {
    if (!placeId) return;
    
    const getPostalCode = async () => {
      try {
        const response = await axios.get(`https://api.reliancemove.com/postalcode/${placeId}`);
        const formattedAddress = formatAddressWithPostcode(address, response.data.long_name);
        
        setSelecting(true);
        setAddress(formattedAddress);
        setAddressWithPostalCode(formattedAddress);
        setTimeout(() => setSelecting(false), 100);
      } catch (error) {
        console.error('Error fetching postal code:', error);
      }
    };

    getPostalCode();
  }, [placeId]);

  const formatAddressWithPostcode = (address, postcode) => {
    const ukPostcodeRegex = /[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}/i;
    const containsUK = (str) => str.trim().endsWith("UK") || str.trim().endsWith("UK,");
    
    let cleanAddress = address;
    if (containsUK(cleanAddress)) {
      cleanAddress = cleanAddress.replace(/,?\s*UK,?$/, '');
    }
    
    if (!ukPostcodeRegex.test(cleanAddress)) {
      return `${cleanAddress} ${postcode}, UK`;
    } else {
      return containsUK(cleanAddress) ? cleanAddress : `${cleanAddress}, UK`;
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    setSelecting(true);
    setAddress(suggestion.description);
    setPlaceId(suggestion.place_id);
    setSuggestions([]);
    setFocusedIndex(-1);
    setError('');
    setTimeout(() => setSelecting(false), 100);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const index = focusedIndex >= 0 ? focusedIndex : 0;
      if (suggestions[index]) {
        handleSuggestionSelect(suggestions[index]);
      }
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setError('Address is required');
      return;
    }

    if (!placeId) {
      setError('Please select a valid address from suggestions');
      return;
    }

    const newStop = {
      liftAvailable: liftAvailable,  // Renamed from liftAvailable to lift
      floor: floorToNumber(floor),
      address: addressWithPostalCode || address,
      propertyType,
      doorFlatNo: doorFlatNo || ''  // Renamed from doorFlatNo to doorNumber, with fallback to empty string
    };

    setExtraStops([...extraStops, newStop]);
    console.log(extraStops);
    onClose();
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    {/* Background overlay with enhanced blur */}
    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"></div>
    </div>

    {/* Modal container */}
    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div className="inline-block align-bottom bg-white/90 backdrop-blur-sm rounded-2xl text-left overflow-hidden shadow-xl border border-white/20 transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full animate-fade-in">
        {/* Header with gradient matching LocationForm - Fixed alignment */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-white rounded-t-2xl">
          <h3 className="text-xl font-bold flex items-center">
            <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Extra Stop
          </h3>
          <p className="text-blue-100 text-sm mt-1">Add an additional pickup or delivery location</p>
        </div>
        
        <div className="px-6 pt-6 pb-4">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Door/Flat Number Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Door/Flat No
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={doorFlatNo}
                  onChange={(e) => setDoorFlatNo(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="e.g., Flat 3, Door 42"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Address Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  placeholder="Enter stop address"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                {suggestions.length > 0 && !selecting && (
                  <ul className="absolute z-20 mt-1 w-full bg-white border-2 border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                    {suggestions.map((suggestion, idx) => (
                      <li
                        key={idx}
                        className={`px-4 py-3 cursor-pointer transition-colors ${
                          idx === focusedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => handleSuggestionSelect(suggestion)}
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          <span className="text-sm">{suggestion.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {error && (
                <p className="text-red-500 text-sm flex items-center bg-red-50 p-2 rounded-lg">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            {/* Property Type and Floor in Grid Layout */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Property Type Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
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
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Floor Select */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Floor</label>
                <div className="relative">
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm appearance-none"
                  >
                    <option value="Ground floor">Ground floor</option>
                    <option value="1st floor">1st floor</option>
                    <option value="2nd floor">2nd floor</option>
                    <option value="3rd floor">3rd floor</option>
                    <option value="4th floor">4th floor</option>
                    <option value="5th floor +">5th floor +</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Lift Availability Checkbox */}
            <div className="flex items-center">
              <label className="flex items-center space-x-3 cursor-pointer bg-gray-50/50 px-4 py-3 rounded-xl hover:bg-gray-100/50 transition-colors w-full">
                <input
                  type="checkbox"
                  id="extraStopLift"
                  checked={liftAvailable}
                  onChange={(e) => setLiftAvailable(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Lift Available</span>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Add Stop</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
);
};

export default ExtraStopModal;