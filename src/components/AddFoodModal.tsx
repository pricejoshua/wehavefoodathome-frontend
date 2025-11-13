import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { foodItemsApi, productsApi } from '../services/api';
import { Product } from '../types/types';

interface AddFoodModalProps {
    houseId: string;
    onClose: () => void;
    onSuccess: () => void;
}

function AddFoodModal({ houseId, onClose, onSuccess }: AddFoodModalProps) {
    const { user } = useAuth();
    const [mode, setMode] = useState<'barcode' | 'manual'>('barcode');

    // Barcode mode state
    const [barcode, setBarcode] = useState('');
    const [lookupLoading, setLookupLoading] = useState(false);
    const [foundProduct, setFoundProduct] = useState<Product | null>(null);

    // Manual mode state
    const [productName, setProductName] = useState('');
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    // Common fields
    const [quantity, setQuantity] = useState<number>(1);
    const [unit, setUnit] = useState('count');
    const [bestByDate, setBestByDate] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleBarcodeLookup = async () => {
        if (!barcode || barcode.length < 8) {
            setError('Please enter a valid barcode (at least 8 digits)');
            return;
        }

        setLookupLoading(true);
        setError(null);

        try {
            const result = await productsApi.lookupBarcode(barcode);
            setFoundProduct(result.product);
            setProductName(result.product.name);
            setCategory(result.product.category || '');
            setDescription(result.product.description || '');
            setError(null);
        } catch (err: any) {
            console.error('Error looking up barcode:', err);
            setError(err.message || 'Product not found. Please enter details manually.');
            setFoundProduct(null);
            // Switch to manual mode to allow user to enter details
            setMode('manual');
        } finally {
            setLookupLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            let productId = foundProduct?.id;

            // If no product found (manual mode), create it first
            if (!productId) {
                const newProduct = await productsApi.create({
                    name: productName,
                    description: description || undefined,
                    category: category || undefined,
                    metadata: barcode ? { barcode } : undefined,
                });
                productId = newProduct.id;
            }

            // Create food item
            await foodItemsApi.create({
                house_id: houseId,
                product_id: productId,
                user_id: user.id,
                quantity,
                unit,
                best_by_date: bestByDate || undefined,
            });

            onSuccess();
            onClose();
        } catch (err: any) {
            console.error('Error adding food item:', err);
            setError(err.message || 'Failed to add food item. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">Add Food Item</h2>

                {/* Mode Toggle */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setMode('barcode')}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                            mode === 'barcode'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Barcode Lookup
                    </button>
                    <button
                        onClick={() => setMode('manual')}
                        className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                            mode === 'manual'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Manual Entry
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Barcode Lookup Section */}
                    {mode === 'barcode' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Barcode
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={barcode}
                                    onChange={(e) => setBarcode(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter barcode number"
                                    pattern="[0-9]{8,14}"
                                />
                                <button
                                    type="button"
                                    onClick={handleBarcodeLookup}
                                    disabled={lookupLoading}
                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md disabled:bg-gray-400 transition-colors"
                                >
                                    {lookupLoading ? 'Looking up...' : 'Lookup'}
                                </button>
                            </div>
                            {foundProduct && (
                                <div className="mt-2 p-3 bg-green-100 border border-green-400 text-green-800 rounded-md text-sm">
                                    Found: {foundProduct.name}
                                    {foundProduct.category && ` (${foundProduct.category})`}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Product Details (shown after lookup or in manual mode) */}
                    {(mode === 'manual' || foundProduct) && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    disabled={!!foundProduct}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    placeholder="e.g., Milk, Bread, Apples"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    disabled={!!foundProduct}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    placeholder="e.g., Dairy, Bakery, Produce"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={!!foundProduct}
                                    rows={2}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                    placeholder="Optional description"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0.01"
                                        step="0.01"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseFloat(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit *
                                    </label>
                                    <select
                                        required
                                        value={unit}
                                        onChange={(e) => setUnit(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="count">Count</option>
                                        <option value="lbs">Pounds</option>
                                        <option value="oz">Ounces</option>
                                        <option value="kg">Kilograms</option>
                                        <option value="g">Grams</option>
                                        <option value="L">Liters</option>
                                        <option value="mL">Milliliters</option>
                                        <option value="gal">Gallons</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Best By Date (Optional)
                                </label>
                                <input
                                    type="date"
                                    value={bestByDate}
                                    onChange={(e) => setBestByDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                        <button
                            type="submit"
                            disabled={loading || (mode === 'barcode' && !foundProduct && !productName)}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md disabled:bg-gray-400 transition-colors"
                        >
                            {loading ? 'Adding...' : 'Add Food Item'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-md transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddFoodModal;
