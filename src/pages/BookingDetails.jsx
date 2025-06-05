import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import axios from 'axios';
import AdditionalServices from './AdditionalServices';

import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// List of UK cities for validation
const UK_CITIES = [
  "London", "Birmingham", "Manchester", "Leeds", "Sheffield",
  "Bradford", "Liverpool", "Bristol", "Coventry", "Leicester",
  "Nottingham", "Newcastle upon Tyne", "Sunderland", "Derby", "Plymouth",
  "Wolverhampton", "Southampton", "Stoke-on-Trent", "Reading", "Brighton & Hove",
  "Milton Keynes", "Northampton", "Luton", "Exeter", "York",
  "Cambridge", "Oxford", "Norwich", "Bournemouth", "Poole",
  "Swindon", "Peterborough", "Southend-on-Sea", "Bath", "Ipswich",
  "Blackpool", "Middlesbrough", "Huddersfield", "Hull", "Preston",
  "Portsmouth", "Slough", "Warrington", "Cheltenham", "Gloucester",
  "Worthing", "Doncaster", "Rotherham", "Colchester", "Crawley",
  "Lincoln", "Chester", "Canterbury", "Lancaster", "Wakefield",
  "Barnsley", "Stockport", "Wigan", "Oldham", "Bolton",
  "Rochdale", "Salford", "Telford", "Blackburn", "Burnley",
  "Grimsby", "Mansfield", "Bedford", "Hastings", "Chelmsford",
  "Dudley", "Weston-super-Mare", "Salisbury", "Worcester", "Hereford",
  "St Albans", "Winchester", "Chichester", "Durham", "Carlisle",
  "Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness",
  "Stirling", "Perth", "Dunfermline", "Ayr", "Kilmarnock",
  "Paisley", "Greenock", "Livingston", "Falkirk", "Motherwell",
  "Hamilton", "Cumbernauld", "Kirkcaldy", "Glenrothes", "Dumfries",
  "Cardiff", "Swansea", "Newport", "Wrexham", "Bangor",
  "St Asaph", "St Davids", "Aberystwyth", "Carmarthen", "Caernarfon",
  "Llandudno", "Bridgend", "Merthyr Tydfil", "Rhyl", "Barry",
  "Belfast", "Derry", "Lisburn", "Newry", "Armagh",
  "Bangor", "Craigavon", "Ballymena", "Omagh", "Enniskillen"
];

const BookingDetails = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [phoneErrors, setPhoneErrors] = useState({
    customer: '',
    pickup: '',
    delivery: ''
  });

  
  // State for postcode search functionality
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [deliverySuggestions, setDeliverySuggestions] = useState([]);
  const [isPickupSearching, setIsPickupSearching] = useState(false);
  const [isDeliverySearching, setIsDeliverySearching] = useState(false);

  const {
    customerDetails,
    setCustomerDetails,
    pickup,
    setPickup,
    delivery,
    setDelivery,
    selectedDate,
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
    bookingRef, setBookingRef,
    additionalServices,

  } = useBooking();

  // Validate UK mobile number
  const validateUKPhoneNumber = (phone) => {
    const regex = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
    return regex.test(phone);
  };

  // Handle pickup postcode search
  const handlePickupPostcodeSearch = async () => {
    if (!pickup.postcode) return;
    
    setIsPickupSearching(true);
    try {
      const response = await axios.post("https://orbit-0pxd.onrender.com/autocomplete", { 
        place: pickup.postcode 
      });
      setPickupSuggestions(response.data.predictions || []);
    } catch (error) {
      console.error('Error searching pickup postcode:', error);
      setPickupSuggestions([]);
    } finally {
      setIsPickupSearching(false);
    }
  };

  // Handle delivery postcode search
  const handleDeliveryPostcodeSearch = async () => {
    if (!delivery.postcode) return;
    
    setIsDeliverySearching(true);
    try {
      const response = await axios.post("https://orbit-0pxd.onrender.com/autocomplete", { 
        place: delivery.postcode 
      });
      setDeliverySuggestions(response.data.predictions || []);
    } catch (error) {
      console.error('Error searching delivery postcode:', error);
      setDeliverySuggestions([]);
    } finally {
      setIsDeliverySearching(false);
    }
  };

  // Unified address parser that works for both scenarios
