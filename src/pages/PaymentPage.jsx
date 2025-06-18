import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Truck, Calendar, MapPin, User, Phone, Package, CreditCard, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const PaymentPage = () => {

    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitError, setSubmitError] = useState(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        // Get quotation reference from URL parameters

        const quotationNo = searchParams.get('quotationRef');
        console.log(searchParams);
        // const quotationNo = urlParams.get('quotationRef') ; // Default for demo
        console.log("quotation: ", quotationNo);

        fetchQuotation(quotationNo);
    }, []);

    const fetchQuotation = async (quotationNo) => {
        try {
            console.log("quotationNo fetched: ", quotationNo);
            setLoading(true);
            const response = await axios.get(`${baseUrl}/quote/get/${quotationNo}`);

            if (response.data.msg === "Quotation found") {
                setQuotation(response.data.quotation);
            } else {
                throw new Error('Quotation not found');
            }
        } catch (err) {
            if (err.response) {
                // Server responded with error status
                setError(`Error ${err.response.status}: ${err.response.data.message || 'Failed to fetch quotation'}`);
            } else if (err.request) {
                // Request was made but no response received
                setError('Network error: Unable to connect to server');
            } else {
                // Something else happened
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (e) => {
        // Implement payment logic here
        e.preventDefault();
        setSubmitError(null);



        try {


            const sessionRes = await axios.post(`${baseUrl}/create-checkout-session`, quotation);

            const stripe = await stripePromise;
            await stripe.redirectToCheckout({ sessionId: sessionRes.data.sessionId });

        } catch (error) {
            console.error('Error submitting booking:', error);
            setSubmitError('Failed to submit booking. Please try again. (Check all fields are selected or not)');
            console.error('Error response data:', error.response.data);
            navigate('/payment-failed'); // redirect on error

        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading quotation details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Quotation</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold mb-2">Complete Your Payment</h1>
                                <p className="text-indigo-100">Quotation Reference: {quotation?.quotationRef}</p>
                            </div>
                            <Truck className="w-12 h-12 text-indigo-200" />
                        </div>
                    </div>

                    <div className="p-6">
                        {/* Price Summary */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-8 border border-green-200">
                            <div className="text-center">
                                <h2 className="text-3xl font-bold text-green-700 mb-2">£{quotation?.price}</h2>
                                <p className="text-green-600 text-lg">Total Amount</p>
                                <div className="mt-4 flex justify-center items-center space-x-4 text-sm text-green-600">
                                    <span className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1" />
                                        {quotation?.distance} miles
                                    </span>
                                    <span className="flex items-center">
                                        <Package className="w-4 h-4 mr-1" />
                                        {quotation?.vanType} Van
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Service Details */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* Pickup Details */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                    Pickup Details
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-medium">{quotation?.pickupAddress.addressLine1}</p>
                                        <p className="text-sm text-gray-600">{quotation?.pickupAddress.city} {quotation?.pickupAddress.postcode}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Date</p>
                                            <p className="font-medium flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {quotation?.pickupDate}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Time</p>
                                            <p className="font-medium">{quotation?.pickupTime}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Contact</p>
                                        <p className="font-medium flex items-center">
                                            <User className="w-4 h-4 mr-1" />
                                            {quotation?.pickupAddress.contactName}
                                        </p>
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <Phone className="w-4 h-4 mr-1" />
                                            {quotation?.pickupAddress.contactPhone}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Drop Details */}
                            <div className="bg-gray-50 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                                    Drop Details
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600">Address</p>
                                        <p className="font-medium">{quotation?.dropAddress.addressLine1}</p>
                                        <p className="text-sm text-gray-600">{quotation?.dropAddress.city} {quotation?.dropAddress.postcode}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">Date</p>
                                            <p className="font-medium flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {quotation?.dropDate}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Time</p>
                                            <p className="font-medium">{quotation?.dropTime}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Contact</p>
                                        <p className="font-medium flex items-center">
                                            <User className="w-4 h-4 mr-1" />
                                            {quotation?.dropAddress.contactName}
                                        </p>
                                        <p className="text-sm text-gray-600 flex items-center">
                                            <Phone className="w-4 h-4 mr-1" />
                                            {quotation?.dropAddress.contactPhone}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Info */}
                        <div className="bg-blue-50 rounded-xl p-6 mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Service Information</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="text-center">
                                    <Truck className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <p className="font-medium">{quotation?.vanType} Van</p>
                                    <p className="text-sm text-gray-600">Vehicle Type</p>
                                </div>
                                <div className="text-center">
                                    <User className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <p className="font-medium">{quotation?.worker} Worker</p>
                                    <p className="text-sm text-gray-600">Team Size</p>
                                </div>
                                <div className="text-center">
                                    <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                                    <p className="font-medium">{quotation?.distance} miles</p>
                                    <p className="text-sm text-gray-600">Distance</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Button */}
                        <div className="text-center">
                            <button
                                onClick={(e) => {

                                    handlePayment(e);

                                }}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-4 px-12 rounded-xl hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center mx-auto text-lg"
                            >
                                <CreditCard className="w-6 h-6 mr-3" />
                                Pay Now - £{quotation?.price}
                            </button>
                            <p className="text-sm text-gray-500 mt-4">Secure payment processing • SSL encrypted</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;