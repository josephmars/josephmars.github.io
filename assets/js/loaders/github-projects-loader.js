async function fetchGitHubProjects() {
    const username = 'josephmars';
    const excludedRepos = ['josephmars', 'change_point_detection', 'TidyTuesday_codes', 'josephmars.github.io']; // Add repositories to exclude here
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&direction=desc`);
    const repos = await response.json();
    
    // Filter out forks, empty repositories, and excluded repositories
    const filteredRepos = repos.filter(repo => 
        !repo.fork && 
        repo.description && 
        !excludedRepos.includes(repo.name)
    );
    
    // Merge with existing projects from projects.yml
    const response_yml = await fetch('/data/projects.yml');
    const yml_text = await response_yml.text();
    const existing_projects = jsyaml.load(yml_text).projects;
    
    const getProjectImage = (repo, existingProjects) => {
        // 1. Try to get image from projects.yml if it exists
        const existingProject = existingProjects.find(p => p.github === repo.html_url);
        if (existingProject?.image && existingProject.image !== '') {
            return existingProject.image;
        }

        // 2. Try GitHub's social preview image with fallback to Socialify
        // const socialPreviewUrl = `https://opengraph.githubassets.com/1/${username}/${repo.name}`;
        const socialPreviewUrl = `https://socialify.git.ci/${username}/${repo.name}/image?font=Inter&forks=1&issues=1&language=0&name=0&owner=0&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Light`;
        return socialPreviewUrl;  // Use OpenGraph by default, it's more reliable
    };

    // Convert GitHub repos to your project format
    const projects = filteredRepos.map(repo => {
        const existingProject = existing_projects.find(p => p.github === repo.html_url);
        
        // Format the repository name to be more readable
        const upperCaseWords = ['AI', 'ML', 'CNN', 'RNN', 'NLP', 'API', 'GPU', 'CPU', 'UI', 'UX', 'NN', 'MNIST', 'CIFAR', 'COVID19'];
        const formattedRepoName = repo.name
            .split(/[-_]/)
            .map(word => {
                const upperMatch = upperCaseWords.find(upper => upper.toLowerCase() === word.toLowerCase());
                return upperMatch || (word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
            })
            .join(' ');
        
        // Get up to 2 topics and combine with the primary language
        const topics = (repo.topics?.slice(0, 2) || []).map(topic => {
            const words = topic.split('-');
            const formattedWords = words.map(word => {
                const upperMatch = upperCaseWords.find(upper => upper.toLowerCase() === word);
                return upperMatch || (word.charAt(0).toUpperCase() + word.slice(1));
            });
            return formattedWords.join(' ');
        });
        const technologies = [...topics].filter(Boolean);
        
        // Create base project from API data
        const baseProject = {
            name: formattedRepoName,
            description: '',  // Start with empty description
            image: getProjectImage(repo, existing_projects),
            technologies: technologies,
            github: repo.html_url,
            documentation: null,
            paper: null,
            report: null,
            blog: null,
            post: null,
            main_page: false
        };

        // If there's an existing project in yml, merge its non-null values
        if (existingProject) {
            Object.keys(existingProject).forEach(key => {
                if (existingProject[key] !== null && existingProject[key] !== undefined) {
                    baseProject[key] = existingProject[key];
                }
            });
        } else if (repo.description) {
            // Only use GitHub description if there's no yml entry at all
            baseProject.description = repo.description;
        }

        return baseProject;
    });

    // Combine projects, ensuring yml projects are included even if not in GitHub API results
    const githubUrls = projects.map(p => p.github);
    const ymlOnlyProjects = existing_projects.filter(p => !githubUrls.includes(p.github));
    
    return [...projects, ...ymlOnlyProjects];
}
// Add this new function to create the schema
function createProjectsSchema(projects) {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "Joseph Martinez - AI & ML Projects",
        "description": "A collection of AI, deep learning, and optimization projects developed by Joseph Martinez.",
        "numberOfItems": projects.length,
        "itemListElement": projects.map((project, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "item": {
                "@type": "SoftwareSourceCode",
                "name": project.name,
                "description": project.description,
                "programmingLanguage": project.technologies.join(", "),
                "author": {
                    "@type": "Person",
                    "name": "Joseph Martinez",
                    "url": "https://josephmars.me/#Person"
                },
                "codeRepository": project.github,
                "url": project.documentation || project.github,
                "thumbnailUrl": project.image || "https://josephmars.me/assets/images/fallback/project.png"
            }
        }))
    };
}

