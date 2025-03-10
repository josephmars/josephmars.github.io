const fs = require('fs');
const path = require('path');

// Read the blog post template
const template = fs.readFileSync(path.join(__dirname, '../pages/blog-post-template.html'), 'utf8');

// Read the posts.json file
const postsJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../blog/posts.json'), 'utf8'));

// Process each post in posts.json
postsJson.forEach(slug => {
    const postDir = path.join(__dirname, '../blog', slug);
    // Create both paths - with and without .md extension
    const contentPathMd = path.join(postDir, 'content.md');
    const contentPath = path.join(postDir, 'content');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(postDir)) {
        fs.mkdirSync(postDir, { recursive: true });
    }
    
    // Copy template as index.html
    fs.writeFileSync(path.join(postDir, 'index.html'), template);
    
    // If neither content file exists in the target directory, copy from source
    if (!fs.existsSync(contentPathMd) && !fs.existsSync(contentPath)) {
        const sourceContent = path.join(__dirname, '../blog', `${slug}.md`);
        if (fs.existsSync(sourceContent)) {
            // Copy to both locations to ensure compatibility
            fs.copyFileSync(sourceContent, contentPathMd);
            fs.copyFileSync(sourceContent, contentPath);
        } else {
            console.error(`Warning: Content file not found for ${slug}`);
        }
    }
});

// Generate posts.json if it doesn't exist
const generatePostsJson = () => {
    const blogDir = path.join(__dirname, '../blog');
    const posts = fs.readdirSync(blogDir)
        .filter(file => file.endsWith('.md'))
        .map(file => file.replace('.md', ''));
    
    fs.writeFileSync(
        path.join(blogDir, 'posts.json'),
        JSON.stringify(posts, null, 4)
    );
}; 