const fs = require('fs');
const path = require('path');

// Read the blog post template
const template = fs.readFileSync(path.join(__dirname, '../pages/blog-post-template.html'), 'utf8');

// Read the blog directory
const blogDir = path.join(__dirname, '../blog');
const files = fs.readdirSync(blogDir);

// Create directories for each markdown file
files.forEach(file => {
    if (file.endsWith('.md')) {
        const slug = file.replace('.md', '');
        const postDir = path.join(blogDir, slug);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(postDir)) {
            fs.mkdirSync(postDir);
        }
        
        // Copy template as index.html
        fs.writeFileSync(path.join(postDir, 'index.html'), template);
    }
}); 