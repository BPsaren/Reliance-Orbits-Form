import React from 'react';
import { useNavigate } from 'react-router-dom';

function OtherRemovals() {
  const navigate = useNavigate();

  // Categories data with icons and descriptions
  const categories = [
    {
      title: "Motorbikes",
      description: "Cruisers, sportsters, scooters...",
      route: "/motorbike-removals"
    },

    {
      title: "Parcels & Packages",
      description: "Of all sizes & shapes...",
      route: "/parcel-removals"
    },
    {
      title: "Specialist & Antiques",
      description: "Glass cabinets, ornaments...",
      route: "/specialist-removals"
    },
    {
      title: "Vehicle Parts",
      description: "Engines, tyres, body parts...",
      route: "/vehicle-parts-removals"
    },
    {
      title: "Freight",
      description: "Pallets, shipments, loads...",
      route: "/freight-removals"
    },
    {
      title: "Boats",
      description: "Yachts, fishing boats, canoes...",
      route: "/boat-removals"
    },
    {
      title: "Office Removals",
      description: "Desks, computers, chairs...",
      route: "/office-removals"
    },
    {
      title: "Clearance",
      description: "Rubbish, waste disposal...",
      route: "/clearance-removals"
    },
    {
      title: "Industrial",
      description: "Machinery, materials...",
      route: "/industrial-removals"
    },
    {
      title: "Livestock",
      description: "Pets, farm animals...",
      route: "/livestock-transport"
    },
    {
      title: "Man Power Only",
      description: "No van needed!",
      route: "/manpower-service"
    }
  ];

  // Function to get the appropriate icon JSX based on category title
  const getCategoryIcon = (title) => {
    switch (title) {
      case "Motorbikes":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,4c-3.9,0-7,3.1-7,7s3.1,7,7,7s7-3.1,7-7S15.9,4,12,4z M8,12c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S8.6,12,8,12z M12,15c-1.7,0-3-1.3-3-3s1.3-3,3-3s3,1.3,3,3S13.7,15,12,15z M16,12c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S16.6,12,16,12z" />
            <path d="M12,2c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S11.4,2,12,2z M19,11c0,0.6-0.4,1-1,1s-1-0.4-1-1s0.4-1,1-1S19,10.4,19,11z M5,11c0,0.6-0.4,1-1,1s-1-0.4-1-1s0.4-1,1-1S5,10.4,5,11z M12,19c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S12.6,19,12,19z" />
          </svg>
        );

      case "Parcels & Packages":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z M12,6l-4,4h2.5v4h3v-4H16L12,6z" />
          </svg>
        );
      case "Specialist & Antiques":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,4H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V6C22,4.9,21.1,4,20,4z M20,18H4V6h16V18z M6,10h2v2H6V10z M10,10h8v2h-8V10z M6,14h2v2H6V14z M10,14h8v2h-8V14z" />
          </svg>
        );
      case "Vehicle Parts":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="12" r="8" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
        );
      case "Freight":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,8h-3V4H3C1.9,4,1,4.9,1,6v11h2c0,1.7,1.3,3,3,3s3-1.3,3-3h6c0,1.7,1.3,3,3,3s3-1.3,3-3h2v-5L20,8z M6,19.5c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S6.8,19.5,6,19.5z M18,19.5c-0.8,0-1.5-0.7-1.5-1.5s0.7-1.5,1.5-1.5s1.5,0.7,1.5,1.5S18.8,19.5,18,19.5z M17,12V9.5h2.5l1.5,2.5H17z" />
          </svg>
        );
      case "Boats":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,21c-1.4,0-2.8-0.3-4-0.9c-2.5,1.2-5.5,1.2-8,0C6.8,20.7,5.4,21,4,21H2v2h2c1.4,0,2.7-0.3,4-0.7c2.5,1,5.5,1,8,0c1.3,0.4,2.6,0.7,4,0.7h2v-2H20z M3.2,15.1L4,17c0.7,0,1.4,0,2,0.1l0.1-0.8C4.9,16,3.8,15.6,3.2,15.1z M7,8.8L8,9.1V7H7V8.8z M11,15.8l-2,0.6v-5l2-0.6V15.8z M13,15.2l2-0.6v-5l-2-0.6V15.2z M17,7v2.1l1-0.3l0.7,7.9C20,16,21,15.5,21.3,15L17,7z M15,7v5l5,1.5l-4-6.5H15z M9,7v5H4l5-5H9z" />
          </svg>
        );
      case "Office Removals":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20,6h-4V4c0-1.1-0.9-2-2-2h-4C8.9,2,8,2.9,8,4v2H4C2.9,6,2,6.9,2,8v11c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M10,4h4v2h-4V4z M20,19H4v-6h5v2h6v-2h5V19z M20,11h-5v-2H9v2H4V8h16V11z" />
          </svg>
        );
      case "Clearance":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M16,6v4l4-4v12l-4-4v4H4V6H16 M18,4H2v16h16v-5l4,4V5l-4,4V4L18,4z" />
            <path d="M7.5,13h9v2h-9V13z M7.5,9h9v2h-9V9z" />
          </svg>
        );
      case "Industrial":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,9h-4V4H9v5H5l7,7L19,9z M5,18v2h14v-2H5z" />
          </svg>
        );
      case "Livestock":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="4.5" cy="9.5" r="2.5" />
            <circle cx="9" cy="5.5" r="2.5" />
            <circle cx="15" cy="5.5" r="2.5" />
            <circle cx="19.5" cy="9.5" r="2.5" />
            <path d="M17.34,14.86c-0.87-1.02-1.6-1.89-2.48-2.91c-0.46-0.54-1.05-1.08-1.75-1.32c-0.11-0.04-0.22-0.07-0.33-0.09c-0.25-0.04-0.52-0.04-0.78-0.04s-0.53,0-0.79,0.05c-0.11,0.02-0.22,0.05-0.33,0.09c-0.7,0.24-1.28,0.78-1.75,1.32c-0.87,1.02-1.6,1.89-2.48,2.91c-1.31,1.31-2.92,2.76-2.62,4.79c0.29,1.02,1.02,2.03,2.33,2.32c0.73,0.15,3.06-0.44,5.54-0.44h0.18c2.48,0,4.81,0.58,5.54,0.44c1.31-0.29,2.04-1.31,2.33-2.32C20.26,17.62,18.65,16.17,17.34,14.86z" />
          </svg>
        );
      case "Man Power Only":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="4" r="2" />
            <path d="M15,22v-5h-2v-4.5c0-0.73-0.59-1.32-1.3-1.35C10.86,11.11,10,11.93,10,12.77V17H8v5H6V13l0.8-2.4C7.15,9.73,8.33,9,9.67,9H14.3c0.86,0,1.65,0.53,1.96,1.33l0.74,1.87V22H15z M15,7c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S15.55,7,15,7z" />
          </svg>
        );
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto text-blue-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z M12,6l-4,4h2.5v4h3v-4H16L12,6z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-blue-700 p-8">
      <div className="container mx-auto">
        {/* Back button */}
        <button 
          onClick={() => navigate('/')} 
          className="bg-white text-blue-700 font-bold py-2 px-4 rounded mb-6 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </button>
        
        {/* Page title */}
        <h1 className="text-3xl font-bold text-white mb-8">Other Removal Services</h1>
        
        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-all"
              onClick={() => navigate(category.route)}
            >
              <div className="mb-4">
                {getCategoryIcon(category.title)}
              </div>
              <h2 className="text-blue-500 text-xl font-bold text-center mb-2">{category.title}</h2>
              <p className="text-gray-500 text-center">{category.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OtherRemovals;