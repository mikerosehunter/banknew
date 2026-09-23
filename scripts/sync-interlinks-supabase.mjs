import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import { injectInBodyInterlinks } from '../src/lib/inBodyInterlinker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const envPath = path.join(rootDir, '.env.local');
let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (!supabaseUrl) supabaseUrl = envContent.match(/SUPABASE_URL=(.*)/)?.[1]?.trim();
  if (!supabaseKey) supabaseKey = envContent.match(/SUPABASE_SERVICE_KEY=(.*)/)?.[1]?.trim();
}

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function sync() {
  console.log('🔄 Fetching published articles from Supabase...');
  const { data: articles, error } = await supabase
    .from('bw_articles')
    .select('*')
    .eq('status', 'published');

  if (error) {
    console.error('Error fetching articles:', error);
    process.exit(1);
  }

  console.log(`Processing ${articles.length} published articles...`);
  let updatedCount = 0;

  for (const article of articles) {
    const originalContent = article.content || '';
    const enhancedContent = injectInBodyInterlinks(originalContent, article, articles);

    if (enhancedContent !== originalContent) {
      const { error: updateError } = await supabase
        .from('bw_articles')
        .update({ content: enhancedContent, updated_at: new Date().toISOString() })
        .eq('id', article.id);

      if (updateError) {
        console.error(`Error updating article ${article.slug}:`, updateError);
      } else {
        updatedCount++;
      }
    }
  }

  console.log(`✅ Successfully updated ${updatedCount} articles in Supabase database!`);
}

sync();
