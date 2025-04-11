import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';

const CarLocationForm = () => {
  const navigate = useNavigate();
  const { pickup, setPickup, delivery, setDelivery, vehicle, setVehicle } = useBooking();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/date');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Where are you moving from and to?" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Vehicle Details</h2>
                
                <div className="mb-4">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Select Make/Brand</label>
                      <div className="relative">
                        <select
                        value={vehicle.brand}
                        onChange={(e) => setVehicle({...vehicle, brand: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          
                        >
                          <option value="Audi">Audi</option>
                          <option value="Tata">Tata</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Select Model </label>
                      <div className="relative">
                        <select
                        value={vehicle.model}
                        onChange={(e) => setVehicle({...vehicle, model: e.target.value})}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          
                        >
                          <option value="A1">A1</option>
                          <option value="Nano">Nano</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4 text-sm">
                    Enter <span className="text-blue-500">Reg Number</span> or <span className="text-blue-500">Vehicle Manually</span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <input 
                      type="checkbox" 
                      id="vehicleOperational" 
                      checked={vehicle?.operational}
                      onChange={(e) => setVehicle({...vehicle, operational: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="vehicleOperational" className="ml-2 block text-gray-700">
                      Vehicle is operational
                    </label>
                  </div>
                </div>
              </div>

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
                      placeholder="Enter Postcode or Address"
                    />
                  </div>
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
                      placeholder="Enter Postcode or Address"
                    />
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => navigate('/')} 
                  className="px-4 py-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center"
                >
                  <span className="mr-1">←</span> Back
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium flex items-center"
                >
                  Get Prices <span className="ml-1">→</span>
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

export default CarLocationForm;