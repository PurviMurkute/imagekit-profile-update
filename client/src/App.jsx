import React, { useState } from "react";
import { IKContext, IKUpload } from "imagekitio-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const App = () => {
  const [uploadImage, setUploadImage] = useState(null);

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

  return (
    <IKContext
      publicKey={import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY}
      urlEndpoint={import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT}
      authenticator={fetchAuth}
    >
      <div className="p-4">
        <IKUpload
          fileName="text-upload.jpg"
          accept="image/*"
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
            setTimeout(()=>{
              toast.success("Upload successful ✅", { id: "upload-toast" });
            }, 1000)
          }}
        />

        {uploadImage && (
          <img
            src={uploadImage}
            alt="Uploaded"
            style={{ width: "300px", marginTop: "20px" }}
          />
        )}

        <Toaster position="top-right" />
      </div>
    </IKContext>
  );
};

export default App;
