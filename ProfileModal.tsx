import { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  profile: UserProfile | null;
}

export default function ProfileModal({ onClose, onSave, profile }: ProfileModalProps) {
  const [formData, setFormData] = useState<UserProfile>(
    profile || { name: '', photo: '', street: '', houseNumber: '', producesAvailable: '', lookingFor: '' }
  );

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

  const handleSave = () => {
    if (formData.name && formData.street && formData.houseNumber) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">{profile ? 'Edit Profile' : 'Create Profile'}</h2>
        <div className="space-y-4">
          <div className="flex flex-col items-center mb-4">
            {formData.photo ? (
              <img src={formData.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl">👤</div>
            )}
            <label className="mt-2 cursor-pointer text-green-600 hover:underline">
              Upload Photo
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>

          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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

          <textarea
            placeholder="What I Grow"
            value={formData.producesAvailable}
            onChange={(e) => setFormData({ ...formData, producesAvailable: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <textarea
            placeholder="What I'm Looking For"
            value={formData.lookingFor}
            onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg"
          />

          <div className="flex gap-2">
            <button onClick={handleSave} className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
              Save
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
