import React from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
  return (
    <div className='h-screen flex justify-center items-center'>
                        <button 
                  type="button" 
                  onClick={() => navigate('/furniture-loc')}
                  className="p-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium m-5"
                >
                  Furnitures
                </button>

                <button 
                  type="button"
                  onClick={() => navigate('/home-loc')} 
                  className="p-6  bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium m-5"
                >
                  Home Removals
                </button>

                <button 
                  type="button"
                  onClick={() => navigate('/car-loc')} 
                  className="p-6  bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium m-5"
                >
                  Cars
                </button>
    </div>
  )
}

export default Home