import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { useSelector } from 'react-redux';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import Contact from '../components/Contact';
import toast, { Toaster } from 'react-hot-toast';

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const params = useParams();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      <Toaster position="top-right" />
      {loading && <p className="text-center my-7 text-2xl">Loading...</p>}
      {error && (
        <p className="text-center my-7 text-2xl">Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <Swiper navigation>
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div className="relative h-[550px]">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div
                    className="h-full w-full bg-center bg-no-repeat bg-cover"
                    style={{ backgroundImage: `url(${url})` }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Share Button */}
          <div
            className="fixed top-[13%] right-[3%] z-20 border rounded-full w-12 h-12 flex justify-center items-center bg-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              toast.success('Link copied!');
            }}
          >
            <FaShare className="text-slate-700" />
          </div>

          {/* Content */}
          <div className="flex flex-col max-w-4xl mx-auto p-4 my-8">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-lg border border-slate-200 space-y-4">
              <h1 className="text-4xl font-extrabold text-gray-900 capitalize">
                {listing.name} - ${' '}
                {listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && (
                  <span className="text-lg font-medium"> / month</span>
                )}
              </h1>

              <p className="flex items-center gap-2 text-slate-600 text-sm">
                <FaMapMarkerAlt className="text-green-700" />
                {listing.address}
              </p>

              <div className="flex gap-4">
                <p className="bg-blue-800 text-white text-center px-3 py-1 rounded-md text-sm font-semibold">
                  {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                </p>
                {listing.offer && (
                  <p className="bg-green-600 text-white text-center px-3 py-1 rounded-md text-sm font-semibold">
                    ${+listing.regularPrice - +listing.discountPrice} OFF
                  </p>
                )}
              </div>

              <p className="text-gray-800">
                <span className="font-bold text-black">Description - </span>
                {listing.description}
              </p>

              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-1">
                  <FaBed className="text-lg" />
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds`
                    : `${listing.bedrooms} bed`}
                </li>
                <li className="flex items-center gap-1">
                  <FaBath className="text-lg" />
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths`
                    : `${listing.bathrooms} bath`}
                </li>
                <li className="flex items-center gap-1">
                  <FaParking className="text-lg" />
                  {listing.parking ? 'Parking spot' : 'No Parking'}
                </li>
                <li className="flex items-center gap-1">
                  <FaChair className="text-lg" />
                  {listing.furnished ? 'Furnished' : 'Unfurnished'}
                </li>
              </ul>

              {currentUser && listing.userRef !== currentUser._id && !contact && (
                <button
                  onClick={() => setContact(true)}
                  className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 w-full mt-4"
                >
                  Contact landlord
                </button>
              )}
              {contact && <Contact listing={listing} />}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
