import { Listing } from '../types';

interface AdminPanelProps {
  pendingListings: Listing[];
  onClose: () => void;
  onApprove: (listingId: number) => void;
  onReject: (listingId: number) => void;
}

export default function AdminPanel({ pendingListings, onClose, onApprove, onReject }: AdminPanelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-6">Admin - Pending Listings</h2>
        {pendingListings.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No pending listings</p>
        ) : (
          <div className="space-y-4">
            {pendingListings.map((listing) => (
              <div key={listing.id} className="border rounded-lg p-4 flex gap-4">
                {listing.photo ? (
                  <img src={listing.photo} alt={listing.title} className="w-32 h-32 object-cover rounded" />
                ) : (
                  <div className="w-32 h-32 bg-gray-100 rounded flex items-center justify-center text-4xl">🌿</div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{listing.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{listing.description}</p>
                  <p className="text-sm text-gray-500">
                    {listing.ownerName} • {listing.streetNumber}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => onApprove(listing.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => onReject(listing.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button onClick={onClose} className="w-full mt-4 py-2 border rounded-lg hover:bg-gray-50">
          Close
        </button>
      </div>
    </div>
  );
}
