import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Heart, MapPin, Maximize, Bed, Bath, Car, DollarSign, TrendingUp, Filter, Search, ChevronRight, X, Phone, Mail, User, MessageSquare } from 'lucide-react';

const MarketplacePlatform = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const navigate = useNavigate();

  const listings = [
    {
      id: 1,
      type: 'house',
      title: 'Modern Villa with Pool',
      price: 485000,
      location: 'Nairobi, Karen',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
      beds: 5,
      baths: 4,
      sqft: 4500,
      condition: 'Excellent',
      description: 'Stunning modern villa featuring a private pool, spacious garden, and breathtaking views. Perfect for luxury family living.',
      features: ['Swimming Pool', 'Garden', 'Garage', 'Security', 'Modern Kitchen']
    },
    {
      id: 2,
      type: 'car',
      title: 'Mercedes-Benz C300 2021',
      price: 52000,
      location: 'Nairobi, Westlands',
      image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      mileage: '15,000 km',
      engine: '2.0L Turbo',
      horsepower: 255,
      condition: 'Excellent',
      description: 'Luxury sedan with advanced technology, premium leather interior, and exceptional performance. Low mileage, single owner.',
      features: ['Leather Seats', 'Sunroof', 'Navigation', 'Parking Sensors', 'Bluetooth']
    },
    {
      id: 3,
      type: 'land',
      title: 'Prime Agricultural Land',
      price: 125000,
      location: 'Kiambu County',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      acres: 5.5,
      zoning: 'Agricultural',
      condition: 'Good',
      description: 'Fertile agricultural land with water access, perfect for farming or investment. Clear title deed available.',
      features: ['Water Access', 'Fertile Soil', 'Road Access', 'Clear Title', 'Fenced']
    },
    {
      id: 4,
      type: 'house',
      title: 'Luxury Penthouse',
      price: 890000,
      location: 'Nairobi, Kilimani',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      beds: 4,
      baths: 3,
      sqft: 3200,
      condition: 'Excellent',
      description: 'Exquisite penthouse with panoramic city views, modern finishes, and premium amenities. Prime location.',
      features: ['City Views', 'Gym Access', 'Parking', 'Security', 'Balcony']
    },
    {
      id: 5,
      type: 'car',
      title: 'Toyota Land Cruiser 2020',
      price: 95000,
      location: 'Mombasa',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
      mileage: '32,000 km',
      engine: '4.5L V8',
      horsepower: 304,
      condition: 'Good',
      description: 'Powerful and reliable SUV, perfect for both city and off-road adventures. Well-maintained with service history.',
      features: ['4WD', 'Leather Interior', '7 Seats', 'Cruise Control', 'Alloy Wheels']
    },
    {
      id: 6,
      type: 'land',
      title: 'Beachfront Property',
      price: 275000,
      location: 'Diani Beach',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      acres: 2.3,
      zoning: 'Mixed Use',
      condition: 'Excellent',
      description: 'Rare beachfront property with stunning ocean views. Ideal for resort development or private residence.',
      features: ['Beach Access', 'Ocean View', 'Development Potential', 'Clear Title', 'Utilities Available']
    },
    {
      id: 7,
      type: 'house',
      title: 'Contemporary Family Home',
      price: 320000,
      location: 'Nairobi, Runda',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      beds: 4,
      baths: 3,
      sqft: 3500,
      condition: 'Good',
      description: 'Beautiful family home in a serene neighborhood with spacious rooms and modern amenities throughout.',
      features: ['Large Garden', 'Guest Wing', 'Modern Kitchen', 'Parking', 'Security']
    },
    {
      id: 8,
      type: 'car',
      title: 'BMW X5 2022',
      price: 78000,
      location: 'Nairobi, Parklands',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      mileage: '8,500 km',
      engine: '3.0L I6',
      horsepower: 335,
      condition: 'Excellent',
      description: 'Premium luxury SUV with cutting-edge technology and supreme comfort. Barely driven, like new condition.',
      features: ['Panoramic Roof', 'Premium Sound', 'Adaptive Cruise', 'Heated Seats', 'Keyless Entry']
    },
    {
      id: 9,
      type: 'land',
      title: 'Development Plot',
      price: 85000,
      location: 'Machakos',
      image: 'https://images.unsplash.com/photo-1500076656116-558758c991c1?w=800',
      acres: 1.8,
      zoning: 'Residential',
      condition: 'Good',
      description: 'Prime residential plot in a developing area with excellent investment potential. Ready for construction.',
      features: ['Residential Zone', 'Electricity', 'Water Connection', 'Road Access', 'Title Deed']
    }
  ];

  const filteredListings = listings.filter(listing => {
    if (selectedCategory === 'all') return true;
    return listing.type === selectedCategory;
  }).filter(listing => {
    if (selectedCondition === 'all') return true;
    return listing.condition.toLowerCase() === selectedCondition;
  });
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const CategoryBadge = ({ icon: Icon, label, value, active }) => (
    <button
      onClick={() => setSelectedCategory(value)}
      className={`relative overflow-hidden rounded-2xl px-6 py-4 transition-all duration-300 ${
        active 
          ? 'bg-white/30 backdrop-blur-xl border-2 border-white/40 shadow-xl' 
          : 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20'
      }`}
    >
      <div className="relative z-10 flex flex-col items-center gap-2">
        <Icon className={`w-6 h-6 ${active ? 'text-gray-800' : 'text-gray-600'}`} />
        <span className={`text-sm font-semibold ${active ? 'text-gray-800' : 'text-gray-600'}`}>{label}</span>
      </div>
      {active && (
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/10 animate-pulse" />
      )}
    </button>
  );

  const ListingCard = ({ listing }) => (
    <div className="group relative overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl border border-white/30 hover:bg-white/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl">
      {/* Liquid glass morphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative">
        {/* Image */}
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          <img 
            src={listing.image} 
            alt={listing.title}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Floating glass badge */}
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/30 backdrop-blur-md rounded-full border border-white/40 text-xs font-semibold text-gray-800">
            {listing.condition}
          </div>
          
          {/* Heart icon */}
          <button className="absolute top-4 left-4 p-2 bg-white/30 backdrop-blur-md rounded-full border border-white/40 hover:bg-white/50 transition-all">
            <Heart className="w-5 h-5 text-gray-800" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Type badge */}
          <div className="inline-block px-3 py-1 mb-3 bg-gradient-to-r from-[#c8d5c0]/30 to-[#b8cdb0]/30 backdrop-blur-sm rounded-full border border-white/30">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
              {listing.type}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
            {listing.title}
          </h3>

          <div className="flex items-center gap-2 mb-4 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{listing.location}</span>
          </div>

          {/* Specs */}
          <div className="flex gap-4 mb-4 flex-wrap">
            {listing.type === 'house' && (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                  <Bed className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{listing.beds}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                  <Bath className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{listing.baths}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                  <Maximize className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{listing.sqft} sqft</span>
                </div>
              </>
            )}
            {listing.type === 'car' && (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                  <TrendingUp className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{listing.mileage}</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                  <span className="text-sm font-medium text-gray-700">{listing.horsepower} HP</span>
                </div>
              </>
            )}
            {listing.type === 'land' && (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                  <Maximize className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{listing.acres} acres</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30">
                  <span className="text-sm font-medium text-gray-700">{listing.zoning}</span>
                </div>
              </>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-4 px-3 py-2 bg-white/30 backdrop-blur-sm rounded-lg border border-white/30 w-fit">
            <span className="text-sm font-semibold text-gray-700">Status:</span>
            <span className={`text-sm font-bold ${listing.condition === 'Excellent' ? 'text-green-700' : 'text-blue-700'}`}>
              Available
            </span>
          </div>

          {/* Price and CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-white/30">
            <div>
              <div className="text-sm text-gray-600 mb-1">Price</div>
              <div className="text-2xl font-bold text-gray-800">
                KSh {(listing.price * 130).toLocaleString()}
              </div>
            </div>
            <button 
              onClick={() => setSelectedListing(listing)}
              className="px-6 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#d4e4d0] via-[#c8d5c0] to-[#b8cdb0]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/30 border-b border-white/30 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-12">
              <h1 className="text-3xl font-bold text-gray-800">NPLin</h1>
              <nav className="hidden md:flex gap-8">
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Marketplace</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Solutions</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Technology</a>
                <a href="#" className="text-gray-700 hover:text-gray-900 font-medium transition-colors">Contact</a>
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 text-gray-800 font-semibold rounded-xl border border-white/40 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Logout
            </button>

          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
              Premium <span className="text-gray-700">Marketplace</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto">
              Discover exceptional properties, vehicles, and land opportunities
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="relative">
              <div className="flex items-center gap-4 p-4 bg-white/30 backdrop-blur-xl rounded-2xl border border-white/40 shadow-2xl">
                <Search className="w-6 h-6 text-gray-600 ml-2" />
                <input
                  type="text"
                  placeholder="Search for houses, cars, land..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-600 text-lg"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Category Selection */}
          <div className="flex justify-center gap-4 mb-12">
            <CategoryBadge icon={Filter} label="All" value="all" active={selectedCategory === 'all'} />
            <CategoryBadge icon={Bed} label="Houses" value="house" active={selectedCategory === 'house'} />
            <CategoryBadge icon={Car} label="Cars" value="car" active={selectedCategory === 'car'} />
            <CategoryBadge icon={Maximize} label="Land" value="land" active={selectedCategory === 'land'} />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="flex items-center gap-4 p-4 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-700" />
            <span className="font-semibold text-gray-800">Filters:</span>
          </div>
          
          <select 
            value={selectedCondition}
            onChange={(e) => setSelectedCondition(e.target.value)}
            className="px-4 py-2 bg-white/40 backdrop-blur-sm rounded-lg border border-white/30 text-gray-800 font-medium outline-none cursor-pointer"
          >
            <option value="all">All Conditions</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
          </select>

          <div className="ml-auto text-gray-700 font-medium">
            {filteredListings.length} Results
          </div>
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4].map(page => (
            <button
              key={page}
              className={`w-12 h-12 rounded-xl font-semibold transition-all duration-300 ${
                page === 1
                  ? 'bg-white/40 backdrop-blur-xl border-2 border-white/50 text-gray-800 shadow-lg'
                  : 'bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 hover:bg-white/30'
              }`}
            >
              {page}
            </button>
          ))}
          <button className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 text-gray-700 hover:bg-white/30 transition-all duration-300 flex items-center justify-center">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Details Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl">
            {/* Close Button */}
            <button
              onClick={() => setSelectedListing(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-white/40 backdrop-blur-md rounded-full border border-white/50 hover:bg-white/60 transition-all"
            >
              <X className="w-6 h-6 text-gray-800" />
            </button>

            {/* Modal Content */}
            <div className="p-8">
              {/* Image */}
              <div className="relative h-96 rounded-2xl overflow-hidden mb-6">
                <img
                  src={selectedListing.image}
                  alt={selectedListing.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="inline-block px-4 py-2 bg-white/30 backdrop-blur-md rounded-full border border-white/40 text-sm font-semibold text-white">
                    {selectedListing.condition}
                  </div>
                </div>
              </div>

              {/* Title and Location */}
              <div className="mb-6">
                <div className="inline-block px-3 py-1 mb-3 bg-gradient-to-r from-[#c8d5c0]/30 to-[#b8cdb0]/30 backdrop-blur-sm rounded-full border border-white/30">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    {selectedListing.type}
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-gray-800 mb-3">{selectedListing.title}</h2>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5" />
                  <span className="text-lg">{selectedListing.location}</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 p-6 bg-white/30 backdrop-blur-md rounded-2xl border border-white/40">
                <div className="text-sm text-gray-600 mb-1">Price</div>
                <div className="text-4xl font-bold text-gray-800">
                  KSh {(selectedListing.price * 130).toLocaleString()}
                </div>
              </div>

              {/* Specifications */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {selectedListing.type === 'house' && (
                    <>
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <Bed className="w-6 h-6 text-gray-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{selectedListing.beds}</div>
                        <div className="text-sm text-gray-600">Bedrooms</div>
                      </div>
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <Bath className="w-6 h-6 text-gray-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{selectedListing.baths}</div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                      </div>
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <Maximize className="w-6 h-6 text-gray-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{selectedListing.sqft}</div>
                        <div className="text-sm text-gray-600">Sq Ft</div>
                      </div>
                    </>
                  )}
                  {selectedListing.type === 'car' && (
                    <>
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <TrendingUp className="w-6 h-6 text-gray-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{selectedListing.mileage}</div>
                        <div className="text-sm text-gray-600">Mileage</div>
                      </div>
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <Car className="w-6 h-6 text-gray-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{selectedListing.engine}</div>
                        <div className="text-sm text-gray-600">Engine</div>
                      </div>
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <div className="text-2xl font-bold text-gray-800">{selectedListing.horsepower}</div>
                        <div className="text-sm text-gray-600">Horsepower</div>
                      </div>
                    </>
                  )}
                  {selectedListing.type === 'land' && (
                    <>
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <Maximize className="w-6 h-6 text-gray-600 mb-2" />
                        <div className="text-2xl font-bold text-gray-800">{selectedListing.acres}</div>
                        <div className="text-sm text-gray-600">Acres</div>
                      </div>
                      <div className="p-4 bg-white/30 backdrop-blur-md rounded-xl border border-white/30">
                        <div className="text-2xl font-bold text-gray-800">{selectedListing.zoning}</div>
                        <div className="text-sm text-gray-600">Zoning</div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Description</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  {selectedListing.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedListing.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-3 bg-white/30 backdrop-blur-md rounded-lg border border-white/30">
                      <div className="w-2 h-2 bg-[#b8cdb0] rounded-full" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Button */}
              <button
                onClick={() => {
                  setShowContactModal(true);
                  setSelectedListing(null);
                }}
                className="w-full py-4 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Contact Seller
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white/20 backdrop-blur-2xl rounded-3xl border border-white/30 shadow-2xl p-8">
            {/* Close Button */}
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-2 bg-white/40 backdrop-blur-md rounded-full border border-white/50 hover:bg-white/60 transition-all"
            >
              <X className="w-5 h-5 text-gray-800" />
            </button>

            <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Seller</h2>

            <form className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 placeholder-gray-600 outline-none focus:border-white/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 placeholder-gray-600 outline-none focus:border-white/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="tel"
                    placeholder="+254 700 000 000"
                    className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 placeholder-gray-600 outline-none focus:border-white/60 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-600" />
                  <textarea
                    rows="4"
                    placeholder="I'm interested in this listing..."
                    className="w-full pl-11 pr-4 py-3 bg-white/40 backdrop-blur-md rounded-xl border border-white/40 text-gray-800 placeholder-gray-600 outline-none focus:border-white/60 transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#c8d5c0] to-[#b8cdb0] hover:from-[#b8cdb0] hover:to-[#a8bd9f] text-gray-800 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketplacePlatform;