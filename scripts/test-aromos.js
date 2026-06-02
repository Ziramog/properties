const cheerio = require('cheerio');

async function run() {
  const res = await fetch('https://roggeroyroma.com.ar/property/cordoba-los-aromos-casa-de-3-dormitorios/');
  const html = await res.text();
  const $ = cheerio.load(html);
  
  $('.property-similar, .similar-properties, .widget, .sidebar, footer, .footer, .image-with-label').remove();
  
  const allowedUrls = [];
  $('.header_slider_container img, #property-detail-large-slider img, .property-detail-slider img, .owl-item img, .item-slider img').each((i, el) => {
    let src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src');
    if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('avatar') && !src.includes('facebook') && !src.includes('google')) {
      const cleanSrc = src.split('?')[0];
      if (cleanSrc.match(/\.(jpeg|jpg|png|webp)$/i) && !allowedUrls.includes(cleanSrc)) {
        allowedUrls.push(cleanSrc);
      }
    }
  });
  
  console.log('URLs:', allowedUrls);
}
run();
