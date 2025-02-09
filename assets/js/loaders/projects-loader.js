async function renderProjects() {
    console.log('renderProjects called');
    const data = await loadYAMLData('projects');
    if (!data || !data.projects) {
        console.error('No projects data loaded');
        return;
    }
    
    const container = document.getElementById('projectsGrid');
    if (!container) {
        console.error('Projects container not found');
        return;
    }
    
    data.projects.forEach(project => {
        const documentationButtons = [];
        
        if (project.github) {
            documentationButtons.push(`
                <a href="${project.github}" class="btn btn-sm btn-outline-secondary">
                    <i class="fa-brands fa-github me-2"></i>Code
                </a>
            `);
        }
        
        if (project.documentation) {
            documentationButtons.push(`
                <a href="${project.documentation}" class="btn btn-sm btn-outline-primary">
                    <i class="fa-solid fa-book me-2"></i>Documentation
                </a>
            `);
        }
        
        if (project.paper) {
            documentationButtons.push(`
                <a href="${project.paper}" class="btn btn-sm btn-outline-info">
                    <i class="fa-solid fa-file-lines me-2"></i>Paper
                </a>
            `);
        }
        
        if (project.report) {
            documentationButtons.push(`
                <a href="${project.report}" class="btn btn-sm btn-outline-success">
                    <i class="fa-solid fa-file-alt me-2"></i>Report
                </a>
            `);
        }
        
        if (project.blog) {
            documentationButtons.push(`
                <a href="${project.blog}" class="btn btn-sm btn-outline-warning">
                    <i class="fa-solid fa-rss me-2"></i>Blog
                </a>
            `);
        }
        
        if (project.post) {
            documentationButtons.push(`
                <a href="${project.post}" class="btn btn-sm btn-outline-dark">
                    <i class="fa-solid fa-newspaper me-2"></i>Post
                </a>
            `);
        }

        const projectHTML = `
            <div class="col">
                <div class="card h-100">
                    <img src="${project.image}" class="card-img-top" alt="${project.name}" 
                         style="object-fit: contain; padding: 20px; background: #f8f9fa; max-height: 200px;">
                    <div class="card-body">
                        <h5 class="card-title">${project.name}</h5>
                        <p class="card-text">${project.description}</p>
                        <div class="d-flex flex-column flex-sm-row gap-2 gap-sm-0 justify-content-between align-items-start align-items-sm-center">
                            <div class="btn-group">
                                ${documentationButtons.join('')}
                            </div>
                            <small class="text-body-secondary mt-2 mt-sm-0">${project.technologies.join(' · ')}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += projectHTML;
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing projects loader');
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
        console.log('Found projects grid, rendering projects');
        renderProjects();
    }
}); 