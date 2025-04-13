import React, { createContext, useState, useContext } from 'react';

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

const [data, setData] = useState(null); // state to hold API data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null); // error state

//   useEffect(() => {
//     axios.get('https://api.example.com/data')
//       .then(response => {
//         setData(response.data);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err);
//         setLoading(false);
//       });
//   }, []); 


export const BookingProvider = ({ children }) => {
    const [quoteRef] = useState('21631573');
    const [pickup, setPickup] = useState({
        location: '418 Birmingham Rd, The Royal Tr',
        floor: '',
        liftAvailable: false,
        propertyType:''
    });
    const [delivery, setDelivery] = useState({
        location: 'Bristol, UK',
        floor: '',
        propertyType:''
    });
    const [items, setItems] = useState([
        // { name: 'Armchair', quantity: 1 },
        // { name: 'Large Box', quantity: 1 },
        // { name: 'Double Wardrobe', quantity: 1 }
    ]);
    const [selectedDate, setSelectedDate] = useState({
        date: '18 Apr',
        price: 179,
        numberOfMovers: 1,
    });

    const [van, setVan] = useState({
        type: 'Small'
    });

    const [piano, setPiano] = useState({
        type: '',
        
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
        email: 'rrg.030303@gmail.com',
        phone: '',
        isBusinessCustomer: false
    });
    const [journey, setJourney] = useState({
        distance: '97 miles',
        duration: '2h 3min',
        route: 'B72 to Bristol'
    });

    // Calculate total price
    const totalPrice = 179; // Base price from screenshots

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
        const vanTypes = ['Small', 'Medium', 'Large', 'Luton Van'];
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
            additionalServices, setAdditionalServices,
            customerDetails, setCustomerDetails,
            journey, totalPrice,
            van, setVan, toggleVanType,
        }}>
            {children}
        </BookingContext.Provider>
    );
};