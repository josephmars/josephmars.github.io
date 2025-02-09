async function renderEducation() {
    console.log('renderEducation called');
    const data = await loadYAMLData('education');
    if (!data || !data.education) {
        console.error('No education data loaded');
        return;
    }
    
    const container = document.getElementById('educationAccordion');
    if (!container) {
        console.error('Education container not found');
        return;
    }
    
    data.education.forEach((edu, index) => {
        const educationHTML = `
            <div class="accordion-item">
                <h2 class="accordion-header" id="education${index}Header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#education${index}" aria-expanded="false" aria-controls="education${index}">
                        <img src="${edu.logo}" alt="${edu.institution} logo" width="30" class="me-2">
                        ${edu.institution} - ${edu.degree}
                    </button>
                </h2>
                <div id="education${index}" class="accordion-collapse collapse" aria-labelledby="education${index}Header" data-bs-parent="#educationAccordion">
                    <div class="accordion-body">
                        <strong>${edu.period}</strong><br>
                        ${edu.details.length > 0 ? `${edu.details}, GPA: ${edu.gpa}` : `GPA: ${edu.gpa}`}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += educationHTML;
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing education loader');
    const educationGrid = document.getElementById('educationAccordion');
    if (educationGrid) {
        console.log('Found education grid, rendering education');
        renderEducation();
    }
}); 