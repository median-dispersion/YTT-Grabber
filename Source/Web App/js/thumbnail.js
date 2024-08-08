// https://github.com/median-dispersion/YTT-Grabber

class Thumbnail {

    // Aspect ratio of the thumbnail
    #aspectRatio = 1;

    // ============================================================================================
    // Constructor
    // ============================================================================================
    constructor() {

        // Add an event listener to always resize the thumbnail so it fits the screen
        window.addEventListener("resize", () => { this.#resizeThumbnail(); });

        // Add a click event listener to the copy button
        document.getElementById("thumbnail-box-header-copy").addEventListener("click", () => {

            // Copy the href of the thumbnail header link (current thumbnail URL) to the clipboard
            navigator.clipboard.writeText(document.getElementById("thumbnail-box-header-link").href);

        });

    }

    // ============================================================================================
    // Get the URL for the thumbnail with the highest resolution
    // ============================================================================================
    getThumbnail(url = "") {

        // New YTT Grabber object
        const yttGrabber = new YTTGrabber();

        // Get thumbnail URL
        yttGrabber.getThumbnailURL(url)
        .then((url) => {

            // Display the thumbnail
            this.#displayThumbnail(url); 

        })
        .catch((error) => {

            // Log error
            console.error(error);
            
        });

    }

    // ============================================================================================
    // Display the thumbnail
    // ============================================================================================
    #displayThumbnail(url = "") {
        
        // Get HTML elements
        const thumbnail           = document.getElementById("thumbnail");
        const thumbnailHeaderLink = document.getElementById("thumbnail-box-header-link");
        const thumbnailImage      = document.getElementById("thumbnail-box-image");

        // On image load
        thumbnailImage.onload = () => {

            // Calculate the thumbnail aspect ratio
            this.#aspectRatio = thumbnailImage.width / thumbnailImage.height;

            // Resize the thumbnail to fit the screen
            this.#resizeThumbnail();

            // Set the thumbnail header link
            thumbnailHeaderLink.href = url;
            thumbnailHeaderLink.innerHTML = url;

            // Make the thumbnail visible
            thumbnail.style.display = "block";

            // Scroll the thumbnail into view
            thumbnail.scrollIntoView({behavior: "smooth"});

        };

        // Set the image source
        thumbnailImage.src = url;

    }

    // ============================================================================================
    // Resize the thumbnail so it always fits the screen
    // ============================================================================================
    #resizeThumbnail() {

        // Get the thumbnail element
        const thumbnail = document.getElementById("thumbnail");

        // Get the computed style of the thumbnail element
        const coputeStyle = window.getComputedStyle(thumbnail);

        // Extract the values
        const thumbnailPaddingLeft   = parseFloat(coputeStyle.getPropertyValue("padding-left"));
        const thumbnailPaddingRight  = parseFloat(coputeStyle.getPropertyValue("padding-right"));
        const thumbnailPaddingTop    = parseFloat(coputeStyle.getPropertyValue("padding-top"));
        const thumbnailPaddingBottom = parseFloat(coputeStyle.getPropertyValue("padding-bottom"));
        const thumbnailHeaderHeight  = parseFloat(window.getComputedStyle(document.getElementById("thumbnail-box-header")).getPropertyValue("height"));
        
        // Calculate the max width and height of the thumbnail on screen
        const maxHeight = window.innerHeight - (thumbnailPaddingTop + thumbnailPaddingBottom + thumbnailHeaderHeight);
        const maxWidth = (maxHeight * this.#aspectRatio) + (thumbnailPaddingLeft + thumbnailPaddingRight);

        // Check the thumbnail fit on screen
        if (((window.innerWidth - (thumbnailPaddingLeft + thumbnailPaddingRight)) / maxHeight) < this.#aspectRatio) {

            // If the thumbnail fits in height, set the width to 100%
            thumbnail.style.width = "100%";

        }else {

            // If the thumbnail doesn't fit in height, set its width to restrict the size on screen
            thumbnail.style.width = `${maxWidth}px`;

        }

    }

}