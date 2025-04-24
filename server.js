// server.js
// at the top of server.js

import express from 'express';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/mmtcprice', async (req, res) => {
  let browser;
  try {
     browser = await puppeteer.launch({
      executablePath: puppeteer.executablePath(),
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.goto('https://www.mmtcpamp.com/', { waitUntil: 'networkidle2' });

    // Wait for the carousel slide & price to load
    await page.waitForSelector(
      'body > main > div > div:nth-child(2) > div > div.swiper-wrapper ' +
      '> div.swiper-slide.swiper-slide-active ' +
      '> div > div > div > div.sc-6a8fda72-5.zOxMd strong'
    );

    // Extract the 3rd span inside <strong>
    const price = await page.$eval(
      'body > main > div > div:nth-child(2) > div > div.swiper-wrapper ' +
      '> div.swiper-slide.swiper-slide-active ' +
      '> div > div > div > div.sc-6a8fda72-5.zOxMd strong span:nth-child(3)',
      el => el.textContent.trim()
    );

    res.json({ price });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  } finally {
    if (browser) await browser.close();
  }
});



app.listen(PORT, () => {
  console.log(`MMTC-PAMP scraper listening on port ${PORT}`);
});
