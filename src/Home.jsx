import React from 'react'
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-teal-300 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-gray-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400 rounded-full opacity-25"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Get moving <span className="text-yellow-300">now!</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed font-light">
            Find a price that's right up your street, from the nation's favourite way to move
          </p>
        </div>

        {/* Trustpilot Section */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 max-w-md w-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">★</span>
                </div>
                <div>
                  <div className="text-green-600 font-bold text-lg">Trustpilot</div>
                  <div className="text-gray-600 text-sm">Excellent Rating</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl text-green-500 mb-1">★★★★★</div>
                <div className="text-gray-700 font-semibold">159,757 reviews</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {/* Home Removals Card */}
          <div 
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-4 border-transparent hover:border-yellow-300"
            onClick={() => navigate('/home-loc')}
          >
            <div className="relative overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-yellow-200 to-yellow-400 flex items-center justify-center">
                <div className="text-6xl">🏠</div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                Home Removals
              </h2>
              <div className="w-12 h-1 bg-yellow-400 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>
          
          {/* Furniture Removals Card */}
          <div 
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-4 border-transparent hover:border-yellow-300"
            onClick={() => navigate('/furniture-loc')}
          >
            <div className="relative overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-teal-200 to-teal-400 flex items-center justify-center">
                <div className="text-6xl">🪑</div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                Furniture Removals
              </h2>
              <div className="w-12 h-1 bg-yellow-400 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>
          
          {/* Piano Removals Card */}
          <div 
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-4 border-transparent hover:border-yellow-300"
            onClick={() => navigate('/piano-loc')}
          >
            <div className="relative overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-6xl">🎹</div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                Piano Removals
              </h2>
              <div className="w-12 h-1 bg-yellow-400 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>
          
          {/* Other Removals Card */}
          <div 
            className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-4 border-transparent hover:border-yellow-300"
            onClick={() => navigate('/other-removals')}
          >
            <div className="relative overflow-hidden">
              <div className="w-full h-48 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
                <div className="text-6xl">📦</div>
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
            </div>
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold text-gray-800 group-hover:text-teal-600 transition-colors">
                Other Removals
              </h2>
              <div className="w-12 h-1 bg-yellow-400 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/20">
            <p className="text-white/90 text-lg font-medium">
              Ready to move? Choose your service above and get started instantly!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home