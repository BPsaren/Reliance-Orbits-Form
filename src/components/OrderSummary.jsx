import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useBooking } from '../context/BookingContext';
import RouteMap from './RouteMap';

const OrderSummary = () => {
  const [calculatedPrice, setCalculatedPrice] = useState(null);
  const {
    quoteRef,
    items,
    pickup,
    delivery,
    selectedDate,
    journey,
    setJourney,
    totalPrice,
    setTotalPrice,
    piano,
    van,
    motorBike,
    extraStops,
    removeExtraStop,
    itemsToAssemble,
    itemsToDismantle,
  } = useBooking();

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

  const kmToMiles = (kmString) => {
    const kmValue = parseFloat(kmString);
    const miles = kmValue * 0.621371;
    return `${miles.toFixed(2)} miles`;
  };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const payload = {
          pickupLocation: {
            location: pickup.location,
            floor: floorToNumber(pickup.floor),
            lift: pickup.liftAvailable
          },
          dropLocation: {
            location: delivery.location,
            floor: floorToNumber(delivery.floor),
            lift: delivery.liftAvailable
          },
          vanType: van.type,
          worker: selectedDate.numberOfMovers,
          itemsToDismantle:itemsToDismantle,
          itemsToAssemble:itemsToAssemble,
          stoppage:extraStops.map(item => item.address)
        };

        const res = await axios.post('https://orbit-0pxd.onrender.com/price', payload);
        setTotalPrice(res.data.price);
        console.log(payload);
      } catch (err) {
        console.error("Price fetch error:", err);
      }
    };

    fetchPrice();
  }, [pickup, delivery, van, selectedDate, itemsToDismantle,itemsToAssemble, extraStops]);

  useEffect(() => {
    const fetchDistance = async () => {
      try {
        const res = await axios.post('https://orbit-0pxd.onrender.com/distance', {
          origin: pickup.location,
          destination: delivery.location
        });

        const element = res.data.rows[0].elements[0];
        const distanceText = element.distance.text;
        const distanceInMiles = kmToMiles(distanceText);
        const durationText = element.duration.text;

        setJourney(prev => ({
          ...prev,
          distance: distanceInMiles,
          duration: durationText
        }));
      } catch (err) {
        console.error("Distance fetch error:", err);
      }
    };

    fetchDistance();
  }, [pickup.location, delivery.location]);

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
              <div className="text-gray-900">{item.quantity}</div>
            </div>
          ))}

          {motorBike.type && (
            <div className="flex justify-between items-center">
              <div className="text-gray-900">Motor Bike ({motorBike.type})</div>
            </div>
          )}

          {piano.type !== '' && (
            <div className="flex justify-between items-center border-b border-gray-100 pb-2">
              <span className="text-gray-600 text-sm font-medium">Piano Type</span>
              <span className="text-gray-600">{piano.type}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Floors</span>
          <span className="text-gray-600 text-xs">{pickup.floor} to {delivery.floor}</span>
        </div>

        {pickup.propertyType !== '' && (
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm font-medium">Pickup Property Type</span>
            <span className="text-gray-600">{pickup.propertyType}</span>
          </div>
        )}

        {delivery.propertyType !== '' && (
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm font-medium">Delivery Property Type</span>
            <span className="text-gray-600">{delivery.propertyType}</span>
          </div>
        )}

        {motorBike.type && (
          <div className="flex justify-between items-center border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm font-medium">Motor Bike</span>
            <span className="text-gray-600 text-xs">{motorBike.type}</span>
          </div>
        )}

        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Loading / Unloading</span>
          <span className="text-gray-600 text-xs">{selectedDate.numberOfMovers} Person</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Date</span>
          <span className="text-gray-600 text-xs">{selectedDate.date}</span>
        </div>

        <div className="border-b border-gray-100 pb-2">
          <div className="flex flex-col">
            <span className="text-gray-600 text-sm font-medium">Pickup Location</span>
            <span className="text-gray-600 text-xs mt-1">{pickup.location}</span>
            <span className="text-gray-600 text-xs mt-1 font-medium">Door No/flat No: {pickup.flatNo}</span>
        
            <span className="text-gray-600 text-xs mt-1">Lift: {pickup.liftAvailable ? 'Available' : 'Not Available'}</span>
          </div>
        </div>

        <div className="border-b border-gray-100 pb-2">
          <div className="flex flex-col">
            <span className="text-gray-600 text-sm font-medium">Delivery Location</span>
            <span className="text-gray-600 text-xs mt-1">{delivery.location}</span>
            <span className="text-gray-600 text-xs mt-1 font-medium">Door No/flat No: {delivery.flatNo}</span>
            <span className="text-gray-600 text-xs mt-1">Lift: {delivery.liftAvailable ? 'Available' : 'Not Available'}</span>
          </div>
        </div>

        {/* Enhanced Extra Stops Section */}
        <div className="space-y-2 border-b border-gray-100 pb-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm font-medium">Extra Stops</span>
            <span className="text-gray-600 text-xs">
              
            </span>
          </div>
          
          {extraStops.map((stop, index) => (
            <div key={index} className="group hover:bg-gray-50 rounded -mx-2 px-2 py-2 border-b border-gray-100 last:border-0">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-gray-600 text-xs font-medium truncate">
                    Stop {index + 1}: {stop.address}
                    
                  </p>
                  <p className="text-gray-600 text-xs font-medium truncate">
                    Door No/flat No:{stop.doorFlatNo}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>Property: {stop.propertyType}</span>
                    <span>Floor: {stop.floor}</span>
                    <span>Lift: {stop.liftAvailable ? 'Available' : 'Not available'}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeExtraStop(index)}
                  className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                  aria-label="Remove stop"
                  title="Remove stop"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm font-medium">Vans</span>
          <span className="text-gray-900">{van.type}</span>
        </div>
      </div>

      <div className="bg-blue-50 p-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Total price</span>
          <span className="text-2xl font-bold text-blue-900">
            {totalPrice !== null ? `£${totalPrice.toFixed(2)}` : 'Calculating...'}
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