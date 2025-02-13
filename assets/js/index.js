// Theme functions
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
        const latestBlogLoader = new BlogLoader({ maxPosts: 3 }); // Maximum number of posts to load
        await latestBlogLoader.renderBlogPosts('latestBlogPosts');
        console.log('Blog posts loaded successfully');
    } catch (error) {
        console.error('Error loading blog posts:', error);
    }
});
