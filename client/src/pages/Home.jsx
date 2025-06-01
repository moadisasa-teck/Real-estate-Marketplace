import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingItem from '../components/ListingItem';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch('/api/listing/get?offer=true&limit=4');
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-100 py-28 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-700">
          Find your next <span className="text-indigo-600">perfect</span>
          <br />
          place with ease
        </h1>
        <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-xl mx-auto">
          Integrated Housing is the best place to find your next perfect place to live. We have a wide range of properties for you to choose from.
        </p>
        <Link
          to="/search"
          className="mt-6 inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Let's get started
        </Link>
      </div>

      {/* Swiper */}
      <div className="max-w-6xl mx-auto mt-10">
        <Swiper navigation className="rounded-lg overflow-hidden shadow-lg">
          {offerListings &&
            offerListings.length > 0 &&
            offerListings.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  style={{
                    backgroundImage: `url(${listing.imageUrls[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  className="h-[400px] sm:h-[500px] relative"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h2 className="text-white text-2xl sm:text-4xl font-semibold drop-shadow-lg">
                      {listing.name}
                    </h2>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Listings */}
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {[
          { title: 'Recent offers', listings: offerListings, query: 'offer=true' },
          { title: 'Recent places for rent', listings: rentListings, query: 'type=rent' },
          { title: 'Recent places for sale', listings: saleListings, query: 'type=sale' },
        ].map(({ title, listings, query }) =>
          listings && listings.length > 0 ? (
            <div key={title}>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-semibold text-slate-600">{title}</h2>
                <Link
                  className="text-blue-600 text-sm hover:underline"
                  to={`/search?${query}`}
                >
                  Show more
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {listings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}
