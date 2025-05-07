import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
    const [quoteRef] = useState('21631573');


    const [pickup, setPickup] = useState({
        location: '',
        floor: 0,
        liftAvailable: false,
        propertyType:'',
        postcode:'',
        addressLine1:'',
        addressLine2:'',
        city:'',
        country:'',
        contactName:'',
        contactPhone:'',
            


    });
    const [delivery, setDelivery] = useState({
        location: '',
        floor: 0,
        liftAvailable: false,
        propertyType:'',
        postcode:'',
        addressLine1:'',
        addressLine2:'',
        city:'',
        country:'',
        contactName:'',
        contactPhone:'',
    });
    const [items, setItems] = useState([
        // { name: 'Armchair', quantity: 1 },
        // { name: 'Large Box', quantity: 1 },
        // { name: 'Double Wardrobe', quantity: 1 }
    ]);
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

    // New state for motor bike
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
    // Calculate total price
    
    const [pickupAddressWithPostalCode, setpickupAddressWithPostalCode] = useState('')
    const [dropAddressWithPostalCode, setdropAddressWithPostalCode] = useState('')
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

    return (
        <BookingContext.Provider value={{
            quoteRef,
            pickup, setPickup,
            delivery, setDelivery,
            items, setItems, addItem, updateItemQuantity, removeItem,
            selectedDate, setSelectedDate,
            piano, setPiano,
            motorBike, setMotorBike, // New motor bike state
            additionalServices, setAdditionalServices,
            customerDetails, setCustomerDetails,
            journey,setJourney, totalPrice, setTotalPrice,
            van, setVan, toggleVanType,
            pickupAddressWithPostalCode, setpickupAddressWithPostalCode,
            dropAddressWithPostalCode, setdropAddressWithPostalCode,
        }}>
            {children}
        </BookingContext.Provider>
    );
};