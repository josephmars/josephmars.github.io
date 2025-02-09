// Common YAML loading functionality
async function loadYAMLData(file) {
    try {
        const basePath = window.location.pathname.includes('/pages/') ? '../' : '';
        console.log('Loading file:', `${basePath}data/${file}.yml`);
        const response = await fetch(`${basePath}data/${file}.yml`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('YAML text loaded:', text.substring(0, 100) + '...'); // Show first 100 chars
        const data = jsyaml.load(text);
        console.log('Parsed data:', data);
        return data;
    } catch (error) {
        console.error(`Error loading ${file}:`, error);
        return null;
    }
} 