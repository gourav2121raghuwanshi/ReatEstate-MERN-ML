import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useRef } from 'react'
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase'

export default function Profile() {

  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({})
  console.log(formData)

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setFilePerc(Math.round(progress))
      // console.log("upload is ", progress)
    },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
          ((downloadURL) =>
            setFormData({ ...FormData, avatar: downloadURL })
          )
      });
  };

  return (
    <div className='p-3 max-w-xl mx-auto ' >
      <h1 className='sm:text-4xl text-2xl text-gray-700 font-bold text-center my-7 '>Profile</h1>
      <form className='flex flex-col   gap-6'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          accept='image/*'
          hidden
        />
        <img
          src={formData.avatar || currentUser.avatar}
          onClick={() => fileRef.current.click()}
          alt="profile image"
          className='rounded-full h-20 w-20  sm:h-40 sm:w-40 object-cover cursor-pointer mt-4 self-center'
        />
        <p className='text-sm self-center'>

          {
            fileUploadError ?
              <span className='text-red-700 text-xl font-semibold'>Error in Image Uploading (image must be less than 2Mb )</span> :
              filePerc > 0 && filePerc < 100 ?
                <span className='text-slate-700 text-xl font-semibold'> Uploading {filePerc}% </span> :
                filePerc === 100 ? <span className='text-green-700 text-xl font-semibold'>Image Uploaded Successfully</span> : ""
          }

        </p>
        <input type='text' placeholder='username' className='border ring-opacity-50 shadow-lg border-grey-200 sm:text-2xl p-1 sm:p-5 rounded-lg ' id='username' />
        <input type='text' placeholder='email' className='border border-grey-200 ring-opacity-50 shadow-lg sm:text-2xl p-1 sm:p-5 rounded-lg ' id='email' />
        <input type='password' placeholder='password' className='border border-grey-200  ring-opacity-50 shadow-lg sm:text-2xl p-1 sm:p-5 rounded-lg ' id='password' />
        <button className='bg-slate-700 text-white  sm:text-2xl text-xl font-semibold rounded-lg p-1 sm:p-5 uppercase hover:opacity-95 disabled:opacity-80'>
          update
        </button>
      </form>
      <div className='flex justify-between mt-4'>
        <span className='text-red-500 text-2xl  font-semibold   cursor-pointer'>Delete Account</span>
        <span className='text-red-500 text-2xl font-semibold   cursor-pointer'>Sign Out</span>
      </div>



    </div>
  )
}

// export default Profile