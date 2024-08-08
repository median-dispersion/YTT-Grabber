// https://github.com/median-dispersion/YTT-Grabber

// ============================================================================================
// Initialization once the DOM has finished loading
// ============================================================================================
document.addEventListener("DOMContentLoaded", () => {

    // Center the main input area on screen
    centerMainInput();
    window.addEventListener("resize", centerMainInput);

    // Create a new thumbnail object
    const thumbnail = new Thumbnail();

    // Add an event listener for submits on the main input area
    document.getElementById("main-input").addEventListener("submit", (event) => {

        // Prevent the default event action
        event.preventDefault();
        
        // Get the thumbnail URL using the input value
        thumbnail.getThumbnail(event.target.elements.input.value);

        // Clear the main input
        event.target.elements.input.value = "";

    });

    // Create a new drag and drop window object
    const dragAndDrop = new SuperSimpleFullScreenDragAndDropJS();

    // Set drag and drop text
    dragAndDrop.text = "Drag and Drop<br>a Video";

    // Drag and drop window styling
    dragAndDrop.style.border.radius = "30px"

    // Add an event listener when something is dropped onto the drag and drop window
    dragAndDrop.addEventListener("dropped", (event) => {

        // Get the thumbnail URL using the drag and drop value
        thumbnail.getThumbnail(event.detail.value);

    });

    // Enable the drag and drop window
    dragAndDrop.enable();

});

// ============================================================================================
// Center the main input area on screen
// ============================================================================================
function centerMainInput() {

    // Calculate the center of the main input and push it to 40% of the screen height
    let topOffset = ((window.innerHeight * 0.4) - (document.getElementById("main").offsetHeight * 0.5))

    // Prevent negative offsets
    if (topOffset <= 0) { topOffset = 0; }

    // Set the offset
    document.getElementById("main").style.marginTop = `${topOffset}px`;
    
}