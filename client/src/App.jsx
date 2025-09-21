import React, { useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRef } from "react";
import { useEffect } from "react";

const App = () => {
  const [uploadImage, setUploadImage] = useState(null);
  const uploadRef = useRef();

  // Function to fetch auth from backend
  const fetchAuth = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/auth`);
      if (res.data.success) {
        return res.data.data;
      } else {
        throw new Error("Failed to fetch auth params");
      }
    } catch (err) {
      console.error("❌ Auth Fetch Failed", err);
      return null;
    }
  };

  const postProfile = async (url) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/profile`,
        {
          imageUrl: url,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        localStorage.setItem("image", url)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error?.message || error?.response?.data?.message);
    }
  };

  useEffect(()=>{
    const imgFromLS = localStorage.getItem("image");
    if(imgFromLS){
      setUploadImage(imgFromLS);
    }
  }, [])

  return (
    <div className="min-h-screen">
      <IKContext
        publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
        urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
        authenticator={fetchAuth}
      >
        <div className="p-4">
          <IKUpload
            ref={uploadRef}
            fileName="text-upload.jpg"
            accept="image/*"
            className="hidden"
            onClick={() => {
              toast.loading("Uploading image...", { id: "upload-toast" });
            }}
            onProgress={() => {
              toast.loading(`Uploading...`, { id: "upload-toast" });
            }}
            onError={(err) =>
              toast.error("Upload failed ❌", { id: "upload-toast" })
            }
            onSuccess={(res) => {
              setUploadImage(res.url);
              postProfile(res.url);
              setTimeout(() => {
                toast.success("Upload successful ✅", { id: "upload-toast" });
              }, 1000);
            }}
          />

          <Toaster position="top-right" />
        </div>
      </IKContext>
      <h2 className="py-10 text-xl font-bold text-center">Image upload using ImageKit</h2>
      <div className="flex flex-col justify-center items-center inset-0">
        <div className="bg-gray-300 shadow-md rounded-md w-[400px] py-8">
          <img
            src={uploadImage || "/user.png" }
            alt="user-orofile"
            className="w-[120px] h-[120px] rounded-full object-cover bg-white block mx-auto p-1 cursor-pointer"
            onClick={() => uploadRef.current?.click()}
          />
          <button className="font-medium px-7 py-2 border-1 border-black rounded-full my-4 block mx-auto bg-white cursor-pointer" onClick={() => uploadRef.current?.click()}>Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default App;
