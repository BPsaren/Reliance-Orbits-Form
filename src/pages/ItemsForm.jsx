import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';
import OrderSummary from '../components/OrderSummary';

const ItemsForm = (props) => {
  const navigate = useNavigate();
  const { items, addItem, updateItemQuantity, removeItem } = useBooking();
  const [newItemText, setNewItemText] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/date', { state: { prepath: props.prepath } });
  };
  
  const handleAddItem = () => {
    if (newItemText.trim()) {
      addItem(newItemText);
      setNewItemText('');
    }
  };
  

return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    {/* <Header title="What are you moving?" /> */}
    
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <h2 className="text-2xl font-bold flex items-center">
                <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Moving Items
              </h2>
              <p className="text-blue-100 mt-1">Tell us what you're moving to get accurate pricing</p>
            </div>

            <div className="p-6">
              {/* Add Item Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Items to Move</h3>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter your item(s) here e.g. Sofa" 
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="w-full pl-4 pr-14 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                  />
                  <button 
                    type="button" 
                    onClick={handleAddItem} 
                    className="absolute right-2 top-2 h-10 w-10 flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
                
                <div className="text-gray-600 text-sm mt-3 font-medium">
                  Or quickly add from our list of popular items below:
                </div>
              </div>
              
              {/* Popular Items Grid */}
              <div className="mb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm group text-sm"
                    onClick={() => addItem('Sofa')}
                  >
                    <span className="mr-2 text-lg group-hover:scale-110 transition-transform">🛋️</span> 
                    <span className="font-medium text-gray-700">Sofas</span>
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm group text-sm"
                    onClick={() => addItem('Wardrobe')}
                  >
                    <span className="mr-2 text-lg group-hover:scale-110 transition-transform">🪟</span> 
                    <span className="font-medium text-gray-700">Wardrobes</span>
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm group text-sm"
                    onClick={() => addItem('Box')}
                  >
                    <span className="mr-2 text-lg group-hover:scale-110 transition-transform">📦</span> 
                    <span className="font-medium text-gray-700">Boxes</span>
                  </button>
                  
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm group text-sm"
                    onClick={() => addItem('Bed')}
                  >
                    <span className="mr-2 text-lg group-hover:scale-110 transition-transform">🛏️</span> 
                    <span className="font-medium text-gray-700">Beds</span>
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm group text-sm"
                    onClick={() => addItem('Table')}
                  >
                    <span className="mr-2 text-lg group-hover:scale-110 transition-transform">🪑</span> 
                    <span className="font-medium text-gray-700">Tables</span>
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm group text-sm"
                    onClick={() => addItem('TV')}
                  >
                    <span className="mr-2 text-lg group-hover:scale-110 transition-transform">📺</span> 
                    <span className="font-medium text-gray-700">TVs</span>
                  </button>
                  
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm group text-sm"
                    onClick={() => addItem('Clothing')}
                  >
                    <span className="mr-2 text-lg group-hover:scale-110 transition-transform">👕</span> 
                    <span className="font-medium text-gray-700">Clothing</span>
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm group text-sm"
                    onClick={() => addItem('Chair')}
                  >
                    <span className="mr-2 text-lg group-hover:scale-110 transition-transform">🪑</span> 
                    <span className="font-medium text-gray-700">Chairs</span>
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-2.5 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 bg-white/50 backdrop-blur-sm group text-sm col-span-2 sm:col-span-1"
                    onClick={() => addItem('Custom')}
                  >
                    <span className="mr-2 text-lg group-hover:scale-110 transition-transform">➕</span> 
                    <span className="font-medium text-gray-700">Add Custom</span>
                  </button>
                </div>
              </div>
              
              {/* Items List */}
              <div className="border-t-2 border-gray-200 pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Item List
                  </h3>
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md">
                    {items.length} {items.length === 1 ? 'Item' : 'Items'}
                  </div>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {items.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="font-medium">No items added yet</p>
                      <p className="text-sm mt-1">Add items using the search bar or buttons above</p>
                    </div>
                  ) : (
                    items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200">
                        <div className="text-gray-800 font-medium">{item.name}</div>
                        <div className="flex items-center space-x-3">
                          <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
                            <button 
                              type="button" 
                              onClick={() => updateItemQuantity(item.name, Math.max(item.quantity - 1, 1))}
                              className="h-8 w-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-bold text-sm"
                            >
                              −
                            </button>
                            <span className="h-8 w-10 flex items-center justify-center bg-white text-gray-800 font-medium">
                              {item.quantity}
                            </span>
                            <button 
                              type="button" 
                              onClick={() => updateItemQuantity(item.name, item.quantity + 1)}
                              className="h-8 w-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 transition-colors text-gray-700 font-bold text-sm"
                            >
                              +
                            </button>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeItem(item.name)} 
                            className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/furniture-loc')} 
                className="flex items-center space-x-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                <span>Edit Job Info</span>
              </button>
              <button 
                type="submit" 
                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <span>Get Prices</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
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

export default ItemsForm;