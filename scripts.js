/**
 * An object which will help with dictating acceptable URL types
 * which will be used by the url
 */
const UrlTypes = {
    EXHIBIT: 'exhibit',
    IMAGE: 'image',
    ARTIST: 'artist',
    ARTWORK: 'artwork',
    FEATURED_EXHIBITS: 'featured_exhibits'
}

/**
 * The artwork object and all of its details related to image, artist, and creation 
 * 
 * @param {*} api_link REST API link for this artwork
 * @param {*} id Unique identifier of this artwork. Taken from the source system.
 * @param {*} title The name of this artwork
 * @param {*} imageId Unique identifier of the preferred image to use to represent this artwork
 * @param {*} iiifUrl IIIF URL of the image of this artwork
 * @param {*} imageUrl The complete url used to retieve the image used to represent this artwork
 * @param {*} artistId Unique identifier of the preferred artist/culture associated with this artwork
 * @param {*} artistDisplay Readable description of the creator of this artwork. Includes artist names, nationality and lifespan dates
 * @param {*} dateDisplay Readable, free-text description of the period of time associated with the creation of this artwork. 
 * @param {*} shortDescription Short explanation describing the artwork
 * @param {*} altTitles Alternate names for this artwork
 * @param {*} dateStart The year of the period of time associated with the creation of this artwork
 * @param {*} dateEnd The year of the period of time associated with the creation of this artwork
 * @param {*} placeOrigin The location where the creation, design, or production of the artwork took place, or the original location of the artwork
 * @param {*} description Longer explanation describing the artwork
 * @param {*} mediumDisplay The substances or materials used in the creation of a artwork
 * @param {*} artistIds Unique identifier of all artist/cultures associated with this artwork
 * @param {*} artistTitles Names of all artist/cultures associated with this artwork
 * @param {*} styleTitle The name of the preferred style term for this artwork
 * @param {*} classificationTitle The name of the preferred classification term for this artwork
 */
function Artwork(api_link, id, title, imageId, iiifUrl, imageUrl
                , artistId , artistDisplay, dateDisplay
                , shortDescription, altTitles, dateStart
                , dateEnd, placeOrigin, description
                , mediumDisplay, artistIds, artistTitles
                , styleTitle, classificationTitle) {

    this.api_link = api_link;
    this.id = id;
    this.title = title;
    this.imageId = imageId;
    this.iiifUrl = iiifUrl;
    this.imageUrl = imageUrl;
    this.artistId = artistId;
    this.artistDisplay = artistDisplay;
    this.dateDisplay = dateDisplay;
    this.shortDescription = shortDescription;
    this.altTitles = altTitles;
    this.dateStart = dateStart;
    this.dateEnd = dateEnd;
    this.placeOrigin = placeOrigin;
    this.description = description;
    this.mediumDisplay = mediumDisplay;
    this.artistIds = artistIds;
    this.artistTitles = artistTitles;
    this.styleTitle = styleTitle;
    this.classificationTitle = classificationTitle;
}

/**
 * The artist object and all of its details related to their name, life span,
 * and description
 * 
 * @param {*} api_link REST API link for this artist
 * @param {*} id Unique identifier of this artist. Taken from the source system.
 * @param {*} title The name of this artist
 * @param {*} birth_date The year this artist was born
 * @param {*} death_date The year this artist died
 * @param {*} description A biographical description of the artist
 */
function Artist(api_link, id, title, birthDate, deathDate, description) {
    this.api_link = api_link;
    this.id = id;
    this.title = title;
    this.birthDate = birthDate;
    this.deathDate = deathDate;
    this.description = description;
    //would need to collect a collection of their work
    //could also get links to all exhibitions their artwork is involved in
}

/**
 * The exhibitions object and all of its details related to their name, life span,
 * and description
 * 
 * @param {*} api_link REST API link for this exhibitions
 * @param {*} id Unique identifier of this resource. Taken from the source system.
 * @param {*} title The name of this resource
 * @param {*} shortDescription Brief explanation of what this exhibition is
 * @param {*} heroImageUrl URL to the hero image from the website
 * @param {*} galleryTitle The name of the gallery that mainly housed the exhibition
 * @param {*} artworkIds Unique identifiers of the artworks that were part of the exhibition
 * @param {*} prefImageId The image id of the preferred image to use to represent this exhibition
 * @param {*} prefImageUrl The url of the preferred image to use to represent this exhibition
 */
function Exhibition(api_link, id, title, shortDescription, heroImageUrl
                        , galleryTitle, artworkIds, prefImageId, prefImageUrl) {

    this.api_link = api_link;
    this.id = id;
    this.title = title;
    this.shortDescription = shortDescription;
    this.heroImageUrl = heroImageUrl;
    this.galleryTitle = galleryTitle;
    this.artworkIds = artworkIds;
    this.prefImageId = prefImageId;
    this.prefImageUrl = prefImageUrl;
}

/**
 * The function which will fetch JSON data using the provided URL
 * 
 * @param {*} url the URL for the API form which data will be fetched
 * @returns the JSON data which is retrieved from the API call
 */
