import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testGeminiTTS() {
  console.log('\n=== Starting Gemini TTS Test ===\n');

  // Step 1: Check environment variables
  console.log('Step 1: Checking environment variables...');
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('ERROR: GEMINI_API_KEY is not set in .env file');
    console.error('Please create a .env file with your API key:');
    console.error('  GEMINI_API_KEY=your_api_key_here\n');
    process.exit(1);
  }
  
  console.log('✓ GEMINI_API_KEY is set');
  console.log(`  Key length: ${apiKey.length} characters`);
  console.log(`  Key prefix: ${apiKey.substring(0, 10)}...`);

  // Step 2: Initialize Gemini client
  console.log('\nStep 2: Initializing Gemini client...');
  let genAI;
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('✓ Gemini client initialized');
  } catch (error) {
    console.error('ERROR: Failed to initialize Gemini client');
    console.error(`  ${error.message}\n`);
    process.exit(1);
  }

  // Step 3: Test with Arabic text
  console.log('\nStep 3: Testing TTS with Arabic text...');
  const testText = 'بسم الله الرحمن الرحيم';
  console.log(`  Test text: "${testText}"`);
  
  let audioData;
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.1-flash-tts-preview'
    });

    console.log('  Sending request to Gemini API...');
    const startTime = Date.now();
    
    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: testText
        }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: 'Charon'
            }
          }
        }
      }
    });

    const endTime = Date.now();
    console.log(`  ✓ Response received in ${((endTime - startTime) / 1000).toFixed(2)}s`);

    // Step 4: Extract audio data
    console.log('\nStep 4: Extracting audio data...');
    const response = result.response;
    
    if (!response.candidates?.[0]?.content?.parts) {
      throw new Error('No audio data in response');
    }

    const audioPart = response.candidates[0].content.parts.find(part => part.inlineData);
    if (!audioPart?.inlineData) {
      throw new Error('No audio data in response');
    }

    audioData = audioPart.inlineData.data;
    console.log(`  ✓ Audio extracted (${audioPart.inlineData.mimeType})`);

  } catch (error) {
    console.error('\nERROR: TTS synthesis failed');
    console.error(`  ${error.message}\n`);
    process.exit(1);
  }

  // Step 5: Save audio file
  console.log('\nStep 5: Saving audio file...');
  const outputPath = path.join(__dirname, 'test-output.wav');
  
  try {
    const buffer = Buffer.from(audioData, 'base64');
    fs.writeFileSync(outputPath, buffer);
    
    const fileSizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
    console.log(`  ✓ Audio saved: ${outputPath} (${fileSizeKB} KB)`);

  } catch (error) {
    console.error('\nERROR: Failed to save audio file');
    console.error(`  ${error.message}\n`);
    process.exit(1);
  }

  // Success summary
  console.log('\n=== Test Completed Successfully! ===\n');
  console.log('  ✓ Gemini API connection successful');
  console.log('  ✓ TTS synthesis working');
  console.log(`  ✓ Output: ${outputPath}`);
  console.log('\nNext steps:');
  console.log(`  1. Play audio: afplay ${outputPath}`);
  console.log('  2. Start backend: npm start');
  console.log('  3. Test frontend integration\n');
}

testGeminiTTS().catch(error => {
  console.error('\n=== Unexpected Error ===');
  console.error(error);
  process.exit(1);
});
