import sharp from "sharp";
import cloudinary from "../config/cloudinary.js";

export const processAndUpload = async (buffer, folder = "Photo-Sasha") => {

    //resize + compress with sharp
    const optimizedBuffer = await sharp(buffer)
        .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82 })
        .toBuffer();

    //upload to cloudinary

    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
                format: "webp",
                transformation: [{ quality: "auto", fetch_format: "auto" }],
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );
        stream.end(optimizedBuffer);
    });
}