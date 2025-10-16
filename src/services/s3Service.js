const {
    S3Client,
    CreateBucketCommand,
    HeadBucketCommand,
    PutObjectCommand,
    GetObjectCommand,
} = require('@aws-sdk/client-s3');

const REGION = process.env.AWS_REGION;
const BUCKET = process.env.S3_BUCKET;

const s3 = new S3Client({ region: REGION });

async function bucketExists(bucketName) {
    try {
        await s3.send(new HeadBucketCommand({ Bucket: bucketName }));
        return true;
    } catch {
        return false;
    }
}

async function ensureBucketExists() {
    const exists = await bucketExists(BUCKET);
    if (!exists) await s3.send(new CreateBucketCommand({ Bucket: BUCKET }));
}

async function uploadFileToS3(file) {
    await s3.send(
        new PutObjectCommand({
            Bucket: BUCKET,
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,
        })
    );
    return file.originalname;
}

async function getFileFromS3(key) {
    const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
    const data = await s3.send(cmd);
    return data;
}

module.exports = { ensureBucketExists, uploadFileToS3, getFileFromS3 };