// Modify the renderAllProjects function to include schema generation
async function renderAllProjects() {
    try {
        console.log('Starting renderAllProjects...');
        const allProjects = await fetchGitHubProjects();
        const projectsGrid = document.getElementById('projectsGrid') || document.getElementById('mainProjectsGrid');
        
        if (!projectsGrid) {
            console.error('Projects container not found');
            return;
        }

        console.log('Grid found:', projectsGrid.id);
        
        // Determine if we're on the main page or projects page
        const isMainPage = projectsGrid.id === 'mainProjectsGrid';
        console.log('Is main page:', isMainPage);
        
        // Filter projects based on page type
        let projectsToShow = isMainPage ? 
            allProjects.filter(p => p.main_page) : 
            allProjects;
        
        console.log('Projects to show:', projectsToShow.length);

        // Generate schema first
        const projectsSchema = createProjectsSchema(projectsToShow);
        console.log('Generated schema:', projectsSchema);

        // Wait for DOM to be fully loaded
        await new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });

        // Create schema script tag
        const schemaScript = document.createElement('script');
        schemaScript.type = 'application/ld+json';
        schemaScript.textContent = JSON.stringify(projectsSchema, null, 2);
        schemaScript.id = 'projects-schema';

        // Remove any existing projects schema
        const existingProjectsSchema = document.getElementById('projects-schema');
        if (existingProjectsSchema) {
            console.log('Removing existing projects schema');
            existingProjectsSchema.remove();
        }

        // Find all existing schema scripts
        const head = document.getElementsByTagName('head')[0];
        const existingSchemas = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));
        
        // Find the Person schema
        const personSchema = existingSchemas.find(script => {
            try {
                const content = JSON.parse(script.textContent);
                return content["@type"] === "Person";
            } catch (e) {
                return false;
            }
        });

        // Insert the new schema
        if (personSchema) {
            console.log('Found person schema, inserting after it');
            personSchema.insertAdjacentElement('afterend', schemaScript);
        } else {
            console.log('No person schema found, appending to head');
            head.appendChild(schemaScript);
        }

        // Verify schema was added
        const addedSchema = document.getElementById('projects-schema');
        console.log('Schema added successfully:', !!addedSchema);

        // Clear and render projects
        projectsGrid.innerHTML = '';
        projectsToShow.forEach(project => {
            const projectCard = createProjectCard(project);
            projectsGrid.appendChild(projectCard);
        });

        // Add "See All Projects" link if on main page
        if (isMainPage) {
            const seeAllDiv = document.createElement('div');
            seeAllDiv.className = 'col-12 text-center mt-5';
            seeAllDiv.innerHTML = `
                <a href="projects/" class="btn btn-outline-secondary btn-md px-5 py-3 shadow-sm" style="border-width: 1px; transition: all 0.3s ease;">
                    See All Projects
                </a>
                <hr class="my-4">
            `;
            projectsGrid.parentElement.appendChild(seeAllDiv);
        }

        console.log('Finished rendering projects and adding schema');
    } catch (error) {
        console.error('Error in renderAllProjects:', error);
    }
}

// Helper function to create project cards
function createProjectCard(project) {
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
            <a href="${project.blog}" class="btn btn-sm btn-outline-danger">
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

    const div = document.createElement('div');
    div.className = 'col';
    div.innerHTML = `
        <div class="card h-100 shadow-sm">
            <div class="card-img-wrapper" style="position: relative; padding-top: 50%;">
                <img src="${project.image}" class="card-img-top" alt="${project.name || 'Project'}" title="${project.name || 'Project'}"
                     style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="card-body d-flex flex-column">
                ${project.name ? `<h3 class="card-title mb-3 h5">${project.name}</h3>` : ''}
                ${project.description ? `<p class="card-text flex-grow-1">${project.description}</p>` : ''}
                <div class="d-flex flex-column flex-sm-row gap-2 gap-sm-0 justify-content-between align-items-start align-items-sm-center mt-3">
                    <div class="btn-group">
                        ${documentationButtons.join('')}
                    </div>
                    <small class="text-muted mt-2 mt-sm-0">${project.technologies.join(' · ')}</small>
                </div>
            </div>
        </div>
    `;
    return div;
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderAllProjects);
} else {
    renderAllProjects();
} 