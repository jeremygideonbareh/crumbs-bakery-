import fs from 'fs';
import path from 'path';

const files = [
  'AnnouncementBar.jsx', 'BrowseByBake.jsx', 'CategoryGrid.jsx',
  'DeliverySection.jsx', 'FaqSection.jsx', 'InstagramSection.jsx',
  'NewsSection.jsx', 'ProductCarousel.jsx', 'PromoCards.jsx',
  'SheetCakesMarquee.jsx', 'ui/interactive-image-accordion.jsx'
];

for (const f of files) {
  const fp = path.join('src/components', f);
  let content = fs.readFileSync(fp, 'utf8');
  const original = content;

  // Fix missing newlines between statements
  content = content.replace(/'import /g, "'\nimport ");
  content = content.replace(/'import {/g, "'\nimport {");
  content = content.replace(/"import /g, '"\nimport ');
  content = content.replace(/'export /g, "'\nexport ");
  content = content.replace(/'const /g, "'\nconst ");
  content = content.replace(/}(\s*)export/g, '}\n$1export');
  content = content.replace(/'function /g, "'\nfunction ");
  content = content.replace(/;(\s*)([a-zA-Z])/g, ';\n$1$2');

  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf8');
    console.log('Fixed:', f);
  } else {
    console.log('No change:', f);
  }
}
