async function loadYAMLData(file) {
    try {
        const response = await fetch(`/data/${file}.yml`);
        const text = await response.text();
        return jsyaml.load(text); // You'll need to include js-yaml library
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
        return null;
    }
}

async function renderExperience() {
    const data = await loadYAMLData('experience');
    const container = document.getElementById('workExperienceGrid');
    
    data.experiences.forEach((exp, index) => {
        const experienceHTML = `
            <div class="accordion-item">
                <h2 class="accordion-header" id="workExp${index}Header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                            data-bs-target="#workExp${index}" aria-expanded="false" aria-controls="workExp${index}">
                        <img src="${exp.logo}" alt="${exp.company} logo" width="30" class="me-2">
                        ${exp.company} - ${exp.title}
                    </button>
                </h2>
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

async function renderEducation() {
    const data = await loadYAMLData('education');
    const container = document.getElementById('educationAccordion');
    
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