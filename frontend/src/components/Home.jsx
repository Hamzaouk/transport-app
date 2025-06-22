import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {/* Minimal Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-8 shadow-lg">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">TransportConnect</span>
          </h1>
          <p className="text-gray-600 text-xl leading-relaxed max-w-3xl mx-auto mb-12 font-medium">
            Enterprise-grade logistics platform connecting shippers with certified carriers worldwide
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Get Started
            </a>
            
            <a
              href="/login"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-700 font-semibold text-lg rounded-lg transition-all duration-300 border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Sign In
            </a>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {/* Feature 1 */}
          <div className="group bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-3 text-center border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Secure Logistics</h3>
            <p className="text-gray-500 leading-relaxed">
              All carriers are verified and insured. Track your cargo with real-time monitoring and security protocols.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="group bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-3 text-center border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Freight Management</h3>
            <p className="text-gray-500 leading-relaxed">
              Comprehensive cargo handling from pickup to delivery with documentation and customs support.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="group bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-3 text-center border border-gray-100">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors duration-300">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Analytics & Reports</h3>
            <p className="text-gray-500 leading-relaxed">
              Advanced logistics analytics with route optimization and cost analysis for better decision making.
            </p>
          </div>
        </div>

        {/* How it Works Section */}
        <div className="bg-white rounded-xl p-12 shadow-md border border-gray-100 mb-20">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-16">Our Process</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* For Shippers */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <svg className="w-8 h-8 mr-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
                For Shippers
              </h3>
              <div className="space-y-8">
                {[
                  {title: "Create Shipment", desc: "Post your cargo details, pickup location, and delivery requirements with our intuitive interface."},
                  {title: "Choose Carrier", desc: "Review proposals from verified carriers and select the best offer based on price, timeline, and ratings."},
                  {title: "Track & Deliver", desc: "Monitor your shipment in real-time with GPS tracking until safe delivery and confirmation."}
                ].map((item, index) => (
                  <div key={`shipper-${index}`} className="flex items-start group">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold mr-6 mt-1 group-hover:bg-blue-100 transition-colors duration-300">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-gray-800 font-semibold text-lg mb-2">{item.title}</h4>
                      <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* For Carriers */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
                <svg className="w-8 h-8 mr-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                For Carriers
              </h3>
              <div className="space-y-8">
                {[
                  {title: "Register Fleet", desc: "Verify your vehicles, drivers, and insurance documentation through our secure verification process."},
                  {title: "Bid on Loads", desc: "Browse available shipments and submit competitive proposals with your pricing and timeline."},
                  {title: "Transport & Earn", desc: "Execute shipments efficiently and build your reputation while earning competitive rates."}
                ].map((item, index) => (
                  <div key={`carrier-${index}`} className="flex items-start group">
                    <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 font-bold mr-6 mt-1 group-hover:bg-indigo-100 transition-colors duration-300">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-gray-800 font-semibold text-lg mb-2">{item.title}</h4>
                      <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {[
            {value: "2500+", label: "Active Shippers", color: "text-blue-600"},
            {value: "800+", label: "Verified Carriers", color: "text-indigo-600"},
            {value: "50k+", label: "Completed Shipments", color: "text-purple-600"},
            {value: "98%", label: "On-Time Delivery", color: "text-green-600"}
          ].map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-8 shadow-md text-center border border-gray-100 hover:shadow-lg transition-shadow duration-300">
              <div className={`text-4xl font-bold ${stat.color} mb-3`}>{stat.value}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-16 shadow-2xl text-center">
          <h3 className="text-3xl font-bold text-white mb-8">Ready to Optimize Your Logistics?</h3>
          <p className="text-blue-100 text-xl leading-relaxed mb-12 max-w-3xl mx-auto font-medium">
            Join thousands of businesses who trust LogiChain for their freight transportation needs and experience the future of logistics.
          </p>
          <a
            href="/register"
            className="inline-flex items-center px-12 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Join Now - It's Free
          </a>
        </div>
      </main>
    </div>
  );
};

export default Home;