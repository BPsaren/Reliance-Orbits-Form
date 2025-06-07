import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useBooking } from '../context/BookingContext';

const PaymentSuccess = () => {

    const [searchParams] = useSearchParams();   
    const sessionId = searchParams.get('session_id');

    // const [local, setLocal] = useState('');

    const navigate = useNavigate();
    const {
        bookingRef, setBookingRef,
        quoteRef, setQuoteRef,
        setCustomerDetails, customerDetails,
        setPickup, pickup,
        setDelivery, delivery,
        setSelectedDate, selectedDate,
        setItems, items,
        setJourney, journey,
        setTotalPrice, totalPrice,
        setVan, van,
        setAdditionalServices, additionalServices,
        extraStops, setExtraStops,
        motorBike, piano, setPiano,
        itemsToAssemble, itemsToDismantle,
        setItemsToAssemble, setItemsToDismantle,
    } = useBooking();

    // let called = false;
    // const [effectCalled, setEffectCalled] = useState(false);
    const date = localStorage.getItem('dateToken');
    const time = localStorage.getItem('timeToken');
    const worker = localStorage.getItem('workerToken');

    // Use useRef to persist the flag across renders
    const effectCalled = useRef(false); //

    useEffect(() => {

        // if (effectCalled) return;
        // setEffectCalled(true);

        // if (called) return;
        // called = true;

        if (effectCalled.current) return; //
        effectCalled.current = true; // Mark as called

        // if (!sessionId || hasSent.current) return;

        // hasSent.current = true; // mark as run
        // In PaymentSuccess.jsx, replace the fetchSession function with this fixed version:

        const fetchSession = async () => {
            try {
                const res = await axios.get(`https://payment-gateway-reliance.onrender.com/checkout-session/${sessionId}`);
                const session = res.data;
                const m = session.metadata;

                // Set individual fields from metadata
                setQuoteRef(m.quoteRef);

                const customerData = {
                    name: m.username || '',
                    email: m.email || '',
                    phone: m.phoneNumber || '',
                    isBusinessCustomer: m.isBusinessCustomer === 'true'
                };
                setCustomerDetails(customerData);

                setJourney({
                    distance: m.distance || '',
                    duration: m.duration || '',
                    route: m.route || 'default route'
                });

                const pickupData = {
                    location: m.plocation || pickup.location,
                    floor: parseInt(m.pfloor) || pickup.floor,
                    liftAvailable: m.plift === 'true',
                    propertyType: m.ppropertyType || pickup.propertyType,
                    postcode: m.ppostcode || pickup.postcode,
                    addressLine1: m.paddressLine1 || pickup.addressLine1,
                    addressLine2: m.paddressLine2 || pickup.addressLine2,
                    city: m.pcity || pickup.city,
                    country: m.pcountry || pickup.country,
                    flatNo: m.pflatNo || pickup.flatNo,
                    contactName: m.pcontactName || pickup.contactName,
                    contactPhone: m.pcontactPhone || pickup.contactPhone
                };
                setPickup(pickupData);

                const deliveryData = {
                    location: m.dlocation || delivery.location,
                    floor: parseInt(m.dfloor) || delivery.floor,
                    liftAvailable: m.dlift === 'true',
                    propertyType: m.dpropertyType || delivery.propertyType,
                    postcode: m.dpostcode || delivery.postcode,
                    addressLine1: m.daddressLine1 || delivery.addressLine1,
                    addressLine2: m.daddressLine2 || delivery.addressLine2,
                    city: m.dcity || delivery.city,
                    country: m.dcountry || delivery.country,
                    flatNo: m.dflatNo || delivery.flatNo,
                    contactName: m.dcontactName || delivery.contactName,
                    contactPhone: m.dcontactPhone || delivery.contactPhone
                };
                setDelivery(deliveryData);

                // Parse arrays if they exist in metadata
                let parsedItems = [];
                if (m.items) {
                    try {
                        parsedItems = JSON.parse(m.items);
                        console.log("Successfully parsed items:", parsedItems);
                    } catch (parseError) {
                        console.error("Error parsing items:", parseError);
                        parsedItems = items;
                    }
                } else {
                    console.log("No items found in metadata, using existing state");
                    parsedItems = items;
                }
                setItems(parsedItems);

                let parsedExtraStops = [];
                if (m.extraStops) {
                    try {
                        parsedExtraStops = JSON.parse(m.extraStops);
                        console.log("Successfully parsed extra stops:", parsedExtraStops);
                    } catch (parseError) {
                        console.error("Error parsing extra stops:", parseError);
                        parsedExtraStops = extraStops;
                    }
                } else {
                    console.log("No extra stops found in metadata, using existing state");
                    parsedExtraStops = extraStops;
                }
                setExtraStops(parsedExtraStops);

                // CREATE THE UPDATED DATE OBJECT FIRST
                const updatedSelectedDate = {
                    date: m.pickupDate || selectedDate.date,
                    pickupTime: m.pickupTime || selectedDate.pickupTime,
                    dropTime: m.dropTime || selectedDate.dropTime,
                    numberOfMovers: parseInt(m.worker) || selectedDate.numberOfMovers,
                    price: selectedDate.price
                };

                console.log("date: ", m.pickupDate);
                console.log("pickupTime: ", m.pickupTime);
                console.log("selelcted date:", updatedSelectedDate);

                // SET THE STATE
                setSelectedDate(updatedSelectedDate);

                console.log("date (context): ", m.pickupDate);
                console.log("pickupTime(context): ", m.pickupTime);

                console.log("pickupDate:", m.pickupDate);
                console.log("pickupTime:", m.pickupTime);
                console.log("dropDate:", m.dropDate);
                console.log("dropTime:", m.dropTime);
                console.log("worker:", m.worker);
                console.log("Updated selectedDate object:", updatedSelectedDate);
                console.log("================================");

                setAdditionalServices({
                    ...additionalServices,
                    specialRequirements: m.specialRequirements
                });

                console.log("Before setting (metadata): ", m.van);
                console.log("After setting (contextdata): ", van.type);

                setVan({
                    type: m.van
                });

                setPiano({
                    type: m.piano || piano.type
                });

                setItemsToAssemble(parseInt(m.itemsToAssemble) || itemsToAssemble);
                setItemsToDismantle(parseInt(m.itemsToDismantle) || itemsToDismantle);

                setTotalPrice(parseFloat(m.price) || totalPrice);

                // NOW CALL THE API WITH THE CORRECT DATE VALUES
                const finalBookingRef = await sendBookingToServer(
                    customerData,
                    pickupData,
                    deliveryData,
                    parsedItems,
                    parsedExtraStops,
                    m.van,
                    m.quoteRef,
                    m,
                    updatedSelectedDate  // Pass the updated date object
                );

                // Update the booking reference with the actual value from the server
                setBookingRef(finalBookingRef);

                navigate('/confirmation');
            } catch (err) {
                console.error('Failed to fetch Stripe session or send booking:', err);
                navigate('/payment-failed');
            }
        };

        // Also update the sendBookingToServer function signature to accept the date parameter:
        const sendBookingToServer = async (customerData, pickupData, deliveryData, parsedItems, parsedExtraStops, vanRef, quote, metadata, dateData) => {
            try {
                const validatedStops = validateExtraStops(parsedExtraStops);

                console.log("Parsed items in sendBookingToServer:", parsedItems);
                console.log("Parsed extra stops in sendBookingToServer:", parsedExtraStops);
                console.log("metadata: ", metadata);
                console.log("dateData passed to sendBookingToServer:", dateData); // Add this log

                // Create the booking data object
                const bookingData = {
                    username: customerData.name || 'NA',
                    email: customerData.email || 'NA',
                    phoneNumber: customerData.phone || 'NA',
                    price: parseFloat(metadata.price) || 0,
                    distance: parseInt(metadata.distance) || 0,
                    route: journey.route || "default route",
                    duration: metadata.duration || "N/A",
                    // USE THE CORRECT DATE VALUES HERE
                    // pickupDate: metadata.pickupDate || dateData?.date || 'NA',
                    // pickupTime: metadata.pickupTime || dateData?.pickupTime || '08:00:00',
                    pickupDate: metadata.pickupDate || 'NA',
                    pickupTime: metadata.pickupTime || '',
                    pickupAddress: {
                        postcode: pickupData.postcode,
                        addressLine1: pickupData.addressLine1,
                        addressLine2: pickupData.addressLine2,
                        city: pickupData.city,
                        country: pickupData.country,
                        contactName: pickupData.contactName,
                        contactPhone: pickupData.contactPhone,
                    },
                    // dropDate: metadata.dropDate || metadata.pickupDate || dateData?.date || 'NA', // Often same as pickup date
                    // dropTime: metadata.dropTime || dateData?.dropTime || '18:00:00',
                    dropDate: metadata.dropDate || 'NA',
                    dropTime: metadata.dropTime || '',
                    dropAddress: {
                        postcode: deliveryData.postcode,
                        addressLine1: deliveryData.addressLine1,
                        addressLine2: deliveryData.addressLine2,
                        city: deliveryData.city,
                        country: deliveryData.country,
                        contactName: deliveryData.contactName,
                        contactPhone: deliveryData.contactPhone,
                    },
                    vanType: vanRef || "N/A",
                    // worker: parseInt(metadata.worker) || dateData?.numberOfMovers || 1,
                    worker: parseInt(metadata.worker) || 0,
                    itemsToDismantle: parseInt(metadata.itemsToDismantle) || 0,
                    itemsToAssemble: parseInt(metadata.itemsToAssemble) || 0,
                    stoppage: validatedStops,
                    pickupLocation: {
                        location: pickupData.location || "N/A",
                        floor: typeof pickupData.floor === 'string' ? parseInt(pickupData.floor) : pickupData.floor,
                        lift: pickupData.liftAvailable,
                        propertyType: pickupData.propertyType || "standard"
                    },
                    dropLocation: {
                        location: deliveryData.location || "N/A",
                        floor: typeof deliveryData.floor === 'string' ? parseInt(deliveryData.floor) : deliveryData.floor,
                        lift: deliveryData.liftAvailable,
                        propertyType: deliveryData.propertyType || "standard"
                    },
                    details: {
                        items: {
                            name: parsedItems?.map(item => item.name) || [],
                            quantity: parsedItems?.map(item => item.quantity) || [],
                        },
                        isBusinessCustomer: customerData.isBusinessCustomer,
                        motorBike: motorBike.type,
                        piano: piano.type,
                        specialRequirements: additionalServices.specialRequirements,
                    },
                    quotationRef: quote || 'NA'
                };

                console.log("Booking Data being sent:", JSON.stringify(bookingData, null, 2));
                console.log("Final pickup date being sent:", bookingData.pickupDate);
                console.log("Final pickup time being sent:", bookingData.pickupTime);

                // Send the booking data to the server
                const bookingResponse = await axios.post('https://api.reliancemove.com/new', bookingData);
                const bookingRefNumber = bookingResponse.data?.newOrder?.bookingRef;

                const vanTypeResponse = bookingResponse.data?.newOrder?.vanType;
                setVan({ ...van, type: vanTypeResponse });

                console.log("Full response: ", bookingResponse.data.newOrder);
                console.log("Booking response: ", bookingResponse);
                console.log("Booking ref: ", bookingRefNumber);

                return bookingRefNumber;
            } catch (error) {
                console.error('Error sending booking to server:', error);
                console.error('Error response data:', error.response?.data);
                throw error;
            }
        };

        if (sessionId) fetchSession();
        else navigate('/payment-failed');
    }, [sessionId]);

    const validateExtraStops = (stops) => {
        if (!Array.isArray(stops) || stops.length === 0) return [];

        return stops.map(stop => ({
            ...stop,
            // Ensure doorNumber exists and is a string
            doorNumber: stop.doorNumber || stop.doorFlatNo || '',
            // Ensure lift exists and is a boolean
            lift: typeof stop.lift === 'boolean' ? stop.lift : Boolean(stop.liftAvailable),
        }));
    };

    // const sendBookingToServer = async (customerData, pickupData, deliveryData, parsedItems, parsedExtraStops, vanRef, quote, metadata) => {
    //     try {

    //         const validatedStops = validateExtraStops(parsedExtraStops);
    //         // Log the parsed items to verify they exist
    //         console.log("Parsed items in sendBookingToServer:", parsedItems);
    //         console.log("Parsed extra stops in sendBookingToServer:", parsedExtraStops);
    //         console.log("metadata: ", metadata);
    //         // Create the booking data object similar to what was in BookingDetails.jsx
    //         const bookingData = {
    //             username: customerData.name || 'NA',
    //             email: customerData.email || 'NA',
    //             phoneNumber: customerData.phone || 'NA',
    //             price: parseFloat(metadata.price) || 0,
    //             distance: parseInt(metadata.distance) || 0,
    //             route: journey.route || "default route",
    //             duration: metadata.duration || "N/A",
    //             pickupDate: metadata.pickupDate || 'NA',
    //             pickupTime: metadata.pickupTime || '08:00:00',
    //             pickupAddress: {
    //                 postcode: pickupData.postcode,
    //                 addressLine1: pickupData.addressLine1,
    //                 addressLine2: pickupData.addressLine2,
    //                 city: pickupData.city,
    //                 country: pickupData.country,
    //                 contactName: pickupData.contactName,
    //                 contactPhone: pickupData.contactPhone,
    //             },
    //             dropDate: metadata.dropDate || 'NA',
    //             dropTime: metadata.dropTime || '18:00:00',
    //             dropAddress: {
    //                 postcode: deliveryData.postcode,
    //                 addressLine1: deliveryData.addressLine1,
    //                 addressLine2: deliveryData.addressLine2,
    //                 city: deliveryData.city,
    //                 country: deliveryData.country,
    //                 contactName: deliveryData.contactName,
    //                 contactPhone: deliveryData.contactPhone,
    //             },
    //             vanType: vanRef || "N/A",
    //             worker: parseInt(metadata.worker) || 1,
    //             itemsToDismantle: parseInt(metadata.itemsToDismantle) || 0,
    //             itemsToAssemble: parseInt(metadata.itemsToAssemble) || 0,
    //             stoppage: validatedStops,
    //             pickupLocation: {
    //                 location: pickupData.location || "N/A",
    //                 floor: typeof pickupData.floor === 'string' ? parseInt(pickupData.floor) : pickupData.floor,
    //                 lift: pickupData.liftAvailable,
    //                 propertyType: pickupData.propertyType || "standard"
    //             },
    //             dropLocation: {
    //                 location: deliveryData.location || "N/A",
    //                 floor: typeof deliveryData.floor === 'string' ? parseInt(deliveryData.floor) : deliveryData.floor,
    //                 lift: deliveryData.liftAvailable,
    //                 propertyType: deliveryData.propertyType || "standard"
    //             },
    //             details: {
    //                 items: {
    //                     name: parsedItems?.map(item => item.name) || [],
    //                     quantity: parsedItems?.map(item => item.quantity) || [],
    //                 },
    //                 isBusinessCustomer: customerData.isBusinessCustomer,
    //                 motorBike: motorBike.type,
    //                 piano: piano.type,
    //                 specialRequirements: additionalServices.specialRequirements,
    //             },
    //             quotationRef: quote || 'NA'
    //         };

    //         console.log("Booking Data being sent:", JSON.stringify(bookingData, null, 2));
    //         console.log("date: ", metadata.pickupDate);

    //         // Send the booking data to the server
    //         // setTimeout(5000);
    //         const bookingResponse = await axios.post('https://api.reliancemove.com/new', bookingData);
    //         const bookingRefNumber = bookingResponse.data?.newOrder?.bookingRef;

    //         const vanTypeResponse = bookingResponse.data?.newOrder?.vanType;

    //         setVan({ ...van, type: vanTypeResponse });

    //         console.log("Full response: ", bookingResponse.data.newOrder);
    //         console.log("Booking response: ", bookingResponse);
    //         console.log("Booking ref: ", bookingRefNumber);
    //         console.log("Date: ", date);
    //         console.log("Time: ", time);
    //         console.log("worker: ", worker);


    //         return bookingRefNumber;
    //     } catch (error) {
    //         console.error('Error sending booking to server:', error);
    //         console.error('Error response data:', error.response.data);
    //         throw error;
    //     }
    // };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
                <div className="mb-6">
                    <div className="mx-auto h-16 w-16 relative">
                        {/* Animated loading spinner */}
                        <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Processing Your Payment
                </h2>

                <p className="text-gray-600 mb-6">
                    Please wait while we verify your payment and prepare your booking confirmation.
                </p>

                <div className="space-y-2">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
                    </div>
                    <p className="text-sm text-gray-500">
                        This may take a few moments. Please don't close this page.
                    </p>
                </div>
            </div>

            <div className="mt-8 text-sm text-gray-500">
                © {new Date().getFullYear()} Reliance Move. All rights reserved.
            </div>
        </div>
    );
};

export default PaymentSuccess;