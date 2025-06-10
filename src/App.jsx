import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

// Import Pages
import LocationForm from './pages/LocationForm';
import ItemsForm from './pages/ItemsForm';
import DateSelection from './pages/DateSelection';
import AdditionalServices from './pages/AdditionalServices';
import BookingDetails from './pages/BookingDetails';
import QuoteConfirmation from './pages/QuoteConfirmation';
import OtherRemovals from './pages/OtherRemovals';


// Import Context
import { BookingProvider } from './context/BookingContext';
import AddressDetailsForm from './pages/AddressDetailsForm';
import ItemCategoryForm from './pages/ItemCategoryForm';
import Home from './Home';
import PianoLocationForm from './pages/PianoLocationForm';
import MotorBikeLocationForm from './pages/MotorBikeLocationForm';
import PaymentFailed from './pages/PaymentFailed';
import PaymentSuccess from './pages/PaymentSuccess';

import Footer from './components/Footer';
import Nav from './Nav';




function App() {
  return (
    <BookingProvider>
      
      <Router>
        <div className="app-container">
      <Nav/>
          <Routes>
            <Route path="/" element={< Home />} />
            <Route path="/furniture-loc" element={<LocationForm />} />
            <Route path="/home-loc" element={<AddressDetailsForm />} />
            <Route path="/piano-loc" element={<PianoLocationForm prepath='/piano-loc' />} />
            <Route path="/items" element={<ItemsForm prepath="/items" />} />
            <Route path="/date" element={<DateSelection />} />
            <Route path="/items-home" element={<ItemCategoryForm prepath="/items-home" />} />
            <Route path="/additional-services" element={<AdditionalServices />} />
            <Route path="/booking-details" element={<BookingDetails />} />
            <Route path="/confirmation" element={<QuoteConfirmation />} />
            <Route path="/payment-failed" element={<PaymentFailed />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/other-removals" element={<OtherRemovals />} />
            <Route path="/motorbike-removals" element={<MotorBikeLocationForm prepath='/motorbike-removals' />} />

          </Routes>
        </div>
      </Router>
      <Footer />
    </BookingProvider>
  );
}
export default App;