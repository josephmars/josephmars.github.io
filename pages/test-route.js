// Add this file to check if routing is working
document.addEventListener('DOMContentLoaded', () => {
    const testDiv = document.createElement('div');
    testDiv.innerHTML = `
        <h1>Route Test</h1>
        <p>URL: ${window.location.href}</p>
        <p>Path: ${window.location.pathname}</p>
        <p>Search: ${window.location.search}</p>
    `;
    document.body.appendChild(testDiv);
}); 