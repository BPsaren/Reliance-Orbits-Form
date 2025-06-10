import React from 'react';
import { useBooking } from '../context/BookingContext';


const Header = ({ title }) => {
  const { quoteRef } = useBooking();
  
  return (
    <div>
    {/* <Navbar/> */}
    <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
      <div className="flex-1">
        <h1 className="text-2xl font-bold text-blue-900">{title}</h1>
      </div>
      <div className="flex flex-col items-end">
        {/* <div className="text-sm text-gray-600 font-medium">Quote ref: <span className="text-blue-600">{quoteRef}</span></div> */}
        {/* <div className="text-lg font-bold text-blue-700">0121 269 7956</div> */}
      </div>
    </div>
    </div>
  );
};

export default Header;