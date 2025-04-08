import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';

const LocationForm = () => {
  const navigate = useNavigate();
  const { pickup, setPickup, delivery, setDelivery } = useBooking();
  
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
                      value={pickup.location}
                      onChange={(e) => setPickup({...pickup, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter pickup address"
                    />
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
                    onChange={(e) => setPickup({...pickup, floor: e.target.value})}
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
                    onChange={(e) => setPickup({...pickup, liftAvailable: e.target.checked})}
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
                      value={delivery.location}
                      onChange={(e) => setDelivery({...delivery, location: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter delivery address"
                    />
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
                    onChange={(e) => setDelivery({...delivery, floor: e.target.value})}
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