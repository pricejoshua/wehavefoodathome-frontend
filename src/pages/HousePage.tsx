import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { housesApi, foodItemsApi } from '../services/api';
import { House, FoodItem, ExpiringFoodItem } from '../types/types';
import AddFoodModal from '../components/AddFoodModal';

function HousePage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [house, setHouse] = useState<House | null>(null);
    const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
    const [expiringItems, setExpiringItems] = useState<ExpiringFoodItem[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchHouseData();
            fetchFoodItems();
            fetchExpiringItems();
        }
    }, [id]);

    const fetchHouseData = async () => {
        if (!id) return;

        try {
            const data = await housesApi.getById(id);
            setHouse(data);
        } catch (err: any) {
            console.error('Error fetching house:', err);
            setError(err.message || 'Failed to load house data');
        }
    };

    const fetchFoodItems = async () => {
        if (!id) return;

        try {
            setLoading(true);
            const data = await foodItemsApi.getByHouse(id);
            setFoodItems(data);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching food items:', err);
            setError(err.message || 'Failed to load food items');
        } finally {
            setLoading(false);
        }
    };

    const fetchExpiringItems = async () => {
        if (!id) return;

        try {
            const data = await foodItemsApi.getExpiring(id, 7);
            setExpiringItems(data);
        } catch (err) {
            console.error('Error fetching expiring items:', err);
        }
    };

    const handleSearch = async () => {
        if (!id || !searchQuery.trim()) {
            fetchFoodItems();
            return;
        }

        try {
            setLoading(true);
            const data = await foodItemsApi.search(id, searchQuery);
            setFoodItems(data);
            setError(null);
        } catch (err: any) {
            console.error('Error searching food items:', err);
            setError(err.message || 'Failed to search food items');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;

        try {
            await foodItemsApi.delete(itemId);
            fetchFoodItems();
            fetchExpiringItems();
        } catch (err: any) {
            console.error('Error deleting item:', err);
            alert(err.message || 'Failed to delete item');
        }
    };

    if (loading && !house) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    if (!house) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-red-600">House not found</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link
                            to="/main"
                            className="text-blue-600 hover:underline mb-2 inline-block"
                        >
                            &larr; Back to Houses
                        </Link>
                        <h1 className="text-4xl font-bold text-gray-800">{house.name}</h1>
                        {house.description && (
                            <p className="text-gray-600 mt-2">{house.description}</p>
                        )}
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-md transition-colors"
                    >
                        + Add Food Item
                    </button>
                </div>

                {/* Expiring Items Alert */}
                {expiringItems.length > 0 && (
                    <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-md">
                        <h3 className="font-bold mb-2">Expiring Soon:</h3>
                        <ul className="list-disc list-inside">
                            {expiringItems.slice(0, 5).map((item) => (
                                <li key={item.id}>
                                    {item.products?.name} - {item.is_expired ? 'Expired' : `Expires in ${item.days_until_expiration} days`}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                {/* Search Bar */}
                <div className="mb-6 flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder="Search food items..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                    >
                        Search
                    </button>
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                fetchFoodItems();
                            }}
                            className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md transition-colors"
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Food Items List */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Food Inventory</h2>
                    {loading ? (
                        <div className="text-center py-8">Loading food items...</div>
                    ) : foodItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            No food items found. Add some to get started!
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Name</th>
                                        <th className="text-left p-2">Category</th>
                                        <th className="text-left p-2">Quantity</th>
                                        <th className="text-left p-2">Best By</th>
                                        <th className="text-left p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foodItems.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="p-2">{item.products?.name || 'Unknown'}</td>
                                            <td className="p-2">{item.products?.category || 'N/A'}</td>
                                            <td className="p-2">
                                                {item.quantity} {item.unit}
                                            </td>
                                            <td className="p-2">
                                                {item.best_by_date
                                                    ? new Date(item.best_by_date).toLocaleDateString()
                                                    : 'N/A'}
                                            </td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold text-gray-700">Total Items</h3>
                        <p className="text-3xl font-bold text-blue-600">{foodItems.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold text-gray-700">Expiring Soon</h3>
                        <p className="text-3xl font-bold text-yellow-600">{expiringItems.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-4">
                        <h3 className="text-lg font-semibold text-gray-700">Categories</h3>
                        <p className="text-3xl font-bold text-green-600">
                            {new Set(foodItems.map((item) => item.products?.category || 'Unknown')).size}
                        </p>
                    </div>
                </div>
            </div>

            {/* Add Food Modal */}
            {showAddModal && id && (
                <AddFoodModal
                    houseId={id}
                    onClose={() => setShowAddModal(false)}
                    onSuccess={() => {
                        fetchFoodItems();
                        fetchExpiringItems();
                    }}
                />
            )}
        </div>
    );
}

export default HousePage;
