import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle';

const Listing = () => {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    useEffect(() => {
        const fetchListing = async () => {

            try {
                setLoading(true);
                const listingId = params.listingId;
                console.log(listingId)
                const res = await axios.get(`/api/listing/get/${listingId}`);
                const data = res.data;
                console.log("in listing : ", data);
                if (data.success === false) {
                    setLoading(false);
                    setError(true);
                    console.log("error in getting listing");
                    return;
                }
                setLoading(false);
                setError(false);
                setListing(data);
            }
            catch (err) {
                console.log(err);
                setError(true);
                setLoading(false);
            }
        }
        fetchListing();
    }, [params.listingId]);
    return (
        <main>
            {error &&
                <p className='text-center my-7 text-xl sm:text-2xl md:text-4xl font-semibold text-slate-700 '>
                    Something went Wrong
                </p>
            }
            {loading &&
                <p className='text-center my-7 text-xl sm:text-2xl md:text-4xl font-semibold text-slate-700 '>
                    Loading...</p>
            }
            {listing && !loading && !error && (
                <Swiper navigation>
                    {listing.imageUrls.map((url) => (
                        <SwiperSlide key={url}>
                            <div 
                            className='md:h-[400px] sm:h-[300px] h-[200px] w-full  ' style={{background:`url(${url}) center no-repeat` ,backgroundSize:'cover' ,width: '100%',objectFit: 'cover', }}>
                              
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

        </main>
    )
}

export default Listing;