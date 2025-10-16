const request = require('supertest');
const app = require('../src/app');

jest.mock('../src/services/s3Service', () => ({
    ensureBucketExists: jest.fn().mockResolvedValue(),
    uploadFileToS3: jest.fn().mockResolvedValue('mockfile.wav'),
    getFileFromS3: jest.fn().mockResolvedValue({
        ContentType: 'audio/wav',
        Body: { pipe: jest.fn() },
    }),
}));

jest.mock('../src/services/bedrockService', () => ({
    analyzeAudioWithBedrock: jest.fn().mockResolvedValue({ tags: ['music'] }),
}));

describe('Audio API', () => {
    it('GET / should return running message', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
    });

    it('POST /api/audio/upload should succeed', async () => {
        const res = await request(app)
            .post('/api/audio/upload')
            .attach('file', Buffer.from('test'), 'file.wav');
        expect(res.statusCode).toBe(200);
    });
});
