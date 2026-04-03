import { useEffect, useState } from 'react';
import { app } from '../firebase';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

const cityOptions = [
  'Mumbai',
  'Delhi',
  'Pune',
  'Bangalore',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Haryana',
  'Bhopal',
  'Surat',
  'Goa',
  'Ahmedabad',
  'Gurgaon',
  'Noida',
  'Indore',
  'Jaipur',
];

const UpdateListing = () => {
  const buri = import.meta.env.VITE_BACKEND_URI;
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    type: 'rent',
    regularPrice: 1550,
    discountPrice: 1550,
    bathroom: 1,
    bedroom: 1,
    furnished: false,
    parking: false,
    offer: false,
    imageUrls: [],
    userRef: '',
    area: 50,
    bhk: 1,
    city: '',
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSubmit = () => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i += 1) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 MB max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) =>
    new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        () => {},
        (uploadError) => reject(uploadError),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }
    if (e.target.type === 'number' || e.target.type === 'text' || e.target.tagName === 'TEXTAREA') {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
    if (e.target.id === 'city') {
      setFormData({
        ...formData,
        city: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(false);
      const res = await axios.post(
        `${buri}/listing/update/${params.listingId}`,
        {
          ...formData,
          userRef: currentUser._id,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${currentUser.token}`,
          },
          withCredentials: true,
        }
      );

      const data = await res.data;
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
        return;
      }
      navigate(`/listing/${data._id}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchListing = async () => {
      const res = await axios.get(`${buri}/listing/get/${params.listingId}`, {
        withCredentials: true,
      });
      const data = await res.data;
      if (data.success === false) {
        return;
      }
      setFormData(data);
    };

    fetchListing();
  }, [buri, params.listingId]);

  const selectAsMainPhoto = (e, fileName) => {
    e.preventDefault();
    const reorderedPhotos = [fileName, ...formData.imageUrls.filter((file) => file !== fileName)];
    setFormData({
      ...formData,
      imageUrls: reorderedPhotos,
    });
  };

  const optionClass = (checked) =>
    `toggle-chip ${checked ? '!bg-[color:var(--accent)] !text-white' : ''}`;

  return (
    <main className='page-shell'>
      <div className='glass-panel-strong p-6 sm:p-8'>
        <div className='max-w-3xl space-y-3'>
          <span className='eyebrow'>Listing studio</span>
          <h1 className='section-heading'>Update your property presentation</h1>
          <p className='section-copy'>
            Keep the same functionality while refining how each property looks and reads across the site.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]'>
          <section className='glass-panel p-5 sm:p-6'>
            <div className='grid gap-5'>
              <div>
                <label htmlFor='name' className='field-label'>Property name</label>
                <input onChange={handleChange} value={formData.name} className='field-shell' type='text' placeholder='Name' id='name' maxLength='62' minLength='10' required />
              </div>
              <div>
                <label htmlFor='description' className='field-label'>Description</label>
                <textarea placeholder='Description' className='field-shell min-h-[140px] resize-none' id='description' required onChange={handleChange} value={formData.description} maxLength={600} />
              </div>
              <div>
                <label htmlFor='address' className='field-label'>Address</label>
                <input onChange={handleChange} value={formData.address} className='field-shell' type='text' placeholder='Address' id='address' required />
              </div>
              <div>
                <label htmlFor='city' className='field-label'>City</label>
                <select onChange={handleChange} value={formData.city} className='field-shell' required id='city'>
                  <option value='' disabled>Select City</option>
                  {cityOptions.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className='field-label'>Listing options</p>
                <div className='flex flex-wrap gap-3'>
                  <label className={optionClass(formData.type === 'sale')} htmlFor='sale'><input onChange={handleChange} checked={formData.type === 'sale'} type='checkbox' id='sale' className='h-4 w-4 accent-[color:var(--accent)]' /> Sale</label>
                  <label className={optionClass(formData.type === 'rent')} htmlFor='rent'><input type='checkbox' id='rent' className='h-4 w-4 accent-[color:var(--accent)]' onChange={handleChange} checked={formData.type === 'rent'} /> Rent</label>
                  <label className={optionClass(formData.parking)} htmlFor='parking'><input onChange={handleChange} checked={formData.parking} type='checkbox' id='parking' className='h-4 w-4 accent-[color:var(--accent)]' /> Parking Spot</label>
                  <label className={optionClass(formData.furnished)} htmlFor='furnished'><input type='checkbox' id='furnished' className='h-4 w-4 accent-[color:var(--accent)]' onChange={handleChange} checked={formData.furnished} /> Furnished</label>
                  <label className={optionClass(formData.offer)} htmlFor='offer'><input onChange={handleChange} checked={formData.offer} type='checkbox' id='offer' className='h-4 w-4 accent-[color:var(--accent)]' /> Offer</label>
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div>
                  <label htmlFor='bedroom' className='field-label'>Beds</label>
                  <input onChange={handleChange} value={formData.bedroom} id='bedroom' type='number' min='1' max='10' required className='field-shell' />
                </div>
                <div>
                  <label htmlFor='bathroom' className='field-label'>Baths</label>
                  <input id='bathroom' type='number' min='1' max='10' required onChange={handleChange} value={formData.bathroom} className='field-shell' />
                </div>
                <div>
                  <label htmlFor='bhk' className='field-label'>BHK</label>
                  <input onChange={handleChange} value={formData.bhk} id='bhk' type='number' min='1' max='100' required className='field-shell' />
                </div>
                <div>
                  <label htmlFor='area' className='field-label'>Area (square feet)</label>
                  <input onChange={handleChange} value={formData.area} id='area' type='number' min='10' max='50000000' required className='field-shell' />
                </div>
                <div>
                  <label htmlFor='regularPrice' className='field-label'>Regular price</label>
                  <input id='regularPrice' onChange={handleChange} value={formData.regularPrice} type='number' min='1500' max='500000000000' required className='field-shell' />
                </div>
                <div>
                  <label htmlFor='discountPrice' className='field-label'>Discount price</label>
                  <input onChange={handleChange} value={formData.discountPrice} id='discountPrice' type='number' min='1500' max='50000000000' required className='field-shell' />
                </div>
              </div>
            </div>
          </section>

          <section className='glass-panel p-5 sm:p-6'>
            <div className='space-y-5'>
              <div>
                <p className='field-label'>Images</p>
                <p className='text-sm leading-7 text-[color:var(--muted)]'>
                  Keep the first image as your cover photo, or choose a new one from the gallery below.
                </p>
              </div>

              <div className='flex flex-col gap-3 sm:flex-row'>
                <input
                  onChange={(e) => setFiles(e.target.files)}
                  type='file'
                  id='images'
                  accept='image/*'
                  multiple
                  className='field-shell'
                />
                <button type='button' onClick={handleImageSubmit} className='btn-secondary whitespace-nowrap'>
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>

              {imageUploadError && <p className='text-sm font-semibold text-[#9f3f36]'>{imageUploadError}</p>}

              <div className='space-y-4'>
                {formData.imageUrls?.length > 0 &&
                  formData.imageUrls.map((url, index) => (
                    <div className='glass-panel flex items-center gap-4 p-3' key={url}>
                      <div className='relative'>
                        <img src={url} loading='lazy' alt='listing' className='h-24 w-24 rounded-[18px] object-cover sm:h-28 sm:w-28' />
                        <button
                          onClick={(e) => {
                            selectAsMainPhoto(e, url);
                          }}
                          className='absolute bottom-2 left-2 rounded-full bg-black/60 px-2 py-1 text-xs font-semibold text-white'
                        >
                          {index === 0 ? 'Cover' : 'Set cover'}
                        </button>
                      </div>
                      <div className='ml-auto'>
                        <button type='button' onClick={() => handleRemoveImage(index)} className='btn-secondary !text-[#9f3f36]'>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <button className='btn-primary w-full !rounded-[22px] !py-4 uppercase'>
                {loading ? 'Updating...' : 'Update Listing'}
              </button>
              {error && <p className='text-sm font-semibold text-[#9f3f36]'>{error}</p>}
            </div>
          </section>
        </form>
      </div>
    </main>
  );
};

export default UpdateListing;
