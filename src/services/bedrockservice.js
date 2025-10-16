const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

const REGION = process.env.AWS_REGION;
const MODEL_ID = process.env.BEDROCK_MODEL_ID;

const client = new BedrockRuntimeClient({ region: REGION });

async function analyzeAudioWithBedrock(metadata) {
    if (!MODEL_ID) throw new Error('BEDROCK_MODEL_ID missing');

    const input = {
        prompt: `Analyze audio file ${metadata.filename}, size ${metadata.size} bytes.`,
    };

    const command = new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(input),
    });

    const response = await client.send(command);
    const text = await response.body.transformToString();
    return JSON.parse(text);
}

module.exports = { analyzeAudioWithBedrock };
