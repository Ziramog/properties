const cheerio = require('cheerio');

async function run() {
  const url = 'https://roggeroyroma.com.ar/property/la-bolsa-av-los-aromos-se-vende-hermoso-lote-de-1000-con-bajada-privada-al-rio-anisacate/';
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log('Before remove:', $('.header_slider_container img').length);
  $('.property-similar, .similar-properties, .widget, .sidebar, footer, .footer, .image-with-label').remove();
  console.log('After remove:', $('.header_slider_container img').length);
}
run();
