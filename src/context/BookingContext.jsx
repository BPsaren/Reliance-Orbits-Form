import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
    const [quoteRef] = useState('21631573');

    // Enhanced extra stops state with proper structure
    const [extraStops, setExtraStops] = useState([]);

    const [pickup, setPickup] = useState({
        location: '',
        floor: 0,
        liftAvailable: false,
        propertyType: '',
        postcode: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: '',
        contactName: '',
        contactPhone: '',
    });

    const [delivery, setDelivery] = useState({
        location: '',
        floor: 0,
        liftAvailable: false,
        propertyType: '',
        postcode: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        country: '',
        contactName: '',
        contactPhone: '',
    });

    const [items, setItems] = useState([]);
    const [selectedDate, setSelectedDate] = useState({
        date: '18 Apr',
        pickupTime:'',
        dropTime:'',
        price: 179,
        numberOfMovers: 0,
    });

    const [van, setVan] = useState({
        type: ''
    });

    const [piano, setPiano] = useState({
        type: '',
    });

    const [motorBike, setMotorBike] = useState({
        type: '',
        make: '',
        model: '',
        year: '',
        engineSize: ''
    });

    const [additionalServices, setAdditionalServices] = useState({
        basicCompensation: true,
        comprehensiveInsurance: false,
        dismantling: [],
        reassembly: [],
        specialRequirements: ''
    });

    const [customerDetails, setCustomerDetails] = useState({
        name: '',
        email: '',
        phone: '',
        isBusinessCustomer: false
    });

    const [journey, setJourney] = useState({
        distance: '',
        duration: '',
        route: ''
    });

    const [totalPrice, setTotalPrice] = useState(0);
    const [pickupAddressWithPostalCode, setpickupAddressWithPostalCode] = useState('');
    const [dropAddressWithPostalCode, setdropAddressWithPostalCode] = useState('');

    // Item management functions
    const addItem = (item) => {
        setItems([...items, { name: item, quantity: 1 }]);
    };

    const updateItemQuantity = (itemName, newQuantity) => {
        setItems(items.map(item =>
            item.name === itemName ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (itemName) => {
        setItems(items.filter(item => item.name !== itemName));
    };

    const toggleVanType = () => {
        const vanTypes = ['Small', 'Medium', 'Large', 'Luton'];
        const currentIndex = vanTypes.indexOf(van.type);
        const nextIndex = (currentIndex + 1) % vanTypes.length;
        setVan({ type: vanTypes[nextIndex] });
    };

    // Enhanced extra stop management functions
    const addExtraStop = (stop) => {
        setExtraStops([...extraStops, {
            address: stop.address,
            propertyType: stop.propertyType || '2 Bed House',
            floor: stop.floor || 'Ground floor',
            liftAvailable: stop.liftAvailable || false,
            
        }]);
    };

    const updateExtraStop = (index, updatedStop) => {
        setExtraStops(extraStops.map((stop, i) => 
            i === index ? { 
                ...stop,
                ...updatedStop,
                propertyType: updatedStop.propertyType !== undefined ? updatedStop.propertyType : stop.propertyType,
                floor: updatedStop.floor !== undefined ? updatedStop.floor : stop.floor,
                liftAvailable: updatedStop.liftAvailable !== undefined ? updatedStop.liftAvailable : stop.liftAvailable
            } : stop
        ));
    };

    const removeExtraStop = (index) => {
        setExtraStops(extraStops.filter((_, i) => i !== index));
    };

    return (
        <BookingContext.Provider value={{
            quoteRef,
            pickup, setPickup,
            delivery, setDelivery,
            items, setItems, addItem, updateItemQuantity, removeItem,
            selectedDate, setSelectedDate,
            piano, setPiano,
            motorBike, setMotorBike,
            additionalServices, setAdditionalServices,
            customerDetails, setCustomerDetails,
            journey, setJourney, 
            totalPrice, setTotalPrice,
            van, setVan, toggleVanType,
            pickupAddressWithPostalCode, setpickupAddressWithPostalCode,
            dropAddressWithPostalCode, setdropAddressWithPostalCode,
            // Enhanced extra stops management
            extraStops,
            setExtraStops,
            addExtraStop,
            updateExtraStop,
            removeExtraStop
        }}>
            {children}
        </BookingContext.Provider>
    );
};