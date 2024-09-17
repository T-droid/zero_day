import React, { useState } from "react";
import Header from "../components/Common/Header";
import Footer from "../components/Common/Footer";


function Orders() {
    const [activeSection, setActiveSection] = useState(null);

    const toggleSection = (section) => {
      setActiveSection(activeSection === section ? null : section);
    };
    
    return (
        <div>
            <Header />
            <div className="flex">
                <div>
                    <div>
                        <img src="#" alt="profile picture" />
                        <h2>My Account Name</h2>
                    </div>
                    <div className="flex flex-col">
                        <a href="#">My Account</a>
                        <a href="#">My Assets</a>
                        <a href="#">Return/Refund</a>
                        <a href="#">Wish List</a>
                        <a href="#">Recent views</a>
                        <a href="#">Message</a>
                        <a href="#">Chat with Sellers</a>
                    </div>
                </div>
                <div>
                <div className="bg-white shadow-md p-4 rounded-md w-80">
      {/* Section 1 */}
      <div>
        <button 
          onClick={() => toggleSection(1)} 
          className="w-full text-left font-bold text-blue-600"
        >
          Section 1
        </button>
        {activeSection === 1 && (
          <div className="p-4 border-t mt-2">
            <p>This is content for Section 1.</p>
          </div>
        )}
      </div>

      {/* Section 2 */}
      <div className="mt-4">
        <button 
          onClick={() => toggleSection(2)} 
          className="w-full text-left font-bold text-blue-600"
        >
          Section 2
        </button>
        {activeSection === 2 && (
          <div className="p-4 border-t mt-2">
            <p>This is content for Section 2.</p>
          </div>
        )}
      </div>

      {/* Section 3 */}
      <div className="mt-4">
        <button 
          onClick={() => toggleSection(3)} 
          className="w-full text-left font-bold text-blue-600"
        >
          Section 3
        </button>
        {activeSection === 3 && (
          <div className="p-4 border-t mt-2">
            <p>This is content for Section 3.</p>
          </div>
        )}
      </div>
    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Orders;