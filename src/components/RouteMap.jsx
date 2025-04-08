import React from 'react';
import { useBooking } from '../context/BookingContext';

const RouteMap = () => {
  const { journey } = useBooking();
  
  return (
    <div className="relative rounded-lg overflow-hidden shadow-md bg-white">
      <div className="bg-gray-100 w-full">
        {/* This would be replaced with an actual map library */}
        <div className="relative">
          <img src="/api/placeholder/400/200" alt="Map showing route" className="w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-sm text-gray-500 bg-white/90 px-4 py-2 rounded-full shadow-sm">
              Interactive map view
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center text-sm font-medium p-3 bg-blue-50">
        <div className="flex items-center gap-1 text-blue-800">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <span>{journey.distance}</span>
        </div>
        <div className="flex items-center gap-1 text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>({journey.duration})</span>
        </div>
      </div>
    </div>
  );
};

export default RouteMap;