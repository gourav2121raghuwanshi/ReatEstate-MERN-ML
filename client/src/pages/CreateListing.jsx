import { useState } from 'react'
import { app } from '../firebase'
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';



const CreateListing = () => {
    const [files, setFiles] = useState([]);
    const [formData, setFormData] = useState({
        imageUrls: [],
    })
     const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    // console.log("file is ", files);
    // console.log(formData);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
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
                .catch((err) => {
                    // console.log(err);
                    setImageUploadError('Image upload failed (2 mb max per image)');
                    setUploading(false);
                });
        } else {
            console.log('You can only upload 6 images per listing');
            setImageUploadError('You can only upload 6 images per listing');
            setUploading(false);
        }
    };


    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL);
                    });
                }
            );
        });
    };

    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        });
    };

    return (
        <main className='p-5 max-w-6xl mx-auto'>
            <h1 className='sm:text-4xl text-xl text-gray-700 sm:font-bold font-semibold text-center my-7 '>
                Create a Listing
            </h1>

            <form className='flex flex-col sm:flex-row sm:gap-8 gap-5'>
                {/*  first side*/}
                <div className='flex flex-col gap-4 sm:gap-6 flex-1 '>

                    <input className='border p-3 rounded-lg ' type="text" placeholder='Name' id='name' maxLength='62' minLength='10' required />
                    <input className='border p-3 rounded-lg ' type="text" placeholder='Description' id='description' required />
                    <input className='border p-3 rounded-lg ' type="text" placeholder='Address' id='address' required />
                    <div className='flex flex-wrap gap-5 '>
                        <div className='flex gap-5 items-center'>
                            <input type='checkbox' id='sale' className='w-8 h-8' />
                            <span className='sm:text-xl text-lg font-semibold  text-slate-700'>Sale</span>
                        </div>
                        <div className='flex gap-5 items-center'>
                            <input type='checkbox' id='rent' className='w-8 h-8' />
                            <span className='sm:text-xl text-lg font-semibold  text-slate-700'>Rent</span>
                        </div>
                        <div className='flex gap-5 items-center'>
                            <input type='checkbox' id='parking' className='w-8 h-8' />
                            <span className='sm:text-xl text-lg font-semibold  text-slate-700'>Parking Spot</span>
                        </div>
                        <div className='flex gap-5 items-center'>
                            <input type='checkbox' id='furnished' className='w-8 h-8' />
                            <span className='sm:text-xl text-lg font-semibold  text-slate-700'>Furnished</span>
                        </div>
                        <div className='flex gap-5 items-center'>
                            <input type='checkbox' id='offer' className='w-8 h-8' />
                            <span className='sm:text-xl text-lg font-semibold text-slate-700 '>Offer</span>
                        </div>
                    </div>


                    <div className='flex  gap-5 flex-wrap '>
                        <div className='flex gap-5 items-center '>
                            <input id="bedrooms"
                                type="number"
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg ' />
                            <p className='sm:text-xl text-lg font-semibold  text-slate-700'>Beds</p>
                        </div>
                        <div className='flex gap-5 items-center '>
                            <input id="bathrooms"
                                type="number"
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg ' />
                            <p className='sm:text-xl text-lg font-semibold  text-slate-700'>Baths</p>
                        </div>
                        <div className='flex gap-5 items-center '>
                            <input id="regularPrice"
                                type="number"
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg ' />

                            <div className='text-xl font-semibold text-slate-700 flex flex-col gap-1 items-center' >
                                <p className='sm:text-xl text-lg font-semibold  text-slate-700'>  Regular Price </p>

                                <p className='sm:text-lg text-sm'>(₹ / Month)</p>
                            </div>

                        </div>
                        <div className='flex gap-5 items-center '>
                            <input id="discountPrice"
                                type="number"
                                min='1'
                                max='10'
                                required
                                className='p-3 border border-gray-300 rounded-lg ' />
                            <div className='text-xl font-semibold text-slate-700 flex flex-col items-center gap-1' >
                                <p className='sm:text-xl text-lg font-semibold  text-slate-700'>  Discount Price </p>
                                <p className='sm:text-lg text-sm'>(₹ / Month)</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* second side */}
                <div className='flex flex-col items-center gap-6 flex-1'>
                    <p className='sm:font-bold font-semibold sm:text-2xl text-lg'>
                        Images:
                        <span className='font-normal text-gray-600 text-sm sm:text-xl  ml-3 '>The first image will be the cover (max 6)</span>
                    </p>
                    <div className='flex gap-5 border p-1 border-gray-200 '>
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            type='file'
                            id='images'
                            accept='image/*'
                            multiple
                            className='sm:p-4 p-2  border  rounded sm:text-xl md:text-2xl text-lg  w-full'
                        />
                        <button
                            type='button'
                            onClick={handleImageSubmit}
                            className='sm:p-4 p-2 text-green-700 font-semibold sm:text-xl md:text-2xl text-lg  border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80 '>
                            {uploading?"Uploading...":"Upload"}
                        </button>
                    </div>

                    <p className='text-red-600 sm:text-xl text-lg md:text-2xl font-semibold '>{imageUploadError && imageUploadError}</p>

                    <div className='flex flex-col w-full md:gap-10 sm:gap-6 gap-4'>
                        {
                            formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                                <div
                                    className='flex flex-row justify-around md:gap-6 gap-3 sm:gap-4  items-center border   p-4'
                                    key={url}
                                >
                                    <img
                                        src={url}
                                        alt="listing image"
                                        className=' h-28 w-28  md:h-52 md:w-52 sm:h-36  sm:w-36 object-cover  rounded-lg '

                                    />
                                    <button type='button' onClick={()=>handleRemoveImage(index)} className='sm:p-4 p-2 bg-red-600 sm:text-xl font-semibold rounded-lg uppercase hover:opacity-75 text-white'>
                                        Delete
                                    </button>
                                </div>
                            ))}
                    </div>

                    <button className='sm:p-4 p-2 w-full sm:text-2xl text-lg  bg-slate-700 text-white rounded-lg shadow-lg uppercase hover:opacity-95 disabled:opacity-80 '>
                        Create Listing
                    </button>
                </div>
            </form>
        </main >
    )
}

export default CreateListing;