const express = require('express');
const multer = require('multer');
const { uploadAudio, getAudio } = require('../controllers/audioController');

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 300 * 1024 * 1024 } }); // 300MB

/**
 * @openapi
 * /api/audio/upload:
 *   post:
 *     summary: Upload an audio file to S3
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 */
router.post('/upload', upload.single('file'), uploadAudio);

/**
 * @openapi
 * /api/audio/{key}:
 *   get:
 *     summary: Retrieve an audio file by its S3 key
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Audio file stream returned
 *       404:
 *         description: File not found
 */
router.get('/:key', getAudio);

module.exports = router;
