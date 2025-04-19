import React from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-blue-700 p-8">
      <div className="container mx-auto grid grid-cols-2 h-screen">
        {/* Hero Section */}
        <div className="text-white mb-8 max-w-2xl flex flex-col justify-center">
          <h1 className="text-5xl font-bold mb-3">Get moving now!</h1>
          <p className="text-xl">Find a price that's right up your street, from the nation's favourite way to move</p>
          <img src='src\assets\truspilot.png' className='max-w-md mt-4 rounded-lg'></img>
        {/* Trustpilot Rating */}
        {/* <div className="bg-white rounded-lg p-4 flex items-center mb-8 max-w-md">
          <div className="mr-4">
            <span className="text-green-500 font-bold">★ Trustpilot</span>
          </div>
          <div className="flex-1 flex items-center">
            <span className="text-gray-700 font-medium mr-2">159,757</span>
            <div className="text-green-500 text-xl">★★★★★</div>
          </div>
        </div> */}
        </div>
        
        
        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Removals Card */}
          <div className="bg-white p-4 rounded-lg cursor-pointer" onClick={() => navigate('/home-loc')}>
            <div className="mb-2">
              <img 
                src="/api/placeholder/400/300" 
                alt="Living room with furniture" 
                className="w-full rounded-lg"
              />
            </div>
            <h2 className="text-red-500 text-2xl font-bold text-center">Home Removals</h2>
          </div>
          
          {/* Furniture Removals Card */}
          <div className="bg-white p-4 rounded-lg cursor-pointer" onClick={() => navigate('/furniture-loc')}>
            <div className="mb-2">
              <img 
                src="/api/placeholder/400/300" 
                alt="Various furniture items" 
                className="w-full rounded-lg"
              />
            </div>
            <h2 className="text-red-500 text-2xl font-bold text-center">Furniture Removals</h2>
          </div>
          
          {/* Piano Removals Card */}
          <div className="bg-white p-4 rounded-lg cursor-pointer" onClick={() => navigate('/piano-loc')}>
            <div className="mb-2">
              <img 
                src="/api/placeholder/400/300" 
                alt="Grand and upright pianos"
                className="w-full rounded-lg"
              />
            </div>
            <h2 className="text-red-500 text-2xl font-bold text-center">Piano Removals</h2>
          </div>
          
          {/* Other Removals Card */}
          <div className="bg-white p-4 rounded-lg cursor-pointer" onClick={() => navigate('/other-removals')}>
            <div className="mb-2">
              <img 
                src="/api/placeholder/400/300" 
                alt="Moving boxes stacked" 
                className="w-full rounded-lg"
              />
            </div>
            <h2 className="text-red-500 text-2xl font-bold text-center">Other Removals</h2>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home