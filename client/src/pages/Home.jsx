import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import { FaArrowRight, FaBuilding, FaKey, FaMapMarkedAlt } from 'react-icons/fa';
import ListingItem from '../components/ListingItem';

const FALLBACK_IMAGE =
  'https://cdn.pixabay.com/photo/2017/06/16/15/58/luxury-home-2409518_640.jpg';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const buri = import.meta.env.VITE_BACKEND_URI;

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`${buri}/listing/get?offer=true&limit=4`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`${buri}/listing/get?type=rent&limit=4`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`${buri}/listing/get?type=sale&limit=4`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOfferListings();
  }, [buri]);

  const spotlightListings = offerListings.length
    ? offerListings
    : saleListings.length
      ? saleListings
      : rentListings;

  const stats = [
    { label: 'Premium listings', value: '200+', icon: <FaBuilding /> },
    { label: 'Cities covered', value: '16', icon: <FaMapMarkedAlt /> },
    { label: 'Happy movers', value: '98%', icon: <FaKey /> },
  ];

  const sections = [
    {
      title: 'Recent offers',
      description: 'Handpicked homes with active pricing advantages and standout value.',
      link: '/search?offer=true',
      linkLabel: 'See all offers',
      listings: offerListings,
    },
    {
      title: 'Places for rent',
      description: 'Flexible spaces designed for modern living, work, and city access.',
      link: '/search?type=rent',
      linkLabel: 'Browse rentals',
      listings: rentListings,
    },
    {
      title: 'Places for sale',
      description: 'Long-term homes selected for lifestyle, location, and investment potential.',
      link: '/search?type=sale',
      linkLabel: 'Explore homes to buy',
      listings: saleListings,
    },
  ];

  return (
    <div className='page-shell space-y-12'>
      <section className='hero-mesh glass-panel-strong relative overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10'>
        <div className='grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center'>
          <div className='space-y-6'>
            <span className='eyebrow'>Mindful luxury for modern living</span>
            <div className='space-y-4'>
              <h1 className='hero-title'>
                Discover a real estate experience that feels curated, calm, and premium.
              </h1>
              <p className='max-w-2xl text-base leading-8 text-[color:var(--muted)] sm:text-lg'>
                FindYourHome helps buyers, renters, and investors explore standout properties
                with a cleaner search flow, richer presentation, and a more elevated sense of trust.
              </p>
            </div>
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Link to='/search' className='btn-primary gap-2'>
                Explore Properties <FaArrowRight />
              </Link>
              <Link to='/about' className='btn-secondary'>
                Learn Our Approach
              </Link>
            </div>
            <div className='grid gap-4 sm:grid-cols-3'>
              {stats.map((stat) => (
                <div key={stat.label} className='stat-card'>
                  <div className='mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]'>
                    {stat.icon}
                  </div>
                  <p className='text-3xl font-extrabold text-[color:var(--text)]'>{stat.value}</p>
                  <p className='mt-1 text-sm text-[color:var(--muted)]'>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className='glass-panel relative overflow-hidden p-4 sm:p-5'>
            <div className='mb-4 flex items-center justify-between'>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[color:var(--accent)]'>
                  Featured spotlight
                </p>
                <p className='mt-1 font-[Fraunces] text-2xl text-[color:var(--text)]'>
                  Signature residences
                </p>
              </div>
              <span className='rounded-full bg-[color:var(--sand)] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--accent-strong)]'>
                Live now
              </span>
            </div>
            <div className='space-y-3'>
              {spotlightListings.slice(0, 3).map((listing, index) => (
                <Link
                  key={listing._id}
                  to={`/listing/${listing._id}`}
                  className='flex items-center gap-4 rounded-[24px] border border-[color:var(--line)] bg-white/70 p-3 transition hover:-translate-y-1'
                >
                  <img
                    src={listing?.imageUrls?.[0] || FALLBACK_IMAGE}
                    alt={listing.name}
                    className='h-24 w-24 rounded-[18px] object-cover'
                  />
                  <div className='min-w-0 flex-1'>
                    <p className='text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted)]'>
                      0{index + 1}
                    </p>
                    <p className='mt-1 line-clamp-1 text-lg font-bold text-[color:var(--text)]'>
                      {listing.name}
                    </p>
                    <p className='mt-1 line-clamp-1 text-sm text-[color:var(--muted)]'>
                      {listing.address}
                    </p>
                    <p className='mt-3 text-sm font-bold text-[color:var(--accent)]'>
                      Rs. {(listing.offer ? listing.discountPrice : listing.regularPrice).toLocaleString('en-US')}
                    </p>
                  </div>
                </Link>
              ))}
              {!spotlightListings.length && (
                <div className='rounded-[24px] border border-dashed border-[color:var(--line)] px-5 py-10 text-center text-sm text-[color:var(--muted)]'>
                  Featured properties will appear here once listings are loaded.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className='glass-panel overflow-hidden'>
        <div className='flex flex-col gap-4 px-6 py-6 sm:px-8 lg:flex-row lg:items-end lg:justify-between'>
          <div className='space-y-3'>
            <span className='eyebrow'>Immersive previews</span>
            <h2 className='section-heading'>Browse homes through a cinematic showcase</h2>
            <p className='section-copy max-w-2xl'>
              Large-format imagery gives every listing more presence, helping visitors scan
              quality, light, and architecture before diving into details.
            </p>
          </div>
          <Link to='/search' className='btn-secondary w-fit'>
            View all properties
          </Link>
        </div>
        <Swiper navigation>
          {spotlightListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <Link to={`/listing/${listing._id}`} className='block'>
                <div className='relative h-[260px] sm:h-[420px] lg:h-[560px]'>
                  <img
                    src={listing?.imageUrls?.[0] || FALLBACK_IMAGE}
                    alt={listing.name}
                    className='h-full w-full object-cover'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-[#10271f]/80 via-[#10271f]/20 to-transparent' />
                  <div className='absolute inset-x-0 bottom-0 p-6 text-white sm:p-8'>
                    <p className='text-xs font-semibold uppercase tracking-[0.28em] text-white/80'>
                      {listing.type === 'rent' ? 'Rental spotlight' : 'Purchase spotlight'}
                    </p>
                    <h3 className='mt-2 font-[Fraunces] text-3xl sm:text-5xl'>{listing.name}</h3>
                    <p className='mt-3 max-w-2xl text-sm leading-7 text-white/84 sm:text-base'>
                      {listing.description}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <section className='space-y-8'>
        {sections.map(
          (section) =>
            section.listings.length > 0 && (
              <div key={section.title} className='space-y-5'>
                <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
                  <div className='space-y-2'>
                    <h2 className='section-heading'>{section.title}</h2>
                    <p className='section-copy max-w-2xl'>{section.description}</p>
                  </div>
                  <Link to={section.link} className='btn-secondary w-fit'>
                    {section.linkLabel}
                  </Link>
                </div>
                <div className='flex flex-wrap gap-6'>
                  {section.listings.map((listing) => (
                    <ListingItem listing={listing} key={listing._id} />
                  ))}
                </div>
              </div>
            )
        )}
      </section>

      <section className='glass-panel-strong px-6 py-8 sm:px-8'>
        <div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
          <div className='space-y-3'>
            <span className='eyebrow'>Your opinion matters</span>
            <h2 className='section-heading'>Help us refine the experience</h2>
            <p className='section-copy max-w-2xl'>
              Share a quick review and tell us how the platform feels after the redesign.
            </p>
          </div>
          <Link to='/rate' className='btn-primary w-fit'>
            Rate FindYourHome
          </Link>
        </div>
      </section>
    </div>
  );
}
