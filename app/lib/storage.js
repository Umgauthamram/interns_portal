import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
});

/**
 * Upload a file to Cloudflare R2
 * @param {Buffer | ReadableStream | string | Uint8Array} file - The file content
 * @param {string} fileName - The name of the file
 * @param {string} contentType - The MIME type of the file
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
export async function uploadFile(file, fileName, contentType) {
    const bucketName = process.env.R2_BUCKET_NAME;

    const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: file,
        ContentType: contentType,
    });

    try {
        await s3Client.send(command);
        // If public URL is configured, return it
        if (process.env.R2_PUBLIC_URL) {
            return `${process.env.R2_PUBLIC_URL}/${fileName}`;
        }
        return `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${bucketName}/${fileName}`;
    } catch (error) {
        console.error("Error uploading file to R2:", error);
        throw error;
    }
}

/**
 * Generate a signed URL for a file in R2
 * @param {string} fileName - The key/name of the file
 * @param {number} expiresIn - Expiration time in seconds (default 1 hour)
 * @returns {Promise<string>}
 */
export async function getPresignedUrl(fileName, expiresIn = 3600) {
    const command = new GetObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
    });

    try {
        return await getSignedUrl(s3Client, command, { expiresIn });
    } catch (error) {
        console.error("Error generating presigned URL:", error);
        throw error;
    }
}
