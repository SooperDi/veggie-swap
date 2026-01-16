import { useState } from 'react';
import { UserProfile } from '../types';

interface AddListingModalProps {
  onClose: () => void;
  onAdd: (listing: any) => void;
  userProfile: UserProfile | null;
}

export default function AddListingModal({ onClose, onAdd, userProfile }: AddListingModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'vegetables',
    itemType: 'produce',
    availability: 'swap' as 'swap' | 'free',
    quantity: '',
    photo: '',
    street: userProfile?.street || '',
    houseNumber: userProfile?.houseNumber || '',
    ownerName: userProfile?.name || '',
    lookingFor: '',
    expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({ ...formData, photo: e.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (formData.title && formData.ownerName && formData.street && formData.houseNumber) {
      const streetNumber = `${formData.houseNumber} ${formData.street}`;
      onAdd({ ...formData, streetNumber });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add Listing</h2>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
            {formData.photo ? (
              <div className="relative">
                <img src={formData.photo} alt="Preview" className="w-full h-48 object-cover rounded" />
                <button
                  onClick={() => setFormData({ ...formData, photo: '' })}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                >
                  ×
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <p className="text-sm text-gray-600">Click to upload photo</p>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
            )}
          </div>

          <input
            type="text"
            placeholder="What are you sharing?"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="herbs">Herbs</option>
              <option value="seeds">Seeds</option>
              <option value="preserves">Preserves & Jams</option>
              <option value="eggs">Eggs</option>
              <option value="honey">Honey</option>
              <option value="compost">Compost</option>
              <option value="tools">Garden Tools</option>
              <option value="flowers">Flowers</option>
              <option value="other">Other</option>
            </select>

            <select
              value={formData.itemType}
              onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="seedlings">Seedlings</option>
              <option value="produce">Fresh Produce</option>
              <option value="seeds">Seeds</option>
              <option value="cuttings">Cuttings</option>
              <option value="bulbs">Bulbs</option>
              <option value="preserves">Preserves</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setFormData({ ...formData, availability: 'swap' })}
              className={`py-3 px-4 rounded-lg border-2 ${
                formData.availability === 'swap'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200'
              }`}
            >
              For Swap
            </button>
            <button
              onClick={() => setFormData({ ...formData, availability: 'free' })}
              className={`py-3 px-4 rounded-lg border-2 ${
                formData.availability === 'free'
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-gray-200'
              }`}
            >
              Free
            </button>
          </div>

          {formData.availability === 'swap' && (
            <input
              type="text"
              placeholder="What I'm Looking For"
              value={formData.lookingFor}
              onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          )}

          <input
            type="text"
            placeholder="Your Name"
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Street"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Number"
              value={formData.houseNumber}
              onChange={(e) => setFormData({ ...formData, houseNumber: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <input
            type="text"
            placeholder="Quantity (optional)"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <div>
            <label className="block text-sm font-medium mb-2">Expiry Date</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          <div className="flex gap-2">
            <button onClick={handleSubmit} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Submit
            </button>
            <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
