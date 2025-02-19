class BlogLoader {
    constructor(options = {}) {
        // If maxPosts is not provided, show all posts
        this.maxPosts = (options.maxPosts === undefined) ? Infinity : options.maxPosts;
        // Add local development option
        this.isLocal = options.local || false;
        // Since we're using a custom domain, we can always use root path
        this.basePath = '/';
        console.log('BlogLoader initialized with basePath:', this.basePath, 'isLocal:', this.isLocal);
    }

    async loadBlogPosts() {
        try {
            const postsJsonUrl = '/blog/posts.json';
            console.log('Attempting to fetch posts.json from:', postsJsonUrl);
            const response = await fetch(postsJsonUrl);
            if (!response.ok) {
                throw new Error(`Failed to load posts.json: ${response.status}`);
            }
            const posts = await response.json();
            console.log('Found posts in posts.json:', posts);
            
            // Load and parse each post's content.md
            console.log('Loading individual posts...');
            const postPromises = posts.map(async (postDir) => {
                // Try both content.md and content paths
                let mdUrl = `/blog/${postDir}/content.md`;
                console.log(`Attempting to load markdown from: ${mdUrl}`);
                
                try {
                    let response = await fetch(mdUrl);
                    
                    // If content.md fails, try without extension
                    if (!response.ok) {
                        mdUrl = `/blog/${postDir}/content`;
                        console.log(`Retrying with: ${mdUrl}`);
                        response = await fetch(mdUrl);
                    }
                    
                    if (!response.ok) {
                        console.error(`Failed to load ${postDir}: HTTP ${response.status}`, response);
                        return null;
                    }
                    
                    const markdown = await response.text();
                    console.log(`Successfully loaded markdown for ${postDir}`);
                    
                    try {
                        const { frontMatter } = this.parseFrontMatter(markdown);
                        console.log(`Parsed front matter for ${postDir}:`, frontMatter);
                        // Ensure image paths are absolute
                        if (frontMatter.image && !frontMatter.image.startsWith('http')) {
                            frontMatter.image = `${this.basePath}${frontMatter.image.replace(/^\//, '')}`;
                        }
                        return {
                            ...frontMatter,
                            slug: postDir
                        };
                    } catch (parseError) {
                        console.error(`Error parsing front matter for ${postDir}:`, parseError);
                        return null;
                    }
                } catch (fetchError) {
                    console.error(`Error fetching ${postDir}:`, fetchError);
                    return null;
                }
            });

            let blogPosts = (await Promise.all(postPromises)).filter(post => {
                if (post === null) {
                    console.warn('Filtered out a null post');
                    return false;
                }
                return true;
            });
            
            console.log('Successfully loaded posts:', blogPosts);

            // Sort by date, newest first
            blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (this.maxPosts !== Infinity) {
                blogPosts = blogPosts.slice(0, this.maxPosts);
                console.log(`Limited to ${this.maxPosts} posts:`, blogPosts);
            }

            return blogPosts;
        } catch (error) {
            console.error('Error in loadBlogPosts:', error);
            throw error;
        }
    }

    parseFrontMatter(markdown) {
        const match = markdown.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
        if (!match) {
            throw new Error('Invalid front matter format');
        }
        try {
            const frontMatter = jsyaml.load(match[1]);
            console.log('Parsed front matter:', frontMatter);
            return { frontMatter, content: match[2] };
        } catch (error) {
            console.error('Error parsing front matter:', error);
            throw error;
        }
    }

    createBlogPostCard(post) {
        try {
            return `
                <article class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100">
                        <a href="${this.basePath}blog/${post.slug}/" class="text-decoration-none">
                            <div class="card-img-wrapper" style="position: relative; padding-top: 50%;">
                                <img 
                                    src="${post.image ? (post.image.startsWith('http') ? post.image : this.basePath + post.image.replace(/^\//, '')) : this.basePath + 'assets/images/fallback/blog.jpg'}" 
                                    class="card-img-top" 
                                    alt="${post.title}"
                                    title="${post.title}"
                                    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
                                    onerror="this.onerror=null; this.src='${this.basePath}assets/images/grey.png';"
                                >
                            </div>
                            <div class="card-body pb-0">
                                <div class="text-muted small mb-1">${post.category || ''}</div>
                                <h3 class="card-title text-body h5">${post.title || 'Untitled'}</h3>
                            </div>
                        </a>
                        <div class="card-body pt-0">
                            <p class="card-text text-secondary">${post.description ? post.description.substring(0, 100) + '...' : ''}</p>
                        </div>
                        <div class="card-footer bg-transparent">
                            <time datetime="${post.date}" class="text-muted small">
                                ${post.date ? new Date(post.date + 'T00:00:00-05:00').toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    timeZone: 'America/New_York'
                                }) : ''}
                            </time>
                            ${post.readTime ? `<small class="text-muted">• ${post.readTime} min read</small>` : ''}
                        </div>
                    </div>
                </article>
            `;
        } catch (error) {
            console.error('Error creating blog post card:', error, post);
            return '';
        }
    }

    async renderBlogPosts(containerId) {
        console.log('Rendering blog posts to container:', containerId);
        const container = document.getElementById(containerId);
        if (!container) {
            console.error('Container not found:', containerId);
            return;
        }

        try {
            const posts = await this.loadBlogPosts();
            if (posts.length === 0) {
                container.innerHTML = '<div class="col-12"><p>No blog posts found.</p></div>';
                return;
            }

            const html = posts.map(post => this.createBlogPostCard(post)).join('');
            container.innerHTML = html;
            console.log('Successfully rendered blog posts');
        } catch (error) {
            console.error('Error rendering blog posts:', error);
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        Error loading blog posts. Please try again later.
                        <br>
                        <small class="text-muted">${error.message}</small>
                    </div>
                </div>
            `;
        }
    }
}