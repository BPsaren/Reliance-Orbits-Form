import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import Pages
import LocationForm from './pages/LocationForm';
import ItemsForm from './pages/ItemsForm';
import DateSelection from './pages/DateSelection';
import AdditionalServices from './pages/AdditionalServices';
import BookingDetails from './pages/BookingDetails';
import QuoteConfirmation from './pages/QuoteConfirmation';

// Import Context
import { BookingProvider } from './context/BookingContext';
import AddressDetailsForm from './pages/AddressDetailsForm';
import ItemCategoryForm from './pages/ItemCategoryForm';
import Home from './Home';
import PianoLocationForm from './pages/PianoLocationForm';


function App() {
  return (
    <BookingProvider>
      <Router>
        <div className="app-container">
          <Routes>
          <Route path="/" element={< Home/>} />
            <Route path="/furniture-loc" element={<LocationForm />} />
            <Route path="/home-loc" element={<AddressDetailsForm />} />
            <Route path="/piano-loc" element={<PianoLocationForm />} />
            <Route path="/items" element={<ItemsForm />} />
            <Route path="/date" element={<DateSelection />} />
            <Route path="/items-home" element={<ItemCategoryForm prepath="/home-loc"/>} />
            <Route path="/additional-services" element={<AdditionalServices />} />
            <Route path="/booking-details" element={<BookingDetails />} />
            <Route path="/confirmation" element={<QuoteConfirmation />} />
          </Routes>
        </div>
      </Router>
    </BookingProvider>
  );
}
export default App;