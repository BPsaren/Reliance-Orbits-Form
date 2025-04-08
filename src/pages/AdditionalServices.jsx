import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';

const AdditionalServices = () => {
  const navigate = useNavigate();
  const { additionalServices, setAdditionalServices } = useBooking();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/booking-details');
  };
  
  const toggleService = (service) => {
    setAdditionalServices({
      ...additionalServices,
      [service]: !additionalServices[service]
    });
  };
  
  const addToMove = () => {
    // Implementation would depend on the specific items to be dismantled/assembled
    console.log("Add dismantling/reassembly service");
  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header title="Additional Services and Special Requirements" />
      <div className="bg-blue-600 text-white text-center py-2 text-sm font-medium">
        Our included insurance is twice the industry standard!
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-8 md:flex md:gap-8">
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Insurance Options */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center p-4 border rounded-lg bg-blue-50">
                <div className="text-green-600 text-xl font-bold mr-4">✓</div>
                <div className="flex-1">
                  <div className="font-semibold">Free Basic Compensation Cover</div>
                  <div className="text-sm text-gray-600">
                    Up to £50,000 for fire and theft and up to £100 per item compensation cover, in accordance with our T&Cs
                  </div>
                </div>
                <div className="text-green-600 font-medium">Included</div>
              </div>
              
              <div className="flex items-center p-4 border rounded-lg">
                <div className="text-blue-600 text-xl mr-4">🛡️</div>
                <div className="flex-1">
                  <div className="font-semibold">Comprehensive Insurance Cover</div>
                  <div className="text-sm text-gray-600">
                    The policy covers physical loss or damage to your goods whilst in transit including the risks of loading and unloading with cover provided up to £50,000.
                  </div>
                </div>
                <button type="button" className="px-4 py-2 text-sm text-blue-600 font-medium border border-blue-600 rounded-md hover:bg-blue-50">
                  Learn more and add
                </button>
              </div>
            </div>
            
            {/* Assembly Options */}
            <div className="border rounded-lg p-6 mb-8">
              <div className="mb-3">
                <h3 className="text-lg font-semibold">Dismantling & reassembly</h3>
              </div>
              
              <div className="text-gray-600 mb-4">
                Dismantling and assembly can be arranged per item. Just tell us how many items require this service and we'll do the rest!
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-semibold text-lg">£20</div>
                  <div className="text-gray-600">per item, to dismantle</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-lg">£30</div>
                  <div className="text-gray-600">per item, to assemble</div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button type="button" className="px-4 py-2 text-sm text-blue-600 font-medium border border-blue-600 rounded-md hover:bg-blue-50">
                  Learn more
                </button>
                <button 
                  type="button" 
                  onClick={addToMove} 
                  className="px-4 py-2 text-sm text-white font-medium bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add to your move
                </button>
              </div>
            </div>
            
            {/* Special Requirements */}
            <div className="mb-8">
              <div className="mb-3">
                <h3 className="text-lg font-semibold">Any special requirements or notes?</h3>
              </div>
              
              <textarea 
                placeholder="E.g. Parking available opposite property, sofa comes apart, slightly awkward entrance etc. The more information, the better! Please note: you will receive tracking prior to arrival" 
                value={additionalServices.specialRequirements}
                onChange={(e) => setAdditionalServices({...additionalServices, specialRequirements: e.target.value})}
                className="w-full p-3 border rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            {/* Form Actions */}
            <div className="flex justify-between">
              <button 
                type="button" 
                onClick={() => navigate('/date')} 
                className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-50"
              >
                Back
              </button>
              <button 
                type="submit" 
                className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Next Step
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

export default AdditionalServices;