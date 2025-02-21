class BlogPostRenderer {
    constructor() {
        console.log('BlogPostRenderer initialized');
        // Configure marked options for syntax highlighting and other features
        marked.setOptions({
            highlight: function(code, lang) {
                if (Prism && lang) {
                    try {
                        return Prism.highlight(code, Prism.languages[lang], lang);
                    } catch (e) {
                        console.warn(`Failed to highlight ${lang}:`, e);
                        return code;
                    }
                }
                return code;
            },
            breaks: true,
            gfm: true
        });
    }

    async loadAndRenderPost() {
        try {
            // Get the slug from the URL (e.g., 'brainstorming-big-ideas')
            const slug = window.location.pathname
                .split('/blog/')[1]
                .replace(/\/$/, '');
            console.log('Post slug:', slug);
            
            // Construct the markdown URL
            const markdownUrl = `/blog/${slug}/content.md`;
            console.log('Attempting to load markdown from:', markdownUrl);
            
            const response = await fetch(markdownUrl);
            if (!response.ok) {
                throw new Error(`Failed to load post (${response.status}). Please ensure the markdown file exists at ${markdownUrl}`);
            }

            const markdown = await response.text();
            console.log('Markdown loaded successfully');

            // Parse front matter and content
            const { frontMatter, content } = this.parseFrontMatter(markdown);
            
            // Render the post
            this.renderPost(frontMatter, content);
        } catch (error) {
            console.error('Error rendering post:', error);
            this.renderError(error.message);
        }
    }

    parseFrontMatter(markdown) {
        // Look for front matter between --- markers
        const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        
        if (!match) {
            throw new Error('Invalid front matter format');
        }
        
        try {
            const frontMatter = jsyaml.load(match[1]);
            const content = match[2];
            return { frontMatter, content };
        } catch (error) {
            console.error('Error parsing YAML:', error);
            throw new Error('Invalid YAML in front matter');
        }
    }

    renderPostMetadata(frontMatter) {
        // Set category
        const categoryEl = document.querySelector('.category');
        if (categoryEl) categoryEl.textContent = frontMatter.category;

        // Set title
        const titleEl = document.querySelector('.title');
        if (titleEl) titleEl.textContent = frontMatter.title;

        // Set description/subtitle
        const subtitleEl = document.querySelector('.subtitle');
        if (subtitleEl) subtitleEl.textContent = frontMatter.description;

        // Set author
        const authorEl = document.querySelector('.author');
        if (authorEl) authorEl.textContent = frontMatter.author;

        // Set date
        const dateEl = document.querySelector('.date');
        if (dateEl && frontMatter.date) {
            dateEl.textContent = new Date(frontMatter.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Set read time
        const readTimeEl = document.querySelector('.read-time');
        if (readTimeEl) readTimeEl.textContent = `${frontMatter.readTime} min read`;

        // Set tags
        const tagsContainer = document.querySelector('.tags');
        if (tagsContainer && frontMatter.tags) {
            tagsContainer.innerHTML = ''; // Clear existing tags
            frontMatter.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.textContent = tag;
                tagsContainer.appendChild(tagSpan);
            });
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updatePageMetadata(frontMatter) {
        // Update meta tags
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = frontMatter.description;
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.content = frontMatter.title;

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.content = frontMatter.description;

        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage && frontMatter.image) {
            ogImage.content = frontMatter.image;
        }
    }

    enhanceContent() {
        // Add copy button to code blocks
        document.querySelectorAll('pre code').forEach(block => {
            const button = document.createElement('button');
            button.className = 'copy-button';
            button.textContent = 'Copy';
            button.addEventListener('click', () => {
                navigator.clipboard.writeText(block.textContent);
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            });
            block.parentNode.insertBefore(button, block);
        });

        // Add anchor links to headings without the # symbol
        document.querySelectorAll('h2, h3, h4, h5, h6').forEach(heading => {
            const id = heading.id || heading.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
            heading.id = id;
            
            const anchor = document.createElement('a');
            anchor.href = `#${id}`;
            anchor.className = 'heading-anchor';
            anchor.style.textDecoration = 'none';
            anchor.style.color = 'inherit';
            heading.appendChild(anchor);
        });
    }

    renderError(message) {
        document.querySelector('.post-content').innerHTML = `
            <div class="alert alert-danger">
                <h4>Error Loading Post</h4>
                <p>${message}</p>
                <p>Please try again later or <a href="/">return home</a>.</p>
            </div>
        `;
    }

    renderPost(frontMatter, content) {
        // Update favicon
        const favicon = document.querySelector('link[rel="icon"]');
        if (!favicon) {
            const newFavicon = document.createElement('link');
            newFavicon.rel = 'icon';
            newFavicon.href = '/assets/images/icons/mars.png';
            document.head.appendChild(newFavicon);
        } else {
            favicon.href = '/assets/images/icons/mars.png';
        }
        
        // Render front matter data
        this.renderPostMetadata(frontMatter);
        
        // Render markdown content
        console.log('Converting markdown to HTML...');
        const htmlContent = marked.parse(content);
        document.querySelector('.post-content').innerHTML = htmlContent;
        
        // Add additional features
        this.enhanceContent();
        
        // Highlight code blocks
        Prism.highlightAll();

        console.log('Render complete');
    }

    countWords(content) {
        return content.trim().split(/\s+/).length;
    }
}

// Initialize renderer when document is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing renderer');
    const renderer = new BlogPostRenderer();
    renderer.loadAndRenderPost();
}); 