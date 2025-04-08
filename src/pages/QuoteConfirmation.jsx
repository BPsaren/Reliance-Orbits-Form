import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import RouteMap from '../components/RouteMap';

const QuoteConfirmation = () => {
  const navigate = useNavigate();
  const { 
    quoteRef, 
    pickup, 
    delivery, 
    items, 
    selectedDate, 
    additionalServices, 
    customerDetails, 
    journey, 
    totalPrice 
  } = useBooking();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Booking Confirmed!" />
      
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-green-50 rounded-lg p-6 text-center mb-6 shadow-sm">
          <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold shadow-md">✓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Thank you for your booking</h2>
          <p className="text-gray-600">We have sent a confirmation email to <span className="font-medium">{customerDetails.email}</span></p>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="border-b border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Your Booking Reference</h3>
            <div className="text-3xl font-bold text-blue-600 tracking-wide">{quoteRef}</div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium">A</div>
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-800">{pickup.location}</div>
                  <div className="text-sm text-gray-500">{pickup.floor}</div>
                </div>
              </div>
              
              <div className="flex items-center px-8 mb-6">
                <div className="border-l-2 border-dashed border-gray-300 h-16 mx-1"></div>
                <div className="ml-4 flex-1">
                  <div className="text-sm font-medium text-gray-500">Distance: <span className="text-gray-700">{journey.distance}</span></div>
                  <div className="text-sm font-medium text-gray-500">Duration: <span className="text-gray-700">{journey.duration}</span></div>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-medium">B</div>
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-800">{delivery.location}</div>
                  <div className="text-sm text-gray-500">{delivery.floor}</div>
                </div>
              </div>
            </div>
            
            <div className="h-56 bg-gray-100 rounded-lg mb-6 overflow-hidden">
              <RouteMap />
            </div>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-3 text-blue-600 text-xl">📅</div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Moving Date</div>
                <div className="font-medium text-gray-800">{selectedDate.date}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-3 text-purple-600 text-xl">👥</div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Service Level</div>
                <div className="font-medium text-gray-800">{selectedDate.numberOfMovers} Person Removal Service</div>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-700 mb-4">Items Summary</h4>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div className="font-medium text-gray-700">{item.name}</div>
                  <div className="bg-gray-100 px-3 py-1 rounded text-gray-600 text-sm">x{item.quantity}</div>
                </div>
              ))}
            </div>
          </div>
          
          {additionalServices.specialRequirements && (
            <div className="p-6 border-b border-gray-200">
              <h4 className="font-medium text-gray-700 mb-2">Special Requirements</h4>
              <div className="bg-gray-50 p-3 rounded text-gray-600 text-sm">
                {additionalServices.specialRequirements}
              </div>
            </div>
          )}
          
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <div className="font-semibold text-lg text-gray-700">Total Price</div>
              <div className="font-bold text-xl text-blue-600">£{totalPrice.toFixed(2)}</div>
            </div>
            <div className="text-right">
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Paid in full</span>
            </div>
          </div>
          
          <div className="p-6 border-b border-gray-200">
            <h4 className="font-medium text-gray-700 mb-4">What happens next?</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3 flex-shrink-0">📧</div>
                <div className="text-gray-600">Check your email for your booking confirmation</div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3 flex-shrink-0">📱</div>
                <div className="text-gray-600">You'll receive a call from our team to confirm details</div>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 rounded-full p-2 text-blue-600 mr-3 flex-shrink-0">🚚</div>
                <div className="text-gray-600">Your movers will arrive on <span className="font-medium">{selectedDate.date}</span> (exact time TBC)</div>
              </li>
            </ul>
          </div>
          
          <div className="p-6">
            <h4 className="font-medium text-gray-700 mb-4">Need help?</h4>
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-3 text-red-600 text-xl">📞</div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Customer Support</div>
                <div className="font-medium text-gray-800">0121 269 7956</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button 
            type="button" 
            onClick={() => window.print()} 
            className="bg-white border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
          >
            Print Confirmation
          </button>
          <button 
            type="button" 
            className="bg-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition" onClick={() => navigate('/')}
          >
            Book Another Move
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteConfirmation;