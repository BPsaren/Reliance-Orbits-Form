import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';
import axios from 'axios';

const BookingDetails = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showPickupManualAddress, setShowPickupManualAddress] = useState(false);
  const [showDeliveryManualAddress, setShowDeliveryManualAddress] = useState(false);

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
    van
  } = useBooking();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Construct the request body according to the required format
      const bookingData = {
        username: customerDetails.name,
        email: customerDetails.email,
        phoneNumber: customerDetails.phone,
        price: totalPrice,
        distance: parseInt(journey.distance) || 0, // Convert "97 miles" to numeric value
        route: journey.route || "default route",
        fromLocation: {
          location: pickup.location,
          floor: typeof pickup.floor === 'string' ? parseInt(pickup.floor) : pickup.floor,
          lift: pickup.liftAvailable,
          propertyType: pickup.propertyType || "standard"
        },
        toLocation: {
          location: delivery.location,
          floor: typeof delivery.floor === 'string' ? parseInt(delivery.floor) : delivery.floor,
          lift: delivery.liftAvailable,
          propertyType: delivery.propertyType || "standard"
        },
        pickupdDate: selectedDate.date,
        pickupdTime: "08:00:00 AM", // Default time if not specified in your context
        dropDate: selectedDate.date, // Using same date for pickup and drop
        dropTime: "10:00:00 AM", // Default time if not specified in your context
        duration: journey.duration,
        quotationRef: quoteRef,
        vanType: van.type,
        worker: selectedDate.numberOfMovers,
        dropAddress: {
          postcode: delivery.postcode,
          addressLine1: delivery.addressLine1,
          addressLine2: delivery.addressLine2,
          city: delivery.city,
          country: delivery.country,
          contactName: delivery.contactName,
          contactPhone: delivery.contactPhone,

        },
        pickupAddress: {
          postcode: pickup.postcode,
          addressLine1: pickup.addressLine1,
          addressLine2: pickup.addressLine2,
          city: pickup.city,
          country: pickup.country,
          contactName: pickup.contactName,
          contactPhone: pickup.contactPhone,
        },
        details: {
          isBusinessCustomer: customerDetails.isBusinessCustomer,
          itemName: items.name,
          itemQuantity: items.quantity,
          motorBike: motorBike.type,
          piano: piano.type,

          // Add any additional details you want to include
        }
      };

      console.log("Booking Data being sent:", JSON.stringify(bookingData, null, 2));

      // Send data to backend
      const response = await axios.post('https://reliance-orbit.onrender.com/new', bookingData);

      console.log('Booking successful:', response.data);

      // Navigate to confirmation page on success
      navigate('/confirmation');
    } catch (error) {
      console.error('Error submitting booking:', error);
      setSubmitError('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle pickup address updates
  const handlePickupChange = (field, value) => {
    setPickup({
      ...pickup,
      [field]: value
    });
  };

  // Function to handle delivery address updates
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="mb-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search Postcode"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={pickup.postcode || ''}
                      onChange={(e) => handlePickupChange('postcode', e.target.value)}
                    />
                    <button
                      type="button"
                      className="ml-2 p-3 bg-gray-100 border rounded-md"
                      onClick={() => {/* Search functionality here */ }}
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </button>
                  </div>
                  {!pickup.postcode && (
                    <div className="mt-2 p-3 bg-red-100 text-red-600 rounded-md">
                      <span className="flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                        Postcode can't be blank
                      </span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => setShowPickupManualAddress(!showPickupManualAddress)}
                >
                  Enter Address Manually
                </button>

                {showPickupManualAddress && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={pickup.addressLine1 || ''}
                        onChange={(e) => handlePickupChange('addressLine1', e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Address Line 2"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={pickup.addressLine2 || ''}
                        onChange={(e) => handlePickupChange('addressLine2', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={pickup.city || ''}
                        onChange={(e) => handlePickupChange('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Country</label>
                      <input
                        type="text"
                        placeholder="Country"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={pickup.country || ''}
                        onChange={(e) => handlePickupChange('country', e.target.value)}
                      />
                    </div>
                  </div>
                )}
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
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Pickup Contact Number"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={pickup.contactPhone || ''}
                      onChange={(e) => handlePickupChange('contactPhone', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-blue-600 font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  It is your responsibility to make this person aware that Relaince and a driver will contact them during the course of the job. By clicking 'Book Now' you are authorizing AnyVan to share essential booking information with this person and a driver.
                </div>
              </div>
            </div>

            {/* Delivery Address Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Delivery Details</h2>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="mb-2">
                  <div className="flex items-center">
                    <input
                      type="text"
                      placeholder="Search Postcode"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={delivery.postcode || ''}
                      onChange={(e) => handleDeliveryChange('postcode', e.target.value)}
                    />
                    <button
                      type="button"
                      className="ml-2 p-3 bg-gray-100 border rounded-md"
                      onClick={() => {/* Search functionality here */ }}
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => setShowDeliveryManualAddress(!showDeliveryManualAddress)}
                >
                  Enter Address Manually
                </button>

                {showDeliveryManualAddress && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={delivery.addressLine1 || ''}
                        onChange={(e) => handleDeliveryChange('addressLine1', e.target.value)}
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Address Line 2"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={delivery.addressLine2 || ''}
                        onChange={(e) => handleDeliveryChange('addressLine2', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">City</label>
                      <input
                        type="text"
                        placeholder="City"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={delivery.city || ''}
                        onChange={(e) => handleDeliveryChange('city', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Country</label>
                      <input
                        type="text"
                        placeholder="Country"
                        className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={delivery.country || ''}
                        onChange={(e) => handleDeliveryChange('country', e.target.value)}
                      />
                    </div>
                  </div>
                )}
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
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Delivery Contact Number"
                      className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={delivery.contactPhone || ''}
                      onChange={(e) => handleDeliveryChange('contactPhone', e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-blue-600 font-bold text-xl"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  It is your responsibility to make this person aware that Relaince and a driver will contact them during the course of the job. By clicking 'Book Now' you are authorizing AnyVan to share essential booking information with this person and a driver.
                </div>
              </div>
            </div>

            {/* Contact Details */}
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
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  value={customerDetails.phone}
                  onChange={(e) => setCustomerDetails({ ...customerDetails, phone: e.target.value })}
                  className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                  required
                />
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
                  <div className="text-gray-600">Moving from:</div>
                  <div className="font-medium">{pickup.location}</div>
                </div>

                <div className="flex justify-between py-2">
                  <div className="text-gray-600">Moving to:</div>
                  <div className="font-medium">{delivery.location}</div>
                </div>
              </div>

              {/* Payment Options */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Payment Options</h3>

                <div className="bg-white border rounded-md p-4 mb-3 flex items-center">
                  <input
                    type="radio"
                    id="card-payment"
                    name="payment"
                    defaultChecked
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="card-payment" className="ml-2 block text-sm font-medium text-gray-700">Pay by card</label>
                  <div className="ml-auto flex items-center">
                    <span className="mr-2 text-xl">💳</span>
                    <span className="text-sm text-gray-600">Major cards accepted</span>
                  </div>
                </div>

                <div className="bg-white border rounded-md p-4 flex items-center">
                  <input
                    type="radio"
                    id="klarna-payment"
                    name="payment"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label htmlFor="klarna-payment" className="ml-2 block text-sm font-medium text-gray-700">Pay with Klarna</label>
                  <div className="ml-auto flex items-center">
                    <span className="mr-2 text-lg font-bold text-pink-500">K</span>
                    <span className="text-sm text-gray-600">Pay in 3 interest-free installments</span>
                  </div>
                </div>
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
                {isSubmitting ? 'Processing...' : 'Complete Booking'}
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