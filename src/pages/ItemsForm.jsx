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
    <div className="min-h-screen bg-gray-50">
      <Header title="What are you moving?" />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="mb-6">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Enter your item(s) here e.g. Sofa" 
                      value={newItemText}
                      onChange={(e) => setNewItemText(e.target.value)}
                      className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddItem} 
                      className="absolute right-1 top-1 h-8 w-10 flex items-center justify-center bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-gray-600 text-sm mt-4 font-medium">
                    Or quickly add from our list of popular items below:
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => addItem('Sofa')}
                  >
                    <span className="mr-2">🛋️</span> Sofas
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => addItem('Wardrobe')}
                  >
                    <span className="mr-2">🪟</span> Wardrobes
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => addItem('Box')}
                  >
                    <span className="mr-2">📦</span> Boxes
                  </button>
                  
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => addItem('Bed')}
                  >
                    <span className="mr-2">🛏️</span> Beds & Mattresses
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => addItem('Table')}
                  >
                    <span className="mr-2">🪑</span> Tables
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => addItem('TV')}
                  >
                    <span className="mr-2">📺</span> Televisions
                  </button>
                  
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => addItem('Clothing')}
                  >
                    <span className="mr-2">👕</span> Clothing
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => addItem('Chair')}
                  >
                    <span className="mr-2">🪑</span> Chairs
                  </button>
                  <button 
                    type="button" 
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-blue-50 hover:border-blue-200"
                    onClick={() => addItem('Custom')}
                  >
                    <span className="mr-2">➕</span> Add Your Own Item
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">My Item List ({items.length})</h3>
                  
                  <div className="space-y-3">
                    {items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
                        <div className="text-gray-800 font-medium">{item.name}</div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            <button 
                              type="button" 
                              onClick={() => updateItemQuantity(item.name, Math.max(item.quantity - 1, 1))}
                              className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
                            >-</button>
                            <span className="h-8 w-10 flex items-center justify-center border-t border-b border-gray-300 bg-white text-gray-800">
                              {item.quantity}
                            </span>
                            <button 
                              type="button" 
                              onClick={() => updateItemQuantity(item.name, item.quantity + 1)}
                              className="h-8 w-8 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
                            >+</button>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeItem(item.name)} 
                            className="text-gray-500 hover:text-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <button 
                  type="button" 
                  onClick={() => navigate('/furniture-loc')} 
                  className="px-4 py-2 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  Edit Job Info
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  Get Prices
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