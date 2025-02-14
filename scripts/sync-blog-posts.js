const fs = require('fs');
const path = require('path');

// Read the template file
const template = fs.readFileSync('pages/blog-post.html', 'utf8');

// Get all blog post directories
const blogDir = path.join(__dirname, '../blog');
const postDirs = fs.readdirSync(blogDir)
    .filter(file => fs.statSync(path.join(blogDir, file)).isDirectory());

// Update each blog post's index.html with the template
postDirs.forEach(postDir => {
    const indexPath = path.join(blogDir, postDir, 'index.html');
    fs.writeFileSync(indexPath, template);
    console.log(`Updated ${indexPath}`);
}); 