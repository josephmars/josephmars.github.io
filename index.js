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
