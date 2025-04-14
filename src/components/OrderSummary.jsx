import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useBooking } from '../context/BookingContext';
import RouteMap from './RouteMap';

const OrderSummary = () => {



  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const { quoteRef, items, pickup, delivery, selectedDate, journey, totalPrice, piano, van } = useBooking();

  const floorToNumber = (floor) => {
    const map = {
      "Ground floor": 0,
      "1st floor": 1,
      "2nd floor": 2,
      "3rd floor": 3,
      "4th floor": 4,
      "5th floor +": 5
    };
    return typeof floor === 'string' ? map[floor] ?? 0 : floor;
  };
  

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await axios.post('https://reliance-orbit.onrender.com/price', {
            pickupLocation: {
              location: pickup.location,
              floor: floorToNumber(pickup.floor),
              lift: pickup.liftAvailable
            },
            dropLocation: {
              location: delivery.location,
              floor: floorToNumber(delivery.floor)
            },
            vanType: van.type,
            extraWorker: selectedDate.numberOfMovers

          });
        //   pickupLocation: {
        //     location: 'London',
        //     floor: 1,
        //     lift: true
        //   },
        //   dropLocation: {
        //     location: 'Birmingham',
        //     floor: 2
        //   },
        //   vanType: 'Medium',
        //   extraWorker: 2
        // });


        setCalculatedPrice(res.data.price);
      } catch (err) {
        console.error("Price fetch error:", err);
      }
    };

    fetchPrice();
  }, [pickup, delivery, van, selectedDate]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full md:w-96 flex-shrink-0">
      <div className="p-4">
        <RouteMap />
      </div>

      <div className="p-4 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Your Reference</span>
          <span className="text-gray-900 font-semibold">{quoteRef}</span>
        </div>

        <div className="space-y-2 border-b border-gray-100 pb-4">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between items-center">
              <div className="text-gray-900">{item.name}</div>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">edit</button>
            </div>
          ))}


          {piano.type != '' ? <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm font-medium">Piano Type</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-900">{piano.type}</span>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">edit</button>
            </div>
          </div> : null}

        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Floors</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{pickup.floor} to {delivery.floor}</span>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">edit</button>
          </div>
        </div>


        {pickup.propertyType != '' ? <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Pickup Property Type</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{pickup.propertyType}</span>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">edit</button>
          </div>
        </div> : null}

        {delivery.propertyType != '' ? <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Delivery Property Type</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{delivery.propertyType}</span>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">edit</button>
          </div>
        </div> : null}


        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Loading / Unloading</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{selectedDate.numberOfMovers} Person</span>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">edit</button>
          </div>
        </div>



        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Pickup</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{selectedDate.date}</span>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">edit</button>
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Locations</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{pickup.location} to {delivery.location}</span>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">edit</button>
          </div>
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Vans</span>
          <div className="flex items-center gap-2">
            <span className="text-gray-900">{van.type}</span>
            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">edit</button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total price</span>
          <span className="text-2xl font-bold text-blue-900">
            {calculatedPrice !== null ? `£${calculatedPrice.toFixed(2)}` : 'Calculating...'}
          </span>

        </div>

        <div className="mt-2">
          <div className="bg-green-100 text-green-800 text-sm font-medium py-1 px-2 rounded-md inline-flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            42% saving vs other companies
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-start space-x-2">
          <div className="text-green-600 mt-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="text-sm text-gray-700">
            Money Back Guarantee & Free Cancellation! <a href="#" className="text-blue-600 hover:underline font-medium">Learn more</a>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 flex items-center justify-center space-x-4">
        <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600">VISA</span>
        </div>
        <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600">MC</span>
        </div>
        <div className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center">
          <span className="text-xs font-bold text-gray-600">MTRO</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;