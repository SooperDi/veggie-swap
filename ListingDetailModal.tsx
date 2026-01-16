import { useState } from 'react';
import { Listing, UserProfile } from '../types';

interface ListingDetailModalProps {
  listing: Listing;
  onClose: () => void;
  onAddRequest: (listingId: number, request: { requester: string; message: string; offer: string }) => void;
  onDelete: (listingId: number) => void;
  userProfile: UserProfile | null;
  onProfileClick: () => void;
}

export default function ListingDetailModal({
  listing,
  onClose,
  onAddRequest,
  onDelete,
  userProfile,
  onProfileClick,
}: ListingDetailModalProps) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestData, setRequestData] = useState({
    requester: userProfile?.name || '',
    message: '',
    offer: '',
  });

  const handleRequest = () => {
    if (requestData.requester) {
      onAddRequest(listing.id, requestData);
      setShowRequestForm(false);
      setRequestData({ requester: userProfile?.name || '', message: '', offer: '' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="mb-4">
          {listing.photo && <img src={listing.photo} alt={listing.title} className="w-full h-64 object-cover rounded-lg mb-4" />}
          <h2 className="text-2xl font-bold mb-2">{listing.title}</h2>
          <button onClick={onProfileClick} className="flex items-center gap-2 hover:bg-gray-50 p-2 rounded mb-2">
            {listing.ownerPhoto ? (
              <img src={listing.ownerPhoto} alt={listing.ownerName} className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">👤</div>
            )}
            <span className="text-green-600 hover:underline">by {listing.ownerName}</span>
          </button>
          <p className="text-gray-600 mb-4">{listing.description}</p>
          {listing.lookingFor && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h4 className="font-semibold text-blue-800">Looking For</h4>
              <p className="text-blue-700">{listing.lookingFor}</p>
            </div>
          )}
        </div>

        {!showRequestForm ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowRequestForm(true)}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              {listing.availability === 'free' ? 'Claim' : 'Request Swap'}
            </button>
            <button
              onClick={() => {
                if (confirm('Delete?')) onDelete(listing.id);
              }}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
            >
              Delete
            </button>
            <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Close
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={requestData.requester}
              onChange={(e) => setRequestData({ ...requestData, requester: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            {listing.availability === 'swap' && (
              <input
                type="text"
                placeholder="What can you offer?"
                value={requestData.offer}
                onChange={(e) => setRequestData({ ...requestData, offer: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            )}
            <textarea
              placeholder="Message (optional)"
              value={requestData.message}
              onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <div className="flex gap-2">
              <button onClick={handleRequest} className="flex-1 bg-green-600 text-white py-2 rounded-lg">
                Submit
              </button>
              <button onClick={() => setShowRequestForm(false)} className="px-4 py-2 border rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
