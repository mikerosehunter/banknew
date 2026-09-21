require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function publishFiles(fileList) {
  for (const filename of fileList) {
    const filePath = path.isAbsolute(filename) ? filename : (fs.existsSync(filename) ? filename : path.join(__dirname, 'bofa_batch1', filename));
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      continue;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    const art = JSON.parse(raw);
    const wc = art.content.split(/\s+/).filter(Boolean).length;
    console.log(`\nProcessing: "${art.title}"`);
    console.log(`- Slug: ${art.slug}`);
    console.log(`- Category: ${art.category}`);
    console.log(`- Bank: ${art.bank_name}`);
    console.log(`- Word Count: ${wc} words`);

    if (wc < 750) {
      console.warn(`WARNING: Word count is low (${wc} words)! Needs expansion.`);
    }

    const payload = {
      title: art.title,
      slug: art.slug,
      content: art.content,
      excerpt: art.excerpt,
      meta_description: art.meta_description,
      category: art.category,
      bank_name: art.bank_name,
      status: 'published',
      published_at: new Date().toISOString()
    };

    // Check if article already exists by slug
    const { data: existing } = await supabase.from('bw_articles').select('id').eq('slug', art.slug).maybeSingle();
    if (existing) {
      console.log(`- Updating existing article ID: ${existing.id}`);
      const { data, error } = await supabase.from('bw_articles').update(payload).eq('id', existing.id).select().single();
      if (error) console.error('Update error:', error);
      else console.log(`✓ Updated successfully!`);
    } else {
      console.log(`- Inserting new article...`);
      const { data, error } = await supabase.from('bw_articles').insert(payload).select().single();
      if (error) console.error('Insert error:', error);
      else console.log(`✓ Inserted successfully! ID: ${data.id}`);
    }
  }
}

// Check arguments or default to files in bofa_batch1
const args = process.argv.slice(2);
const filesToProcess = args.length > 0 ? args : ['art1.json', 'art2.json', 'art3.json', 'art4.json', 'art5.json'];

publishFiles(filesToProcess).then(() => {
  console.log('\nPublish run completed!');
});
