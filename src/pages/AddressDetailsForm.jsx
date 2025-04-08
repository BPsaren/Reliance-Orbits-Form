import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';

const AddressDetailsForm = () => {
  const navigate = useNavigate();
  const { pickup, setPickup, delivery, setDelivery } = useBooking();
  const [hasSelectedDate, setHasSelectedDate] = useState(true);
  const [pickupDate, setPickupDate] = useState('27 April 2025');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/items-home');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Where are you moving from and to?" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Pickup Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Pickup Details</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Enter postcode or address</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={pickup.location }
                        onChange={(e) => setPickup({...pickup, location: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                      <span className="absolute right-3 top-2.5 text-green-600">✓</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Select property type</label>
                    <div className="relative">
                      <select 
                        value={pickup.propertyType || '2 Bed House'}
                        onChange={(e) => setPickup({...pickup, propertyType: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none"
                      >
                        <option value="Studio">Studio</option>
                        <option value="1 Bed Flat">1 Bed Flat</option>
                        <option value="2 Bed Flat">2 Bed Flat</option>
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
                </div>
                
                {/* Delivery Details */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-700 mb-4">Delivery Details</h2>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Enter postcode or address</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={delivery.location || 'Bristol, UK'}
                        onChange={(e) => setDelivery({...delivery, location: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                      />
                      <span className="absolute right-3 top-2.5 text-green-600">✓</span>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Select property type</label>
                    <div className="relative">
                      <select 
                        value={delivery.propertyType || '3 Bed Flat'}
                        onChange={(e) => setDelivery({...delivery, propertyType: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none"
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
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Select floor</label>
                    <div className="relative">
                      <select 
                        value={delivery.floor || 'Ground floor'}
                        onChange={(e) => setDelivery({...delivery, floor: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md appearance-none"
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
                </div>
              </div>
              
              {/* Estimated Move Date */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Estimated Move Date</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="hasDate"
                      name="dateOption"
                      checked={hasSelectedDate}
                      onChange={() => setHasSelectedDate(true)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="hasDate" className="ml-2 block text-sm font-medium text-gray-700">
                      Select a move date
                    </label>
                  </div>
                  
                  {hasSelectedDate && (
                    <div className="ml-6">
                      <label className="block text-sm font-medium text-gray-600 mb-1">Pickup date</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <span className="absolute right-3 top-2.5 text-gray-400">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </span>
                      </div>
                      
                      <div className="bg-green-50 border border-green-100 rounded-md p-3 mt-4 flex items-start">
                        <span className="text-green-700 mt-0.5 mr-2">👍</span>
                        <p className="text-sm text-green-800">
                          Great! We have availability in Birmingham on 27th April
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      id="noDate"
                      name="dateOption"
                      checked={!hasSelectedDate}
                      onChange={() => setHasSelectedDate(false)}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <label htmlFor="noDate" className="ml-2 block text-sm font-medium text-gray-700">
                      I don't have a move date yet
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Next Step
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg> */}
                </button>
              </div>
            </form>
          </div>
          
          <div className="lg:w-1/3">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressDetailsForm;