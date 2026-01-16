import { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
  onClick: () => void;
  onProfileClick: (e: React.MouseEvent) => void;
}

export default function ListingCard({ listing, onClick, onProfileClick }: ListingCardProps) {
  const daysUntilExpiry = Math.ceil((new Date(listing.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition cursor-pointer overflow-hidden"
    >
      {listing.photo ? (
        <div className="h-48 overflow-hidden">
          <img src={listing.photo} alt={listing.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
          <span className="text-6xl">🌿</span>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-lg text-gray-800">{listing.title}</h3>
          {listing.availability === 'free' ? (
            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">Free</span>
          ) : (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Swap</span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>

        <div className="flex items-center gap-2 mb-2">
          <button onClick={onProfileClick} className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition">
            {listing.ownerPhoto ? (
              <img src={listing.ownerPhoto} alt={listing.ownerName} className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">👤</div>
            )}
            <span className="text-sm text-green-600 hover:underline font-medium">{listing.ownerName}</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="capitalize">{listing.itemType}</span>
          <span>{listing.streetNumber}</span>
        </div>

        {daysUntilExpiry <= 3 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-orange-600">
            ⏰ Expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
