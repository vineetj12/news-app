import "dotenv/config";
import { analyzeSentiment } from './services/sentimentService';
import { getTrendingNews, increaseArticleView } from './services/trendingService';
import { addBookmark, removeBookmark, getUserBookmarks } from './services/bookmarkService';
import { mlService } from './services/mlService';
import { generateSummary, explainNews, listModels } from './services/aiService';
import { fileURLToPath } from 'url';


async function testSentiment() {
  console.log('\n=== Sentiment Service Test ===');
  const text = 'This is a great product and I love it!';
  const sentiment = analyzeSentiment(text);
  console.log('Sentiment:', sentiment);
}

async function testTrending() {
  console.log('\n=== Trending Service Test ===');
  try {
    const trend = await getTrendingNews();
    console.log('Trending length:', trend.length);
  } catch (error) {
    console.error('Trending service error', error);
  }
  // Do not attempt increaseArticleView unless you have a valid ID in DB.
}

async function testBookmark() {
  console.log('\n=== Bookmark Service Test ===');
  // Caution: needs DB + valid user/article IDs
  console.log('Skipping create/delete unless DB IDs are available.');
}

async function testML() {
  console.log('\n=== ML Service Test ===');
  const text = 'This is a sample news text that should not be fake.';
  const score = await mlService.getReliabilityScore(text);
  console.log('ML reliability score:', score);
  const health = await mlService.healthCheck();
  console.log('ML service health:', health);
  const isConnected = await mlService.testConnection();
  console.log('ML testConnection:', isConnected);
}

async function testAI() {
  console.log('\n=== AI Service Test ===');
  const modelList = await listModels();
  console.log('Available OpenAI models count:', modelList.length);

  const sample = 'Apple releases a new iPhone with advanced camera features.';
  const summary = await generateSummary(sample);
  console.log('AI summary:', summary);
  const explanation = await explainNews(sample);
  console.log('AI explanation:', explanation);
}

async function runAllTests() {
  await testSentiment();
  await testTrending();
  await testBookmark();
  await testML();
  await testAI();
  console.log('\nAll test scripts have executed.');
}

const __filename = fileURLToPath(import.meta.url);

if (process.argv[1] === __filename) {
  runAllTests().catch((err) => {
    console.error('Service tests failed', err);
    process.exit(1);
  });
}
