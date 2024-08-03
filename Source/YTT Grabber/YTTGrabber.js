// https://github.com/median-dispersion/YTT-Grabber

class YTTGrabber {

    // ============================================================================================
    // Checks the availability of a thumbnail based on its size
    // ============================================================================================
    #checkThumbnailAvailability(url = "") {

        // This function checks the availability of a thumbnail based on its size
        // It's implemented in this way to get around the CORS-Policies
        // Even disregarding CORS, YT always sends back an image despite a 404 event
        // If the checked thumbnail is larger than the 404 thumbnail, it is safe to assume it is available

        // 404 thumbnail dimensions in px
        const minWidth  = 120;
        const minHeight = 90;

        return new Promise((resolve, reject) => {

            // Create new image object
            let thumbnail = new Image();
            
            // On thumbnail load, check its dimensions
            // If the thumbnail area is larger than the 404 thumbnail, return true
            // If the thumbnail area is smaller or equal to the 404 thumbnail, assume it's not available and return false
            thumbnail.onload = function() {

                if ((thumbnail.width * thumbnail.height) > (minWidth * minHeight)) {

                    resolve(true);

                }else{

                    resolve(false);

                }

            };

            // If something goes wrong while loading the thumbnail
            thumbnail.onerror = function() {

                reject(new Error("Something went wrong while loading the thumbnail!"));

            };
            
            // Set the thumbnail source
            thumbnail.src = url;

        });

    }

    // ============================================================================================
    // Returns the video ID for a given URL
    // ============================================================================================
    #getVideoID(url = "") {
        
        // List of valid video hosts
        const vidoeHost = [

            "https://www.youtube.com",
            "https://youtube.com",
            "https://m.youtube.com",
            "https://youtu.be",
            "https://www.youtube-nocookie.com",

        ];

        // List of valid video paths
        const videoPath = [

            "/watch?v=",
            "/shorts/",
            "/embed/",
            "/v/",
            "youtu.be/"

        ];

        // Check if the URL starts with a valid hostname
        if (vidoeHost.some(host => url.startsWith(host))) {

                // Remove the path and everything else in front of the video ID
                videoPath.forEach(path => url = (url.split(path).length > 1) ? url.split(path)[1] : url);

                // Remove queries and parameters like playlists etc. after the video ID
                const videoID = url.split("?")[0].split("&")[0];

                // Check if a video ID was successfully extracted
                if (!videoID) {

                    throw new Error("URL doesn't contain a video ID!");

                }else {

                    return videoID;

                }

        } else {

            throw new Error("URL doesn't contain a valid host!");

        }

    }

    // ============================================================================================
    // Returns the URL of the thumbnail with the highest available resolution
    // ============================================================================================
    getThumbnailURL(url = "", format = "jpg") {

        // List of available thumbnail resolutions (highest to lowest)
        const thumbnailResolution = [

            "maxresdefault",
            "hq720",
            "sddefault",
            "hqdefault",
            "mqdefault",
            "default",

        ];

        // Thumbnail host
        const thumbnailHost = "https://i.ytimg.com/vi";

        return new Promise(async (resolve, reject) => {

            try {
                
                // Get the video ID
                const videoID = this.#getVideoID(url);

                let thumbnailURL;

                // Loop through all resolutions (highest to lowest)
                for (let i = 0; i < thumbnailResolution.length; i++) {
                    
                    // Construct the thumbnail URL for a specific resolution and format
                    thumbnailURL = `${thumbnailHost}/${videoID}/${thumbnailResolution[i]}.${format}`;

                    // If the thumbnail resolution is available break loop, else continue until lowest resolution is reached
                    if (await this.#checkThumbnailAvailability(thumbnailURL)) { break; }

                }

                // Return the thumbnail URL
                resolve(thumbnailURL);

            } catch (error) {
                
                // Return error if something goes wrong
                reject(error);

            }

        });

    }

}