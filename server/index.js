import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import ImageKit from 'imagekit';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 5001;

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

app.get('/health', (req, res) => {
    res.json({
        success: "ok"
    })
});

app.get('/auth', (req, res) => {
    const result = imagekit.getAuthenticationParameters();

    return res.status(200).json({
        success: true,
        data: result,
        message: "success"
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
})