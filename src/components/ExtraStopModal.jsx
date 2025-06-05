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
      lift: liftAvailable,  // Renamed from liftAvailable to lift
      floor: floorToNumber(floor),
      address: addressWithPostalCode || address,
      propertyType,
      doorNumber: doorFlatNo || ''  // Renamed from doorFlatNo to doorNumber, with fallback to empty string
    };

    setExtraStops([...extraStops, newStop]);
    console.log(extraStops);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Background overlay with fade-in animation */}
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75 animate-fade-in"></div>
      </div>

      {/* Modal container with fade-in animation */}
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 animate-fade-in">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Add Extra Stop
            </h3>
            
            <form onSubmit={handleSubmit}>
              {/* Door/Flat Number Input - NEW FIELD */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Door/Flat No
                </label>
                <input
                  type="text"
                  value={doorFlatNo}
                  onChange={(e) => setDoorFlatNo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Flat 3, Door 42"
                />
              </div>

              {/* Address Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter stop address"
                  />
                  {suggestions.length > 0 && !selecting && (
                    <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                      {suggestions.map((suggestion, idx) => (
                        <li
                          key={idx}
                          className={`px-3 py-2 cursor-pointer ${idx === focusedIndex ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                          onClick={() => handleSuggestionSelect(suggestion)}
                        >
                          {suggestion.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
              </div>

              {/* Property Type Select */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Select property type</label>
                <div className="relative">
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

              {/* Floor Select */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-600 mb-1">Select floor</label>
                <div className="relative">
                  <select
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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

              {/* Lift Availability Checkbox */}
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="extraStopLift"
                  checked={liftAvailable}
                  onChange={(e) => setLiftAvailable(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="extraStopLift" className="ml-2 block text-sm text-gray-700">
                  Lift Available
                </label>
              </div>

              {/* Buttons */}
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  Add Stop
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
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