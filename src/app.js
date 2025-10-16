require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const audioRoutes = require('./routes/audioRoutes');

const app = express();
app.use(express.json());

/**
 * Swagger configuration
 */
const swaggerOptions = {
    definition: {
        openapi: '3.0.3',
        info: {
            title: 'AWS Bedrock Audio API',
            version: '1.0.0',
            description: 'API to upload and retrieve audio files using AWS S3 and Bedrock',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./src/routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Routes
 */
app.use('/api/audio', audioRoutes);
app.get('/', (req, res) => res.send('AWS Bedrock Audio API is running'));

module.exports = app;
