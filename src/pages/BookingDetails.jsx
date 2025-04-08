import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';

const BookingDetails = () => {
  const navigate = useNavigate();
  const { customerDetails, setCustomerDetails, pickup, delivery } = useBooking();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Would typically send data to server here
    navigate('/confirmation');
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="Your Booking Details" />
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:gap-8">
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Contact Details */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Contact Details</h2>
              
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  id="name"
                  value={customerDetails.name}
                  onChange={(e) => setCustomerDetails({...customerDetails, name: e.target.value})}
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
                  onChange={(e) => setCustomerDetails({...customerDetails, email: e.target.value})}
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
                  onChange={(e) => setCustomerDetails({...customerDetails, phone: e.target.value})}
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
                  onChange={(e) => setCustomerDetails({...customerDetails, isBusinessCustomer: e.target.checked})}
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
            
            {/* Form Actions */}
            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={() => navigate('/additional-services')} 
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Complete Booking
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