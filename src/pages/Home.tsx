import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-blue-600">WeHaveFoodAtHome</h1>
            <div className="flex gap-4">
              {user ? (
                <Link
                  to="/main"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 mb-6">
            Stop Buying Duplicate Groceries
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Track your household's food inventory in real-time. Never wonder "do we have milk?"
            again. Reduce waste, save money, and keep everyone on the same page.
          </p>
          {!user && (
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
          )}
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📱</div>
            <h3 className="text-xl font-bold mb-2">Barcode Scanning</h3>
            <p className="text-gray-600">
              Quickly add items by scanning barcodes. Our system automatically
              identifies products from OpenFoodFacts database.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🏠</div>
            <h3 className="text-xl font-bold mb-2">Household Management</h3>
            <p className="text-gray-600">
              Create shared households so everyone knows what's in stock.
              Perfect for families, roommates, and shared living spaces.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">⏰</div>
            <h3 className="text-xl font-bold mb-2">Expiration Tracking</h3>
            <p className="text-gray-600">
              Get alerts for items expiring soon. Reduce food waste by using
              items before they go bad.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Smart Search</h3>
            <p className="text-gray-600">
              Quickly find items in your inventory with powerful search.
              Filter by category, expiration date, and more.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📸</div>
            <h3 className="text-xl font-bold mb-2">Receipt Scanning</h3>
            <p className="text-gray-600">
              Snap a photo of your grocery receipt and add multiple items at once.
              Save time after shopping trips.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">Activity Tracking</h3>
            <p className="text-gray-600">
              See what was added, removed, or updated. Keep track of your
              household's food consumption patterns.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="mt-20 text-center bg-white p-12 rounded-lg shadow-md">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Organized?
            </h3>
            <p className="text-xl text-gray-600 mb-6">
              Join thousands of households saving time and reducing food waste.
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors shadow-lg"
            >
              Create Your Free Account
            </Link>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 WeHaveFoodAtHome. Keep track of your food inventory.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}