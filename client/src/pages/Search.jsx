import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import ListingItem from '../components/ListingItem';

const Search = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sideBardata, setSideBarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const buri = import.meta.env.VITE_BACKEND_URI;
  const [llmSearch, setLlmSearch] = useState(false);
  const [llmText, setLlmText] = useState('');
  const [showMore, setShowMore] = useState(false);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSideBarData({ ...sideBardata, type: e.target.id });
    }
    if (e.target.id === 'searchTerm') {
      setSideBarData({ ...sideBardata, searchTerm: e.target.value });
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSideBarData({
        ...sideBardata,
        [e.target.id]: e.target.checked || e.target.checked === 'true',
      });
    }
    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSideBarData({ ...sideBardata, sort, order });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true',
        furnished: furnishedFromUrl === 'true',
        offer: offerFromUrl === 'true',
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const res = await axios.get(`${buri}/listing/get?${searchQuery}`, {
          withCredentials: true,
        });
        const data = await res.data;
        if (data.success === false) {
          setLoading(false);
          return;
        }
        setShowMore(data.length > 8);
        setLoading(false);
        setListings(data);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchListings();
  }, [buri, location.search]);

  const onShowMoreClick = async () => {
    const startIndex = listings.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();

    const res = await axios.get(`${buri}/listing/get?${searchQuery}`, {
      withCredentials: true,
    });
    const data = await res.data;
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setShowMore(false);
    setLlmText('');

    try {
      if (llmSearch) {
        if (!sideBardata.searchTerm.trim()) {
          setListings([]);
          setLoading(false);
          return;
        }

        const res = await axios.get(`${buri}/listing/search`, {
          params: { query: sideBardata.searchTerm.trim() },
          withCredentials: true,
        });

        const data = res.data;
        setListings(data.listings || []);
        setLlmText(data.text || '');
      } else {
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sideBardata.searchTerm);
        urlParams.set('type', sideBardata.type);
        urlParams.set('parking', sideBardata.parking);
        urlParams.set('furnished', sideBardata.furnished);
        urlParams.set('offer', sideBardata.offer);
        urlParams.set('sort', sideBardata.sort);
        urlParams.set('order', sideBardata.order);
        navigate(`/search?${urlParams.toString()}`);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const checkboxLabel = (id, label, checked) => (
    <label className={`toggle-chip ${checked ? '!bg-[color:var(--accent)] !text-white' : ''}`} htmlFor={id}>
      <input
        checked={checked}
        onChange={handleChange}
        type='checkbox'
        id={id}
        className='h-4 w-4 accent-[color:var(--accent)]'
      />
      <span>{label}</span>
    </label>
  );

  return (
    <div className='page-shell'>
      <div className='grid gap-6 xl:grid-cols-[340px_1fr]'>
        <aside className='glass-panel-strong h-fit p-6 xl:sticky xl:top-28'>
          <span className='eyebrow'>Property search</span>
          <h1 className='section-heading mt-5 !text-3xl'>Refine your next move</h1>
          <p className='section-copy mt-3'>
            Use classic filters or let the LLM-assisted search help summarize what matches.
          </p>

          <form onSubmit={handleSubmit} className='mt-8 flex flex-col gap-6'>
            <label className='toggle-chip w-fit' htmlFor='llmSearch'>
              <input
                type='checkbox'
                id='llmSearch'
                checked={llmSearch}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setLlmSearch(checked);
                  if (!checked) {
                    setLlmText('');
                  }
                }}
                className='h-4 w-4 accent-[color:var(--accent)]'
              />
              <span>Use LLM Search</span>
            </label>

            <div>
              <label htmlFor='searchTerm' className='field-label'>
                Search term
              </label>
              <input
                value={sideBardata.searchTerm}
                onChange={handleChange}
                type='text'
                id='searchTerm'
                name='searchTerm'
                placeholder='Mumbai skyline apartment'
                className='field-shell'
              />
            </div>

            <div>
              <p className='field-label'>Type</p>
              <div className='flex flex-wrap gap-3'>
                {checkboxLabel('all', 'Rent & Sell', sideBardata.type === 'all')}
                {checkboxLabel('rent', 'Rent', sideBardata.type === 'rent')}
                {checkboxLabel('sale', 'Sale', sideBardata.type === 'sale')}
                {checkboxLabel('offer', 'Offer', sideBardata.offer)}
              </div>
            </div>

            <div>
              <p className='field-label'>Amenities</p>
              <div className='flex flex-wrap gap-3'>
                {checkboxLabel('parking', 'Parking', sideBardata.parking)}
                {checkboxLabel('furnished', 'Furnished', sideBardata.furnished)}
              </div>
            </div>

            <div>
              <label htmlFor='sort_order' className='field-label'>
                Sort by
              </label>
              <select
                onChange={handleChange}
                value={`${sideBardata.sort}_${sideBardata.order}`}
                id='sort_order'
                className='field-shell'
              >
                <option value='regularPrice_desc'>Price high to low</option>
                <option value='regularPrice_asc'>Price low to high</option>
                <option value='createdAt_desc'>Latest</option>
                <option value='createdAt_asc'>Oldest</option>
              </select>
            </div>

            <button className='btn-primary w-full !rounded-[22px] !py-4 uppercase'>Search</button>
          </form>
        </aside>

        <section className='space-y-5'>
          {llmText && (
            <div className='glass-panel border-l-4 border-l-[color:var(--sun)] p-5'>
              <p className='field-label !mb-2 !tracking-[0.2em]'>LLM Summary</p>
              <p className='text-sm leading-7 text-[color:var(--text)] sm:text-base'>{llmText}</p>
            </div>
          )}

          <div className='glass-panel-strong p-6'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <p className='text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--accent)]'>
                  Listing results
                </p>
                <h2 className='section-heading mt-2 !text-3xl'>
                  {loading ? 'Searching properties...' : `${listings.length} properties found`}
                </h2>
              </div>
              {!loading && listings.length > 0 && (
                <p className='text-sm text-[color:var(--muted)]'>
                  Curated across premium rentals, sales, and active offers
                </p>
              )}
            </div>
          </div>

          <div className='flex flex-wrap gap-6'>
            {!loading && listings.length === 0 && (
              <div className='glass-panel w-full p-10 text-center text-base font-semibold text-[color:var(--muted)]'>
                No listings found for the current search.
              </div>
            )}
            {loading && (
              <div className='glass-panel w-full p-10 text-center text-base font-semibold text-[color:var(--muted)]'>
                Loading results...
              </div>
            )}
            {!loading &&
              listings.map((listing) => <ListingItem key={listing._id} listing={listing} />)}
          </div>

          {showMore && (
            <div className='flex justify-center'>
              <button className='btn-secondary' onClick={onShowMoreClick}>
                Show More
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Search;
