import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, Edit, AlertTriangle, Shield, FileText } from 'lucide-react';
import QuoteConfirmation from './QuoteConfirmation';
import OrderSummary from '../components/OrderSummary';
import { useBooking } from '../context/BookingContext';
import Header from '../components/Header';

const ItemCategoryForm = (props) => {
    const navigate = useNavigate();
    const [useInventory, setUseInventory] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [activeCategory, setActiveCategory] = useState('boxes');
    const [searchResults, setSearchResults] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/date', { state: { prepath: props.prepath } });
    };

    // Get items and setItems from BookingContext
    const { items: contextItems, setItems: setContextItems, addItem, updateItemQuantity, removeItem } = useBooking();

    // Local state to track items with quantities
    const [localItems, setLocalItems] = useState({});

    // All items for searching
    const allItems = {
        living: [
            { name: 'Two Seater Sofa', description: null },
            { name: 'Three Seater Sofa', description: null },
            { name: 'Armchair', description: null },
            { name: 'Coffee Table', description: null },
            { name: 'Small Television/TV', description: 'Less than 30"' },
            { name: 'Large Television/TV', description: 'Greater than 40"' },
            { name: 'TV Stand', description: null },
            { name: 'Bookcase', description: null },
            { name: 'Rug', description: null },
            { name: 'Desk', description: null },
            { name: 'Office Chair', description: null },
            { name: 'Artwork', description: null },
            { name: 'Floor Lamp', description: null },
        ],
        dining: [
            { name: '4 Seater Dining Table', description: null },
            { name: '6 Seater Dining Table', description: null },
            { name: 'Dining Chair', description: null },
            { name: 'Sideboard', description: null },
            { name: 'Display Cabinet', description: null },
            { name: 'Rug', description: null },
        ],
        kitchen: [
            { name: 'Fridge Freezer', description: null },
            { name: 'Washing Machine', description: null },
            { name: 'Microwave Oven', description: null },
            { name: 'Cooker', description: null },
            { name: 'Dishwasher', description: null },
            { name: 'Kitchen Table', description: null },
            { name: 'Dining Chair', description: null },
            { name: 'Bin', description: null },
            { name: 'Ironing Board', description: null },
            { name: 'Tumble Dryer', description: null },
        ],
        garden: [
            { name: 'Garden Table', description: null },
            { name: 'Garden Chair', description: null },
            { name: 'Lawn Mower', description: null },
            { name: 'Tool Box', description: null },
            { name: 'Bench', description: null },
            { name: 'Parasol', description: null },
            { name: 'Bicycle', description: null },
        ],
        boxes: [
            { name: 'Large Box', description: 'Approx. 50×50×50 cm' },
            { name: 'Medium Box', description: 'Approx. 45×45×35 cm' },
            { name: 'Small Box', description: 'Approx. 40×30×30 cm' },
            { name: 'Wardrobe Box', description: null },
            { name: 'Suitcase', description: null },
            { name: 'Bag', description: null },
        ],
        bedrooms: [
            { name: 'Single Bed & Mattress', description: null },
            { name: 'Double Bed & Mattress', description: null },
            { name: 'Kingsize Bed & Mattress', description: null },
            { name: 'Single Wardrobe', description: null },
            { name: 'Double Wardrobe', description: null },
            { name: 'Chest Of Drawers', description: null },
            { name: 'Bedside Table', description: null },
            { name: 'Dressing Table', description: null },
            { name: 'Television', description: null },
            { name: 'Side Table', description: null },
        ],
        bathroom: [
            { name: 'Bathroom Cabinet', description: null },
            { name: 'Towel Rail', description: null },
            { name: 'Mirror', description: null },
            { name: 'Shower Rack', description: null },
        ]
    };

    // Initialize local items from context when component mounts
    useEffect(() => {
        const initialItems = {};
        contextItems.forEach(item => {
            initialItems[item.name] = item.quantity;
        });
        setLocalItems(initialItems);
    }, []);

    // Update context whenever local items change
    useEffect(() => {
        const newContextItems = Object.entries(localItems).map(([name, quantity]) => ({
            name,
            quantity
        }));
        setContextItems(newContextItems);
    }, [localItems]);

    // Search functionality
    useEffect(() => {
        if (searchText.trim() === '') {
            setSearchResults([]);
            return;
        }

        const results = [];
        
        // Search through all categories
        Object.values(allItems).forEach(categoryItems => {
            categoryItems.forEach(item => {
                if (item.name.toLowerCase().includes(searchText.toLowerCase())) {
                    results.push(item);
                }
            });
        });

        setSearchResults(results);
    }, [searchText]);

    const handleQuantityChange = (itemName, newQuantity) => {
        if (newQuantity === 0) {
            const newItems = { ...localItems };
            delete newItems[itemName];
            setLocalItems(newItems);
            removeItem(itemName);
        } else {
            setLocalItems({ ...localItems, [itemName]: newQuantity });

            // If item exists in context, update quantity; otherwise add it
            const existingItem = contextItems.find(item => item.name === itemName);
            if (existingItem) {
                updateItemQuantity(itemName, newQuantity);
            } else {
                addItem(itemName);
                updateItemQuantity(itemName, newQuantity);
            }
        }
    };

    const addNewItem = (itemName) => {
        setLocalItems({ ...localItems, [itemName]: 1 });
        addItem(itemName);
    };

    const categories = [
        { id: 'bedrooms', icon: '🛏️', label: 'Bedrooms' },
        { id: 'living', icon: '🛋️', label: 'Living' },
        { id: 'dining', icon: '🍽️', label: 'Dining' },
        { id: 'kitchen', icon: '🍳', label: 'Kitchen' },
        { id: 'bathroom', icon: '🚿', label: 'Bathroom' },
        { id: 'garden', icon: '🌱', label: 'Garden' },
        { id: 'boxes', icon: '📦', label: 'Boxes & Packaging' }
    ];

    const renderItemRow = (name, description = null, quantity = 0) => {
        return (
            <div className="flex justify-between items-center py-2" key={name}>
                <div>
                    <div className="font-medium text-gray-700">{name}</div>
                    {description && <div className="text-xs text-gray-500">{description}</div>}
                </div>
                <div className="flex items-center">
                    {quantity > 0 ? (
                        <>
                            <button type="button" className="text-blue-500 hover:text-blue-700 mr-2">
                                <Edit size={18} />
                            </button>
                            <button
                                type="button"
                                className="text-blue-500 hover:text-blue-700 mr-2 rounded-full border border-blue-500 w-6 h-6 flex items-center justify-center"
                                onClick={() => handleQuantityChange(name, quantity - 1)}
                            >
                                <span className="text-lg leading-none mb-1">−</span>
                            </button>
                            <span className="w-8 text-center">{quantity}</span>
                            <button
                                type="button" 
                                className="text-blue-500 hover:text-blue-700 ml-2 rounded-full border border-blue-500 w-6 h-6 flex items-center justify-center"
                                onClick={() => handleQuantityChange(name, quantity + 1)}
                            >
                                <span className="text-lg leading-none mb-1">+</span>
                            </button>
                        </>
                    ) : (
                        <button
                            type="button" 
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => addNewItem(name)}
                        >
                            <span className="text-lg leading-none">+</span>
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const renderCategoryItems = () => {
        if (searchText.trim() !== '' && searchResults.length > 0) {
            return (
                <div className="space-y-2">
                    {searchResults.map(item => 
                        renderItemRow(item.name, item.description, localItems[item.name] || 0)
                    )}
                </div>
            );
        }

        if (searchText.trim() !== '' && searchResults.length === 0) {
            return (
                <div className="py-8 text-center text-gray-500">
                    No items found for "{searchText}"
                </div>
            );
        }

        if (allItems[activeCategory]) {
            return (
                <div className="space-y-2">
                    {allItems[activeCategory].map(item => 
                        renderItemRow(item.name, item.description, localItems[item.name] || 0)
                    )}
                </div>
            );
        }

        return (
            <div className="py-8 text-center text-gray-500">
                Select a category to see items
            </div>
        );
    };

    const totalItems = Object.values(localItems).reduce((sum, quantity) => sum + quantity, 0);

return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* <Header title="What are you moving?" /> */}
        
        <div className="max-w-7xl mx-auto px-4 py-6">
            {/* Inventory Checkbox */}
            {/* <div className="mb-4">
                <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-white/20">
                    <input
                        type="checkbox"
                        id="useInventory"
                        checked={useInventory}
                        onChange={() => setUseInventory(!useInventory)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="useInventory" className="ml-3 text-sm font-medium text-gray-700">
                        Prefer to use our 2 Bed House inventory list?
                    </label>
                </div>
            </div> */}

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                        {/* Category Tabs */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4">
                            <div className="grid grid-cols-7 gap-1">
                                {categories.map((category) => (
                                    <button
                                        type="button" 
                                        key={category.id}
                                        onClick={() => {
                                            setActiveCategory(category.id);
                                            setSearchText('');
                                        }}
                                        className={`flex flex-col items-center justify-center py-3 px-2 rounded-lg transition-all duration-200 ${
                                            activeCategory === category.id 
                                                ? 'bg-white text-blue-600 shadow-md transform scale-105' 
                                                : 'text-blue-100 hover:bg-white/20 hover:text-white'
                                        }`}
                                    >
                                        <span className="text-lg mb-1">{category.icon}</span>
                                        <span className="text-xs font-medium text-center leading-tight">{category.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Category Items */}
                            <div className="mb-6">
                                {renderCategoryItems()}
                            </div>

                            {/* Search Section */}
                            <div className="mb-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        placeholder="Search for more items here"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/50 backdrop-blur-sm"
                                    />
                                </div>
                            </div>

                            {/* Packing Service Notice */}
                            <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mr-3">
                                        <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-800 leading-relaxed">
                                            If you'd like us to provide materials and pack your items for you, you can book your move with a
                                            <span className="font-semibold text-amber-700"> Packing Service</span> included on the following page!
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <button
                                type='button'
                                onClick={() => navigate("/home-loc")}
                                className="flex items-center space-x-2 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-200 font-medium group"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span>Back</span>
                            </button>
                            <button
                                type="submit"
                                className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                <span>Get Prices</span>
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </form>
                </div>

                <div className="w-full lg:w-96">
                    <OrderSummary />
                </div>
            </div>
        </div>
    </div>
);
};

export default ItemCategoryForm;