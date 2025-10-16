const { uploadFileToS3, getFileFromS3, ensureBucketExists } = require('../services/s3Service');
const { analyzeAudioWithBedrock } = require('../services/bedrockService');

exports.uploadAudio = async (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ message: 'No file uploaded' });

        await ensureBucketExists();
        const key = await uploadFileToS3(file);

        let analysis = null;
        try {
            analysis = await analyzeAudioWithBedrock({ filename: file.originalname, size: file.size });
        } catch (err) {
            console.warn('Bedrock analysis failed:', err.message);
        }

        res.json({ message: 'File uploaded successfully', key, analysis });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Upload failed', error: err.message });
    }
};

exports.getAudio = async (req, res) => {
    try {
        const { key } = req.params;
        const data = await getFileFromS3(key);

        res.setHeader('Content-Type', data.ContentType || 'application/octet-stream');
        data.Body.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(404).json({ message: 'File not found', error: err.message });
    }
};
