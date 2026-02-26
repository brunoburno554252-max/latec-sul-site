const { chromium } = require('playwright');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const UPLOAD_DIR = '/var/www/uploads';
const GALLERY_DIR = '/var/www/uploads/gallery';

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.laeducacao.com.br/',
      }
    };
    protocol.get(url, options, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      const file = fs.createWriteStream(filepath);
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  // Create gallery dir
  if (!fs.existsSync(GALLERY_DIR)) {
    fs.mkdirSync(GALLERY_DIR, { recursive: true });
  }

  const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Senh@Segura2024!',
    database: 'faculdade_db'
  });

  // Get all posts
  const [posts] = await db.execute('SELECT id, slug, title, image FROM blog_posts ORDER BY id');
  console.log(`Total posts in DB: ${posts.length}`);

  // Launch browser to navigate original blog and extract images
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });

  // First, get all post URLs from original blog
  const blogPage = await context.newPage();
  await blogPage.goto('https://www.laeducacao.com.br/blog', { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  // Scroll to load all posts
  for (let i = 0; i < 30; i++) {
    await blogPage.evaluate(() => window.scrollBy(0, 800));
    await new Promise(r => setTimeout(r, 500));
  }
  await new Promise(r => setTimeout(r, 2000));

  // Get all post URLs
  const postUrls = await blogPage.evaluate(() => {
    const links = document.querySelectorAll('a[href*="/post/"]');
    const urls = [];
    links.forEach(l => {
      const href = l.href;
      if (href && !urls.includes(href)) urls.push(href);
    });
    return urls;
  });
  console.log(`Found ${postUrls.length} post URLs on original blog`);
  await blogPage.close();

  // For each post in our DB, find matching URL and extract images
  for (const post of posts) {
    console.log(`\n--- Processing post ${post.id}: ${post.title.substring(0, 50)} ---`);
    
    // Find matching URL
    const slug = post.slug;
    let matchedUrl = null;
    for (const url of postUrls) {
      const decodedUrl = decodeURIComponent(url).toLowerCase();
      // Match by first few words of title
      const titleWords = post.title.toLowerCase().split(' ').slice(0, 4).join(' ');
      if (decodedUrl.includes(titleWords.substring(0, 20))) {
        matchedUrl = url;
        break;
      }
    }

    if (!matchedUrl) {
      // Try matching by slug keywords
      const slugWords = slug.split('-').slice(0, 5).join('-');
      for (const url of postUrls) {
        const decodedUrl = decodeURIComponent(url).toLowerCase().replace(/-/g, ' ');
        if (decodedUrl.includes(slugWords.replace(/-/g, ' '))) {
          matchedUrl = url;
          break;
        }
      }
    }

    if (!matchedUrl) {
      console.log(`  SKIP: No matching URL found`);
      continue;
    }

    console.log(`  URL: ${matchedUrl}`);

    const page = await context.newPage();
    try {
      await page.goto(matchedUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));

      // Scroll down to load all images
      for (let i = 0; i < 10; i++) {
        await page.evaluate(() => window.scrollBy(0, 500));
        await new Promise(r => setTimeout(r, 300));
      }

      // Extract all content images (not logo, not navigation)
      const images = await page.evaluate(() => {
        const imgs = [];
        const allImgs = document.querySelectorAll('img');
        allImgs.forEach(img => {
          const src = img.src || '';
          const width = img.naturalWidth || img.width || 0;
          const height = img.naturalHeight || img.height || 0;
          const alt = img.alt || '';
          
          // Skip tiny images (logos, icons)
          if (width < 100 && height < 100) return;
          // Skip if it's the LA logo
          if (src.includes('Logo_LAEDUCA') || src.includes('logo_la')) return;
          // Skip navigation/footer images
          const parent = img.closest('header, footer, nav');
          if (parent) return;
          // Skip social media icons
          if (src.includes('social') || src.includes('icon')) return;
          
          // Get high-res URL (remove Wix resize params)
          let highRes = src;
          if (highRes.includes('/v1/fill/')) {
            highRes = highRes.split('/v1/fill/')[0];
          }
          
          imgs.push({
            src: highRes,
            originalSrc: src,
            width,
            height,
            alt
          });
        });
        return imgs;
      });

      console.log(`  Found ${images.length} content images`);

      if (images.length === 0) {
        console.log(`  No images found, skipping`);
        await page.close();
        continue;
      }

      // First image = cover, rest = gallery
      const coverImg = images[0];
      const galleryImgs = images.slice(1);

      // Download cover image
      const coverExt = coverImg.src.includes('.png') ? '.png' : coverImg.src.includes('.jpeg') || coverImg.src.includes('.jpg') ? '.jpg' : '.png';
      const coverFilename = `post_${post.id}_cover${coverExt}`;
      const coverPath = path.join(UPLOAD_DIR, coverFilename);
      
      try {
        await downloadImage(coverImg.src, coverPath);
        const stats = fs.statSync(coverPath);
        if (stats.size > 1000) {
          const dbPath = `/uploads/${coverFilename}`;
          await db.execute('UPDATE blog_posts SET image = ? WHERE id = ?', [dbPath, post.id]);
          console.log(`  Cover: ${coverFilename} (${Math.round(stats.size/1024)}KB)`);
        } else {
          console.log(`  Cover too small, trying original src...`);
          await downloadImage(coverImg.originalSrc, coverPath);
          const stats2 = fs.statSync(coverPath);
          if (stats2.size > 1000) {
            const dbPath = `/uploads/${coverFilename}`;
            await db.execute('UPDATE blog_posts SET image = ? WHERE id = ?', [dbPath, post.id]);
            console.log(`  Cover (original): ${coverFilename} (${Math.round(stats2.size/1024)}KB)`);
          }
        }
      } catch (e) {
        console.log(`  Cover download failed: ${e.message}`);
        // Try using Playwright to screenshot the image
        try {
          const imgElement = await page.locator('img').first();
          await imgElement.screenshot({ path: coverPath });
          const stats = fs.statSync(coverPath);
          if (stats.size > 1000) {
            const dbPath = `/uploads/${coverFilename}`;
            await db.execute('UPDATE blog_posts SET image = ? WHERE id = ?', [dbPath, post.id]);
            console.log(`  Cover (screenshot): ${coverFilename} (${Math.round(stats.size/1024)}KB)`);
          }
        } catch (e2) {
          console.log(`  Cover screenshot also failed: ${e2.message}`);
        }
      }

      // Download gallery images
      if (galleryImgs.length > 0) {
        console.log(`  Gallery: ${galleryImgs.length} images`);
        // Delete existing gallery entries for this post
        await db.execute('DELETE FROM blog_post_gallery WHERE post_id = ?', [post.id]);
        
        for (let gi = 0; gi < galleryImgs.length; gi++) {
          const gImg = galleryImgs[gi];
          const gExt = gImg.src.includes('.png') ? '.png' : gImg.src.includes('.jpeg') || gImg.src.includes('.jpg') ? '.jpg' : '.png';
          const gFilename = `post_${post.id}_gallery_${gi}${gExt}`;
          const gPath = path.join(GALLERY_DIR, gFilename);
          
          try {
            await downloadImage(gImg.src, gPath);
            const stats = fs.statSync(gPath);
            if (stats.size > 1000) {
              const dbPath = `/uploads/gallery/${gFilename}`;
              await db.execute(
                'INSERT INTO blog_post_gallery (post_id, image_url, order_index) VALUES (?, ?, ?)',
                [post.id, dbPath, gi]
              );
              console.log(`    Gallery ${gi}: ${gFilename} (${Math.round(stats.size/1024)}KB)`);
            } else {
              // Try original src
              await downloadImage(gImg.originalSrc, gPath);
              const stats2 = fs.statSync(gPath);
              if (stats2.size > 1000) {
                const dbPath = `/uploads/gallery/${gFilename}`;
                await db.execute(
                  'INSERT INTO blog_post_gallery (post_id, image_url, order_index) VALUES (?, ?, ?)',
                  [post.id, dbPath, gi]
                );
                console.log(`    Gallery ${gi} (original): ${gFilename} (${Math.round(stats2.size/1024)}KB)`);
              }
            }
          } catch (e) {
            console.log(`    Gallery ${gi} failed: ${e.message}`);
          }
        }
      }

    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
    }
    
    await page.close();
  }

  await browser.close();
  await db.end();
  
  // Final stats
  const db2 = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Senh@Segura2024!',
    database: 'faculdade_db'
  });
  const [postsWithImage] = await db2.execute('SELECT COUNT(*) as c FROM blog_posts WHERE image IS NOT NULL AND image != ""');
  const [galleryCount] = await db2.execute('SELECT COUNT(*) as c FROM blog_post_gallery');
  console.log(`\n=== FINAL STATS ===`);
  console.log(`Posts with cover image: ${postsWithImage[0].c}`);
  console.log(`Gallery images: ${galleryCount[0].c}`);
  await db2.end();
}

main().catch(console.error);