const parseAddressComponents = (fullAddress) => {
  if (!fullAddress) return { addressLine1: '', addressLine2: '', city: '' };

  // Clean the input
  const cleaned = fullAddress
    .replace(/\bUK\b/i, '')
    .replace(/[A-Z]{1,2}\d{1,2}[A-Z]?\s*\d[A-Z]{2}/g, '')
    .trim();

  // Split into parts
  const parts = cleaned.split(',')
    .map(part => part.trim())
    .filter(part => part !== '');

  // Find city (exact match only)
  let city = '';

  // Check each part for a city match
  const filteredParts = parts.filter(part => {
    const matchedCity = UK_CITIES.find(c => 
      c.toLowerCase() === part.toLowerCase()
    );
    if (matchedCity) {
      city = matchedCity; // Store the matched city
      return false; // Remove this part from address lines
    }
    return true; // Keep this part in address lines
  });

  return {
    addressLine1: filteredParts[0] || "",
    addressLine2: filteredParts[1] || "",
    city: city
  };
};

// For postcode search selection
const handlePickupAddressSelect = async (suggestion) => {
  try {
    const { addressLine1, addressLine2, city } = parseAddressComponents(suggestion.description);
    
    setPickup(prev => ({
      ...prev,
      addressLine1,
      addressLine2,
      city,
      location: suggestion.description,
      // Keep original postcode
    }));
    
    setPickupSuggestions([]);
  } catch (error) {
    console.error('Error processing address:', error);
    setPickupSuggestions([]);
  }
};

// For initial address parsing (from previous steps)
useEffect(() => {
  if (pickup.location && !pickup.addressLine1) {
    const { addressLine1, addressLine2, city } = parseAddressComponents(pickup.location);
    setPickup(prev => ({
      ...prev,
      addressLine1,
      addressLine2,
      city
    }));
  }
}, [pickup.location]);

// Same for delivery address
const handleDeliveryAddressSelect = async (suggestion) => {
  try {
    const { addressLine1, addressLine2, city } = parseAddressComponents(suggestion.description);
    
    setDelivery(prev => ({
      ...prev,
      addressLine1,
      addressLine2,
      city,
      location: suggestion.description,
      // Keep original postcode
    }));
    
   setDeliverySuggestions([]);
  } catch (error) {
    console.error('Error processing address:', error);
    setDeliverySuggestions([]);
  }
  
};

