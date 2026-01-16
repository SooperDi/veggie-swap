import { useState, useEffect } from 'react';
import { Listing, UserProfile } from './types';
import { storage } from './utils/storage';
import ListingCard from './components/ListingCard';
import AddListingModal from './components/AddListingModal';
import ProfileModal from './components/ProfileModal';
import ListingDetailModal from './components/ListingDetailModal';
import ProfileViewModal from './components/ProfileViewModal';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [allProfiles, setAllProfiles] = useState<Record<string, UserProfile>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [adminUserId, setAdminUserId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  const isAdmin = userId === adminUserId;

  useEffect(() => {
    initializeUser();
    loadAdminUser();
    loadListings();
    loadPendingListings();
    loadAllProfiles();

    const interval = setInterval(cleanupExpiredListings, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadAdminUser = async () => {
    try {
      const result = await storage.get('admin-user-id', true);
      if (result?.value) setAdminUserId(result.value);
    } catch (error) {
      console.log('No admin set yet');
    }
  };

  const setFirstUserAsAdmin = async (uid: string): Promise<boolean> => {
    try {
      const result = await storage.get('admin-user-id', true);
      if (!result?.value) {
        await storage.set('admin-user-id', uid, true);
        setAdminUserId(uid);
        return true;
      }
      return false;
    } catch (error) {
      await storage.set('admin-user-id', uid, true);
      setAdminUserId(uid);
      return true;
    }
  };

  const initializeUser = () => {
    let storedUserId = localStorage.getItem('veggie-swap-user-id');
    if (!storedUserId) {
      storedUserId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('veggie-swap-user-id', storedUserId);
    }
    setUserId(storedUserId);
    loadProfile(storedUserId);
  };

  const loadProfile = async (uid: string) => {
    try {
      const result = await storage.get(`profile-${uid}`);
      if (result?.value) setUserProfile(JSON.parse(result.value));
    } catch (error) {
      console.log('No profile found');
    }
  };

  const loadAllProfiles = async () => {
    try {
      const result = await storage.get('all-profiles', true);
      if (result?.value) setAllProfiles(JSON.parse(result.value));
    } catch (error) {
      console.log('No profiles found');
    }
  };

  const loadListings = async () => {
    try {
      const result = await storage.get('veggie-listings', true);
      if (result?.value) {
        const loadedListings: Listing[] = JSON.parse(result.value);
        const uniqueListings = loadedListings.filter(
          (listing, index, self) => index === self.findIndex((l) => l.id === listing.id)
        );
        setListings(uniqueListings);
      }
    } catch (error) {
      setListings([]);
    }
  };

  const loadPendingListings = async () => {
    try {
      const result = await storage.get('pending-listings', true);
      if (result?.value) {
        const loadedPending: Listing[] = JSON.parse(result.value);
        const uniquePending = loadedPending.filter(
          (listing, index, self) => index === self.findIndex((l) => l.id === listing.id)
        );
        setPendingListings(uniquePending);
      }
    } catch (error) {
      setPendingListings([]);
    }
  };

  const cleanupExpiredListings = async () => {
    try {
      const result = await storage.get('veggie-listings', true);
      if (result?.value) {
        const currentListings: Listing[] = JSON.parse(result.value);
        const now = new Date();
        const activeListings = currentListings.filter((listing) => {
          const expiryDate = new Date(listing.expiryDate);
          return expiryDate > now;
        });

        if (activeListings.length !== currentListings.length) {
          await storage.set('veggie-listings', JSON.stringify(activeListings), true);
          setListings(activeListings);
        }
      }
    } catch (error) {
      console.error('Error cleaning up expired listings:', error);
    }
  };

  const saveListings = async (newListings: Listing[]) => {
    try {
      await storage.set('veggie-listings', JSON.stringify(newListings), true);
      setListings(newListings);
    } catch (error) {
      console.error('Error saving listings:', error);
    }
  };

  const savePendingListings = async (newPendingListings: Listing[]) => {
    try {
      await storage.set('pending-listings', JSON.stringify(newPendingListings), true);
      setPendingListings(newPendingListings);
    } catch (error) {
      console.error('Error saving pending listings:', error);
    }
  };

  const saveProfile = async (profile: UserProfile) => {
    if (!userId) return;
    try {
      await storage.set(`profile-${userId}`, JSON.stringify(profile));
      const updatedProfiles = { ...allProfiles, [userId]: profile };
      await storage.set('all-profiles', JSON.stringify(updatedProfiles), true);
      setUserProfile(profile);
      setAllProfiles(updatedProfiles);
      setShowProfileForm(false);

      const isNewAdmin = await setFirstUserAsAdmin(userId);
      if (isNewAdmin) {
        alert('🎉 Congratulations! You are now the admin. You can approve/reject listings from the Admin panel.');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const addListing = async (newListing: Partial<Listing>) => {
    if (!userId) return;
    try {
      const listing: Listing = {
        ...newListing,
        id: Date.now(),
        date: new Date().toISOString(),
        requests: [],
        ownerName: userProfile?.name || newListing.ownerName || '',
        ownerId: userId,
        ownerPhoto: userProfile?.photo || '',
        status: 'pending',
      } as Listing;

      const updatedPending = [listing, ...pendingListings];
      await savePendingListings(updatedPending);
      setShowAddForm(false);
      alert('Your listing has been submitted for approval!');
    } catch (error) {
      console.error('Error adding listing:', error);
      alert('Failed to add listing. Please try again.');
    }
  };

  const approveListing = async (listingId: number) => {
    const listing = pendingListings.find((l) => l.id === listingId);
    if (!listing) return;

    try {
      const updatedPending = pendingListings.filter((l) => l.id !== listingId);
      const approvedListing = { ...listing, status: 'approved' as const };
      const updatedListings = [approvedListing, ...listings];

      await savePendingListings(updatedPending);
      await saveListings(updatedListings);
    } catch (error) {
      console.error('Error approving listing:', error);
      alert('Failed to approve listing. Please try again.');
    }
  };

  const rejectListing = async (listingId: number) => {
    try {
      const updatedPending = pendingListings.filter((l) => l.id !== listingId);
      await savePendingListings(updatedPending);
    } catch (error) {
      console.error('Error rejecting listing:', error);
    }
  };

  const addRequest = async (listingId: number, request: Omit<import('./types').Request, 'id'>) => {
    try {
      const updated = listings.map((listing) => {
        if (listing.id === listingId) {
          return { ...listing, requests: [...listing.requests, { ...request, id: Date.now() }] };
        }
        return listing;
      });
      await saveListings(updated);
    } catch (error) {
      console.error('Error adding request:', error);
    }
  };

  const deleteListing = async (listingId: number) => {
    try {
      const updated = listings.filter((listing) => listing.id !== listingId);
      await saveListings(updated);
      setSelectedListing(null);
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || listing.category === filterCategory;
    const matchesType = filterType === 'all' || listing.itemType === filterType;
    const matchesAvailability = filterAvailability === 'all' || listing.availability === filterAvailability;

    return matchesSearch && matchesCategory && matchesType && matchesAvailability;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <header className="bg-white border-b border-green-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-green-800">🌱 Veggie Swap</h1>
            </div>
            <div className="flex gap-2">
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition relative"
                >
                  Admin
                  {pendingListings.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {pendingListings.length}
                    </span>
                  )}
                </button>
              )}
              <button
                onClick={() => setShowProfileForm(true)}
                className="px-4 py-2 border border-green-600 text-green-600 rounded-lg hover:bg-green-50 transition"
              >
                {userProfile ? 'Profile' : 'Create Profile'}
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                + Add Listing
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search veggies, fruits, herbs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Categories</option>
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
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All Types</option>
                  <option value="seedlings">Seedlings</option>
                  <option value="produce">Fresh Produce</option>
                  <option value="seeds">Seeds</option>
                  <option value="cuttings">Cuttings</option>
                  <option value="bulbs">Bulbs</option>
                  <option value="preserves">Preserves</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="all">All</option>
                  <option value="swap">For Swap</option>
                  <option value="free">Free Giveaway</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No listings yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onClick={() => setSelectedListing(listing)}
                onProfileClick={(e) => {
                  e.stopPropagation();
                  setSelectedProfile(allProfiles[listing.ownerId]);
                }}
              />
            ))}
          </div>
        )}
      </main>

      {showProfileForm && (
        <ProfileModal onClose={() => setShowProfileForm(false)} onSave={saveProfile} profile={userProfile} />
      )}
      {showAddForm && (
        <AddListingModal onClose={() => setShowAddForm(false)} onAdd={addListing} userProfile={userProfile} />
      )}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onAddRequest={addRequest}
          onDelete={deleteListing}
          userProfile={userProfile}
          onProfileClick={() => setSelectedProfile(allProfiles[selectedListing.ownerId])}
        />
      )}
      {selectedProfile && <ProfileViewModal profile={selectedProfile} onClose={() => setSelectedProfile(null)} />}
      {showAdminPanel && isAdmin && (
        <AdminPanel
          pendingListings={pendingListings}
          onClose={() => setShowAdminPanel(false)}
          onApprove={approveListing}
          onReject={rejectListing}
        />
      )}
    </div>
  );
}
