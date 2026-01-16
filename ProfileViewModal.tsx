import { UserProfile } from '../types';

interface ProfileViewModalProps {
  profile: UserProfile;
  onClose: () => void;
}

export default function ProfileViewModal({ profile, onClose }: ProfileViewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-4">Grower Profile</h2>
        <div className="text-center mb-4">
          {profile.photo ? (
            <img src={profile.photo} alt={profile.name} className="w-24 h-24 rounded-full object-cover mx-auto" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 mx-auto flex items-center justify-center text-4xl">👤</div>
          )}
          <h3 className="mt-3 text-xl font-bold">{profile.name}</h3>
          <p className="text-gray-600">
            {profile.houseNumber} {profile.street}
          </p>
        </div>

        {profile.producesAvailable && (
          <div className="bg-green-50 p-4 rounded-lg mb-3">
            <h4 className="font-semibold text-green-800 mb-2">What I Grow</h4>
            <p className="text-green-700">{profile.producesAvailable}</p>
          </div>
        )}

        {profile.lookingFor && (
          <div className="bg-blue-50 p-4 rounded-lg mb-3">
            <h4 className="font-semibold text-blue-800 mb-2">What I'm Looking For</h4>
            <p className="text-blue-700">{profile.lookingFor}</p>
          </div>
        )}

        <button onClick={onClose} className="w-full py-2 border rounded-lg hover:bg-gray-50">
          Close
        </button>
      </div>
    </div>
  );
}
