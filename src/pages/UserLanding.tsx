import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { housesApi } from '../services/api'
import { UserHouse } from '../types/types'
import HouseCard from '../components/HouseCard'
import EmptyHouseCard from '../components/EmptyHouseCard'

function UserLanding() {
    const { user, profile, signOut } = useAuth();
    const [houses, setHouses] = useState<UserHouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            fetchHouses();
        }
    }, [user]);

    const fetchHouses = async () => {
        if (!user) return;

        try {
            setLoading(true);
            const data = await housesApi.getByUser(user.id);
            setHouses(data);
            setError(null);
        } catch (err) {
            console.error('Error fetching houses:', err);
            setError('Failed to load houses. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading your houses...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome, {profile?.full_name || profile?.username || 'User'}!
                        </h1>
                        <p className="text-gray-600">@{profile?.username}</p>
                    </div>
                    <button
                        onClick={handleSignOut}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                    >
                        Sign Out
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Houses</h2>
                    {houses.length === 0 && !loading && (
                        <p className="text-gray-600 mb-4">
                            You don't have any houses yet. Create one to get started!
                        </p>
                    )}
                </div>

                <div className="flex flex-wrap gap-4">
                    {houses.map((userHouse) => (
                        <HouseCard
                            key={userHouse.house_id}
                            id={userHouse.house_id}
                            name={userHouse.houses.name}
                            image={undefined}
                        />
                    ))}
                    <EmptyHouseCard />
                </div>
            </div>
        </div>
    )
}

export default UserLanding