async function fetchData(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

/**
 * This method will create and return an Exhibition object from the 
 * provided fetched Data 
 * 
 * @param {*} fetchedDataData data, in the form of JSON, retrieved from the API call 
 * from within the data section
 * @returns the resulting Exhibition object
 * @throws TypeError if found in the api model type that provided data does not
 * belong to an exhibition, stored as 'exhibitions' in data.api_model
 */
async function createExhibition(fetchedDataData) {
    if(fetchedDataData.api_model !== 'exhibitions') {
        throw new TypeError('Provided data must belong to an exhibition resource.');
    }

    const prefImageId = fetchedDataData.image_id;    
    var prefImageUrl;
    if(prefImageId !== null) {
        prefImageUrl = await imageUrlFromId(prefImageId);
    }
    
    const exhibit = new Exhibition( fetchedDataData.api_link
                                    , fetchedDataData.id
                                    , fetchedDataData.title
                                    , fetchedDataData.short_description
                                    , fetchedDataData.image_url
                                    , fetchedDataData.gallery_title
                                    , fetchedDataData.artist_ids
                                    , prefImageId
                                    , prefImageUrl
    );

    return exhibit;
}

/**
 * Constructs the actual image url which will be used to fetch the image
 * from the IIIF website 
 * 
 * @param {*} baseUrl the website for the iiif website
 * @param {*} id the image id as it is found on the IIIF website
 * @param {*} sizeW the requested width of the image
 * @param {*} sizeH the requested hight of the image
 * @param {*} regionX as a percentage value of the image width in points, the number of pixels from the top left position on the horizontal axis to crop off
 * @param {*} regionY as a percentage value of the image hight in points, the number of pixels from the top left position on the verticle axis to crop off
 * @param {*} regionW as a percentage value of the image width in points, the width of the region start of the location of regionX
 * @param {*} regionH as a percentage value of the image hight in points, the height of the region start of the location of regionY
 * @param {*} rotation as a degree from 0 to 360, how much to rotate the image
 * @param {*} flipped if the image should be flipped
 * @returns the final url
 */
function imageUrlConstructor(baseUrl, id, sizeW, sizeH
                            , regionX, regionY, regionW, regionH
                            , rotation, flipped) {
    
    //check to see if image parameters are valid values
    if(sizeW <= 0 || sizeH <= 0) {
        throw new RangeError('Input for size must be greater than 0 or undefined.');
    }

    if(sizeW == undefined && sizeH == undefined) {
        throw new RangeError('Input for size must be defined for at least one of the following: width or height.');
    }

    if(regionX < 0 || regionX > 100 || regionY < 0 || regionY > 100 
        || regionW < 0 || regionW > 100 || regionH < 0 || regionH > 100) {
        throw new RangeError('Input for region must be between 0 and 100, inclusive.');
    }

    if(rotation < 0 || rotation > 360) {
        throw new RangeError('Input for rotation must be between 0 and 360, inclusive.');
    }

    //start creating url by starting with image base and id 
    var imageUrl = `${baseUrl}/${id}`;

    //add region, by percentage only
    if(regionX == 0 && regionY == 0 && regionW == 100 && regionH == 100) {
        imageUrl = `${imageUrl}/full`;
    } else {
        imageUrl = `${imageUrl}/pct:${regionX},${regionY},${regionW},${regionH}`;
    }

    //add width to url
    if(sizeW == undefined) {
        imageUrl = `${imageUrl}/,`;
    } else {
        imageUrl = `${imageUrl}/${sizeW},`;
    }

    //add height to url
    if(sizeH !== undefined) {
        imageUrl = `${imageUrl}${sizeH}/`;
    }
    
    //add if image is flipped
    if(flipped) {
        imageUrl = `${imageUrl}!`;
    }
    
    //add ratation to url
    imageUrl = `${imageUrl}/${rotation}/default.jpg`;
    
    return imageUrl;
}

/**
 * Facilites organizing the process in which the url is constructed 
 * for the images to be retrieved from the IIIF website after data is fetched
 * from the Chicago Art Institute API. Has defualt values for the default image 
 * size recommended by the Chicago Art Institute.
 * 
 * @param {*} imageId the image id as it is found on the IIIF website
 * @param {*} sizeW the requested width of the image
 * @param {*} sizeH the requested hight of the image
 * @param {*} regionX as a percentage value of the image width in points, the number of pixels from the top left position on the horizontal axis to crop off
 * @param {*} regionY as a percentage value of the image hight in points, the number of pixels from the top left position on the verticle axis to crop off
 * @param {*} regionW as a percentage value of the image width in points, the width of the region start of the location of regionX
 * @param {*} regionH as a percentage value of the image hight in points, the height of the region start of the location of regionY
 * @param {*} rotation as a degree from 0 to 360, how much to rotate the image
 * @param {*} flipped if the image should be flipped
 * @returns the final url, which is constructed after calling the imageUrlConstructor function
 */
async function imageUrlFromId(imageId, sizeW = 843, sizeH = undefined
                                , regionX = 0, regionY = 0, regionW = 100, regionH = 100
                                , rotation = 0, flipped = false) {

    const fetchUrl = fetchUrlConstructor(UrlTypes.IMAGE, imageId);
    const fetchedImageData = await fetchData(fetchUrl);
    const imageUrl = imageUrlConstructor(fetchedImageData.config.iiif_url
                                        , fetchedImageData.data.id
                                        , sizeW, sizeH
                                        , regionX, regionY, regionW, regionH
                                        , rotation, flipped);
    return imageUrl;
}

/**
 * A helper function which will construct a url which will be used for the api call
 *  
 * @param {*} type the type and format of end point which will reached
 * @param {*} characteristic will hold specific characters which are associated with
 * the provided type
 * @param {*} requiredOnly dictates if only required feilds to construct an object
 * should be retrieved. Used for only the EXHIBIT, IMAGE, ARTWORK, and ARTIST types.
 * @returns the resulting URL which will be used for the api call
 */
function fetchUrlConstructor(type, characteristic, requiredOnly = true) {
    if(characteristic.length === 0) {
        throw new RangeError('Characteristics array should contain at least one value.');
    }

    var url = 'https://api.artic.edu/api/v1';
    var characteristicString = characteristic.join(',');

    //Special case for FEATURED_EXHIBITS since it will generally stay the same to search for 
    // featured exhibitions. The only differing element is how many objects are retrieved
    if(type === UrlTypes.FEATURED_EXHIBITS && characteristic.length == 1) {
        return `${url}/exhibitions/search?query[term][is_featured]=true&page=1&limit=${characteristicString}`;
    }

    //adding endpoint to url based on selected type
    switch (type) {
        case UrlTypes.EXHIBIT:
            url = `${url}/exhibitions`;
            break;
        case UrlTypes.IMAGE:
            url = `${url}/images`;
            break;
        case UrlTypes.ARTIST:
            url = `${url}/agents`;
            break;
        case UrlTypes.ARTWORK:
            url = `${url}/artworks`;
            break;
        default:
    }

    //Based on how many ids are being retrieved, the syntax will be affected
    if(characteristic.length > 1) {
        url = `${url}?ids=${characteristicString}`;
    } else {
        url = `${url}/${characteristicString}`;
    }

    //append the feilds to the url if only the minimum required feilds to construct 
    // an object will be needed was requested (requiredOnly = true)
    if(requiredOnly) {
        if(characteristic.length > 1) {
            url = `${url}&`;
        } else {
            url = `${url}?`;
        }

        switch (type) {
            case UrlTypes.EXHIBIT:
                url = `${url}fields=api_model,api_link,id,title,short_description,image_url,gallery_title,artist_ids,image_id`;
                break;
            case UrlTypes.IMAGE:
                url = `${url}fields=id`;
                break;
            case UrlTypes.ARTIST:
                url = `${url}fields=id`;
                break;
            case UrlTypes.ARTWORK:
                url = `${url}fields=id`;
                break;
            default:
        }
    }

    return url;
}

/**
 * A function which will help create several Exhibition objects after calling the
 * fetch functions
 * 
 * @returns an array of exhibition objects
 */
async function createExhibitionList() {
    //retrieve a list of 5 featured exhibits using fetch function
    const featuredExhibitsUrl = fetchUrlConstructor(UrlTypes.FEATURED_EXHIBITS, [5]);
    const fetchedData = await fetchData(featuredExhibitsUrl);
    
    //the id of the exhibits will be added to an array and each will be fetched
    const idArray = fetchedData.data.map(element => element.id);
    const exhibitResourcesUrl = fetchUrlConstructor(UrlTypes.EXHIBIT, idArray);
    const fetchedExhibitData = await fetchData(exhibitResourcesUrl);

    //var fetchedExhibitDataArray = fetchedExhibitData.map(element => element.data);
    //console.log("one " + fetchedExhibitDataArray[0].id);
    
    //traverse through JSON object to create the exhibition object
    var exhibits = [];
    for (const element of fetchedExhibitData.data) {
        const newExhibit = await createExhibition(element);
        exhibits.push(newExhibit);
    }
    console.log(exhibits.length);

    return exhibits;
}

createExhibitionList();


/*
1. retrieve a list of 5-10 featured exhibits using fetch function
2. load each as a exhibits object, storing data 
    a. retrieve most data from json
    b. for prefered image, will need to create image url
        i. retrieve image using fetch
       ii. use image url constructor to create full url image
3. use display function to display images
*/


async function dateTest() {
    var newDate = new Date();
    document.getElementById('date').innerHTML = newDate.toString();
    //console.log(newDate);
}

dateTest();

(async () => {
    try {
        var url = 'https://api.artic.edu/api/v1/artworks/129884';
        const fetchedData = await fetchData(url);
        //console.log(fetchedData);
    } catch (err) {
        console.log(err);
    } 
})();