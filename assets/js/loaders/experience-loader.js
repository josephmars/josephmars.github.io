async function renderExperience() {
    console.log('renderExperience called');
    const data = await loadYAMLData('experience');
    if (!data || !data.experiences) {
        console.error('No experience data loaded');
        return;
    }
    
    const container = document.getElementById('workExperienceGrid');
    if (!container) {
        console.error('Experience container not found');
        return;
    }
    
    data.experiences.forEach((exp, index) => {
        const experienceHTML = `
            <div class="accordion-item">
                <div class="accordion-header" id="workExp${index}Header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#workExp${index}" aria-expanded="false" aria-controls="workExp${index}">
                        <img src="${exp.logo}" alt="${exp.company} logo" width="30" class="me-2" title="${exp.company} logo">
                        <h3 class="fs-6 fw-normal mb-0">${exp.company} - ${exp.title}</h3>
                    </button>
                </div>
                <div id="workExp${index}" class="accordion-collapse collapse" aria-labelledby="workExp${index}Header" data-bs-parent="#workExperienceGrid">
                    <div class="accordion-body">
                        <strong>${exp.period} · ${exp.duration}</strong>
                        <ul class="mt-2">
                            ${exp.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += experienceHTML;
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing experience loader');
    const experienceGrid = document.getElementById('workExperienceGrid');
    if (experienceGrid) {
        console.log('Found experience grid, rendering experience');
        renderExperience();
    }
}); 