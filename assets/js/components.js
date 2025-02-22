function createHeader() {
    return `
    <header class="site-header sticky-top">
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand d-flex align-items-center" href="/">
                    <img src="/assets/images/icons/mars.png" alt="Mars" width="30" class="me-2">
                    <span style="font-weight: bold; font-size: 0.9em;">Joseph Martinez</span>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto align-items-center gap-1 gap-lg-2">
                        <li class="nav-item">
                            <a class="nav-link ${window.location.pathname === '/' || window.location.pathname === '/' ? 'active border-bottom border-dark border-2' : ''}" 
                               href="/">About</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${window.location.pathname.includes('/projects') ? 'active border-bottom border-dark border-2' : ''}" 
                               href="/projects">Projects</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${window.location.pathname.includes('/blog') ? 'active border-bottom border-dark border-2' : ''}" 
                               href="/blog">Blog</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${window.location.pathname.includes('/resume') ? 'active border-bottom border-dark border-2' : ''}" 
                               href="/resume">Resume</a>
                        </li>
                        <li class="nav-item">
                            <button onclick="changeTheme()" class="btn me-2">
                                <i id="darkIcon" class="fa fa-moon"></i>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>`;
}

function createFooter() {
    return `
    <footer class="d-flex flex-wrap justify-content-center py-3 my-4 border-top">
        <div class="d-flex justify-content-center gap-3 mt-3">
            <a href="mailto:josephms957@gmail.com" class="text-decoration-none text-dark" target="_blank">
                <i class="fa-solid fa-envelope" style="font-size: 1.5em; color: #000000;"></i>
            </a>
            <a href="https://github.com/josephmars" class="text-decoration-none text-dark" target="_blank">
                <i class="fa-brands fa-github" style="font-size: 1.5em; color: #000000;"></i>
            </a>
            <a href="https://www.linkedin.com/in/josephmars/" class="text-decoration-none text-dark" target="_blank">
                <i class="fa-brands fa-linkedin" style="font-size: 1.5em; color: #000000;"></i>
            </a>
        </div>
    </footer>`;
}

// Function to initialize components
function initComponents() {
    // Insert header
    document.body.insertAdjacentHTML('afterbegin', createHeader());
    
    // Insert footer
    const main = document.querySelector('main');
    if (main) {
        main.insertAdjacentHTML('afterend', createFooter());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initComponents); 


// Change theme functions
const darkTheme = () => {
    document.querySelector("body").setAttribute("data-bs-theme", "dark");
    document.querySelector("#darkIcon").setAttribute("class", "fa-regular fa-sun");
}

const lightTheme = () => {
    document.querySelector("body").setAttribute("data-bs-theme", "light");
    document.querySelector("#darkIcon").setAttribute("class", "fa fa-moon");
}

// Change theme on click (dark/light)
const changeTheme = () => {
    if (document.querySelector("body").getAttribute("data-bs-theme") === "light") {
        darkTheme();
    } else {
        lightTheme();
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    // Initialize blog posts
    try {
        console.log('Loading blog posts...');
        const latestBlogLoader = new BlogLoader({ maxPosts: 3}); // Maximum number of posts to load
        await latestBlogLoader.renderBlogPosts('latestBlogPosts');
        console.log('Blog posts loaded successfully');
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
});
