const fs = require('fs');
const path = require('path');
const { uploadAsset } = require('../utils/storage');

async function uploadLogos() {
  try {
    // Upload regular logo
    const logoPath = path.join(__dirname, '../../public/logo.svg');
    const logoContent = fs.readFileSync(logoPath);
    const logoBlob = new Buffer([logoContent], { type: 'image/svg+xml' });
    const { url: logoUrl } = await uploadAsset(logoBlob, 'logo.svg');
    
    // Upload social logo
    const socialLogoPath = path.join(__dirname, '../../public/logo-social.svg');
    const socialLogoContent = fs.readFileSync(socialLogoPath);
    const socialLogoBlob = new Buffer([socialLogoContent], { type: 'image/svg+xml' });
    const { url: socialLogoUrl } = await uploadAsset(socialLogoBlob, 'logo-social.svg');
    
    console.log('Logo URLs:', {
      logo: logoUrl,
      socialLogo: socialLogoUrl
    });
    
    // Update index.html with new URLs
    const indexPath = path.join(__dirname, '../../index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    indexContent = indexContent.replace(
      /content="\/logo-social\.svg"/g,
      `content="${socialLogoUrl}"`
    );
    
    indexContent = indexContent.replace(
      /href="\/logo\.svg"/g,
      `href="${logoUrl}"`
    );
    
    fs.writeFileSync(indexPath, indexContent);
    console.log('Updated index.html with new logo URLs');
    
  } catch (error) {
    console.error('Error uploading assets:', error);
  }
}

uploadLogos();
