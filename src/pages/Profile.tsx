import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">Profile</h1>
        <p className="text-gray-600">You are not signed in.</p>
      </div>
    );
  }

  const displayName = user.displayName ?? '';
  const email = user.email ?? '';

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      <div className="space-y-3 mb-8">
        <div>
          <span className="font-medium text-gray-700">Name:</span>{' '}
          <span>{displayName || '—'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">Email:</span>{' '}
          <span>{email || '—'}</span>
        </div>
        <div>
          <span className="font-medium text-gray-700">User ID:</span>{' '}
          <span className="break-all">{user.uid}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => signOut()}
        className="inline-flex items-center px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
      >
        Sign out
      </button>
    </div>
  );
};

export default Profile;