useEffect(() => {
  if (delivery.location && !delivery.addressLine1) {
    /* same pattern as pickup */
    const { addressLine1, addressLine2, city } = parseAddressComponents(delivery.location);
     setDelivery(prev => ({
      ...prev,
      addressLine1,
      addressLine2,
      city
    }));
  }
}, [delivery.location]);





  //for add extra stop
  useEffect(() => {
    console.log('Current extraStops:', extraStops);
  }, [extraStops]);

  // Validate all phone numbers before submission
  const validateAllPhones = () => {
    const errors = {
      customer: validateUKPhoneNumber(customerDetails.phone) ? '' : 'Enter a valid UK mobile number: 07 (11 digits) or +447 format',
      pickup: validateUKPhoneNumber(pickup.contactPhone) ? '' : 'Enter a valid UK mobile number: 07 (11 digits) or +447 format',
      delivery: validateUKPhoneNumber(delivery.contactPhone) ? '' : 'Enter a valid UK mobile number: 07 (11 digits) or +447 format'
    };

    setPhoneErrors(errors);

    return !errors.customer && !errors.pickup && !errors.delivery;
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
const validateItems = (items)=>{
  if (!Array.isArray(items) || items.length === 0 ) return [];
  return items.map(items=>({
    ...items,
    name: items.name || '',
    // Ensure quantity exists and is a number
    quantity: items.quantity || 0,

  }))
}
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAllPhones()) {
      setSubmitError('Please correct the phone number errors');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    // function hourToTime(hour) {
    //   // If the hour is already in HH:MM:SS format, return it as is
    //   if (typeof hour === 'string' && hour.includes(':')) {
    //     return hour;
    //   }

    //   const hrs = Math.floor(hour).toString().padStart(2, '0');
    //   const mins = (hour % 1 === 0.5) ? '30' : '00';
    //   return `${hrs}:${mins}:00`;
    // }

    try {

      const validatedStops = validateExtraStops(extraStops);
      const validatedItems = validateItems(items);
      // ✅ Then create bookingData using quotationRef
      // const bookingData = {
      //   username: customerDetails.name || 'NA',
      //   email: customerDetails.email || 'NA',
      //   phoneNumber: customerDetails.phone || 'NA',
      //   price: totalPrice || 0,
      //   distance: parseInt(journey.distance) || 0,
      //   route: "default route",
      //   duration: journey.duration || "N/A",
      //   pickupDate: selectedDate.date || 'NA',
      //   pickupTime: selectedDate.pickupTime || '08:00:00',
      //   pickupAddress: {
      //     postcode: pickup.postcode,
      //     addressLine1: pickup.addressLine1,
      //     addressLine2: pickup.addressLine2,
      //     city: pickup.city,
      //     country: pickup.country,
      //     contactName: pickup.contactName,
      //     contactPhone: pickup.contactPhone,
      //   },
      //   dropDate: selectedDate.date || 'NA',
      //   dropTime: selectedDate.dropTime || '18:00:00',
      //   dropAddress: {
      //     postcode: delivery.postcode,
      //     addressLine1: delivery.addressLine1,
      //     addressLine2: delivery.addressLine2,
      //     city: delivery.city,
      //     country: delivery.country,
      //     contactName: delivery.contactName,
      //     contactPhone: delivery.contactPhone,
      //   },

      //   vanType: van.type || "N/A",
      //   worker: selectedDate.numberOfMovers || 1,
      //   itemsToDismantle: itemsToDismantle || 0,
      //   itemsToAssemble: itemsToAssemble || 0,
      //   stoppage: extraStops.map(item => item.address) || [],
      //   pickupLocation: {
      //     location: pickup.location || "N/A",
      //     floor: typeof pickup.floor === 'string' ? parseInt(pickup.floor) : pickup.floor,
      //     lift: pickup.liftAvailable,
      //     propertyType: pickup.propertyType || "standard"
      //   },
      //   dropLocation: {
      //     location: delivery.location || "N/A",
      //     floor: typeof delivery.floor === 'string' ? parseInt(delivery.floor) : delivery.floor,
      //     lift: delivery.liftAvailable,
      //     propertyType: delivery.propertyType || "standard"
      //   },
      //   details: {
      //     items: {
      //       name: items.map(item => item.name) || [],
      //       quantity: items.map(item => item.quantity) || [],
      //     },
      //     isBusinessCustomer: customerDetails.isBusinessCustomer,
      //     motorBike: motorBike.type,
      //     piano: piano.type,
      //     specialRequirements: additionalServices.specialRequirements,
          
      //   },
      //   quotationRef: quoteRef || 'NA'
      // };

      // console.log("Booking Data being sent:", JSON.stringify(bookingData, null, 2));

      // 🔁 Then: POST to /new with quotationRef included
      // const bookingResponse = await axios.post('https://orbit-0pxd.onrender.com/new', bookingData);

      // const bookingRefNumber = bookingResponse.data?.newOrder?.bookingRef;

      // console.log("Booking response: ", bookingResponse)
      // console.log("Booking ref: ", bookingRefNumber);

      // if (!bookingRefNumber) {
      //   throw new Error("Booking reference not received from server");
      // }
      // console.log('Booking successful:', bookingResponse.data);
      // setBookingRef(bookingRefNumber);

      // console.log('Booking Ref:', bookingRef);
      // navigate('/confirmation');

      const metaDataBody = {
        username: customerDetails.name || 'NA',
        email: customerDetails.email || 'NA',
        phoneNumber: customerDetails.phone || 'NA',
        price: totalPrice || 0,
        // price: 0,
        distance: parseInt(journey.distance) || 0,
        route: "default route",
        duration: journey.duration || "N/A",
        pickupDate: selectedDate.date || 'NA',
        pickupTime: selectedDate.pickupTime || '08:00:00',
        pickupAddress: {
          flatNo: pickup.flatNo,
          postcode: pickup.postcode,
          addressLine1: pickup.addressLine1,
          addressLine2: pickup.addressLine2,
          city: pickup.city,
          country: pickup.country,
          contactName: pickup.contactName,
          contactPhone: pickup.contactPhone,
        },
        dropDate: selectedDate.date || 'NA',
        dropTime: selectedDate.dropTime || '18:00:00',
        dropAddress: {
          flatNo: delivery.flatNo,
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
        ExtraStopsArray: validatedStops,
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
          specialRequirements: additionalServices.specialRequirements,
        },
        // bookingRef: bookingRefNumber,
        quotationRef: quoteRef || 'NA',
        itemsArray: items,
      };

      console.log("Metadata Data Body being sent:", JSON.stringify(metaDataBody, null, 2));

      const sessionRes = await axios.post('https://payment-gateway-reliance.onrender.com/create-checkout-session', metaDataBody);

      const stripe = await stripePromise;
      await stripe.redirectToCheckout({ sessionId: sessionRes.data.sessionId });

    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError('Failed to submit booking. Please try again. (Check all fields are selected or not)');
      console.error('Error response data:', error.response.data);
      navigate('/payment-failed'); // redirect on error

    } finally {
      setIsSubmitting(false);
    }
  };


  const handlePickupChange = (field, value) => {
    setPickup({
      ...pickup,
      [field]: value
    });
  };

  const handleDeliveryChange = (field, value) => {
    setDelivery({
      ...delivery,
      [field]: value
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="Your Booking Details" />

      <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:gap-8">
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Pickup Address Section */}
               <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Pickup Details</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                <div className="mb-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Enter Postcode"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={pickup.postcode || ''}
                      onChange={(e) => setPickup({ ...pickup, postcode: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={handlePickupPostcodeSearch}
                      disabled={isPickupSearching}
                      className="ml-2 p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {isPickupSearching ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  
                  {/* Pickup Address Suggestions */}
                  {pickupSuggestions.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-md">
                      <ul className="max-h-60 overflow-y-auto">
                        {pickupSuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handlePickupAddressSelect(suggestion)}
                          >
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Manual address fields for pickup */}
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Flat No.</label>
                    <input
                      type="text"
                      placeholder="Flat No/Door No"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={pickup.flatNo || ''}
                      onChange={(e) => setPickup({ ...pickup, flatNo: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Address</label>
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={pickup.addressLine1 || ''}
                      onChange={(e) => setPickup({ ...pickup, addressLine1: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={pickup.addressLine2 || ''}
                      onChange={(e) => setPickup({ ...pickup, addressLine2: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={pickup.city || ''}
                      onChange={(e) => setPickup({ ...pickup, city: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Pickup Contact Details */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Contact Name at Pickup"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={pickup.contactName || ''}
                      onChange={(e) => handlePickupChange('contactName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Pickup Contact Number (UK mobile)"
                      className={`w-full p-3 border rounded-md focus:ring-2 ${phoneErrors.pickup ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                      value={pickup.contactPhone || ''}
                      onChange={(e) => handlePickupChange('contactPhone', e.target.value)}
                      required
                    />
                    {phoneErrors.pickup && (
                      <div className="text-red-500 text-xs mt-1">{phoneErrors.pickup}</div>
                    )}
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-blue-600 font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  It is your responsibility to make this person aware that Relaince and a driver will contact them during the course of the job. By clicking 'Book Now' you are authorizing Relaince to share essential booking information with this person and a driver.
                </div>
              </div>
            </div>

            {/* Delivery Address Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery Details</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Postcode</label>
                <div className="mb-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Enter Postcode"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={delivery.postcode || ''}
                      onChange={(e) => setDelivery({ ...delivery, postcode: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={handleDeliveryPostcodeSearch}
                      disabled={isDeliverySearching}
                      className="ml-2 p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                    >
                      {isDeliverySearching ? 'Searching...' : 'Search'}
                    </button>
                  </div>
                  
                  {/* Delivery Address Suggestions */}
                  {deliverySuggestions.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-md">
                      <ul className="max-h-60 overflow-y-auto">
                        {deliverySuggestions.map((suggestion, index) => (
                          <li
                            key={index}
                            className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                            onClick={() => handleDeliveryAddressSelect(suggestion)}
                          >
                            {suggestion.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Manual address fields for delivery */}
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Flat No.</label>
                    <input
                      type="text"
                      placeholder="Flat No/Door No"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={delivery.flatNo || ''}
                      onChange={(e) => setDelivery({ ...delivery, flatNo: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Address</label>
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={delivery.addressLine1 || ''}
                      onChange={(e) => setDelivery({ ...delivery, addressLine1: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={delivery.addressLine2 || ''}
                      onChange={(e) => setDelivery({ ...delivery, addressLine2: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="City"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={delivery.city || ''}
                      onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Contact Details */}
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-3">Contact Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Contact Name at Delivery"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={delivery.contactName || ''}
                      onChange={(e) => handleDeliveryChange('contactName', e.target.value)}
                      required
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Delivery Contact Number (UK mobile)"
                      className={`w-full p-3 border rounded-md focus:ring-2 ${phoneErrors.delivery ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                      value={delivery.contactPhone || ''}
                      onChange={(e) => handleDeliveryChange('contactPhone', e.target.value)}
                      required
                    />
                    {phoneErrors.delivery && (
                      <div className="text-red-500 text-xs mt-1">{phoneErrors.delivery}</div>
                    )}
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-blue-600 font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  It is your responsibility to make this person aware that Relaince and a driver will contact them during the course of the job. By clicking 'Book Now' you are authorizing Relaince to share essential booking information with this person and a driver.
                </div>
              </div>
            </div>

            {/* Contact Details Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Details</h2>

              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, name: e.target.value })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={customerDetails.email}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, email: e.target.value })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your email address"
                  required
                />
                <div className="text-xs text-gray-500 mt-1">We'll send your booking confirmation here</div>
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (UK mobile)</label>
                <input
                  type="tel"
                  id="phone"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  className={`w-full p-3 border rounded-md focus:ring-2 ${phoneErrors.customer ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                  placeholder="Enter your UK mobile number"
                  required
                />
                {phoneErrors.customer && (
                  <div className="text-red-500 text-xs mt-1">{phoneErrors.customer}</div>
                )}
                <div className="text-xs text-gray-500 mt-1">We'll use this to contact you about your move</div>
              </div>

              <div className="flex items-center mb-4">
                <input
                  type="checkbox"
                  id="businessCustomer"
                  checked={customerDetails.isBusinessCustomer}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, isBusinessCustomer: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="businessCustomer" className="ml-2 block text-sm text-gray-700">I am a business customer</label>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Booking Summary</h2>

              <div className="bg-gray-50 p-4 rounded-md mb-6">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <div className="font-medium">Moving from:</div>
                  {/** <div className="text-gray-600"></div>*/}
                   
                  <div className="text-gray-600">Flat no-{pickup.flatNo}, {pickup.location}</div>
                  {/**<div className="font-medium">Door No/flat No:</div> */}
                 

                </div>

                <div className="flex justify-between py-2">
                  <div className=" font-medium">Moving to:</div>
                  {/* <div className=" text-gray-600">{delivery.flatNo}</div>*/}
                  
                  <div className="text-gray-600">Falt no -{delivery.flatNo}, {delivery.location}</div>
                  {/** <div className="font-medium">Door No/flat No:</div>*/}
                 
                </div>

                {extraStops.map((stop, index) => (
                  <div key={index} className="flex justify-between items-center group hover:bg-gray-50 rounded -mx-2 px-2 py-1">
                    <div className="font-medium"> Extra Stops: </div>
                    {/* <div className="text-gray-600">{stop.doorFlatNo}</div>*/}
                   
                    <div className="text-gray-600">Flat no-{stop.doorFlatNo}, {stop.address}</div>
                     {/*<div className="font-medium"> Door No/flat No: </div>*/} 
                    

                  </div>
                ))}
              </div>



              {/* Terms Section */}
              <div className="space-y-3">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Data Protection Policy</a>
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="marketing"
                    className="h-4 w-4 mt-1 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="marketing" className="ml-2 block text-sm text-gray-700">
                    I would like to receive marketing communications with special offers and news
                  </label>
                </div>
              </div>
            </div>

            {/* Error message if submission fails */}
            {submitError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                {submitError}
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => navigate('/additional-services')}
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
                disabled={isSubmitting}
              >
                Back
              </button>
              <button
                type="submit"
                className={`px-6 py-3 ${isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-md font-medium`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Redirecting to Payment...' : 'Pay Now'}
              </button>
            </div>
          </form>
        </div>

        <div className="md:w-1/3">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;