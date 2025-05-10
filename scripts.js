function imageUrlConstructor(baseUrl, imageId, imageSize) {
    
}

function imageUrlConstructor2(baseUrl, imageId) {
    
}

/**
 * The artwork object and all of its details related to image, artist, and creation 
 * 
 * @param {*} id Unique identifier of this artwork. Taken from the source system.
 * @param {*} title The name of this artwork
 * @param {*} image_id Unique identifier of the preferred image to use to represent this artwork
 * @param {*} iiif_url IIIF URL of the image of this artwork
 * @param {*} image_url The complete url used to retieve the image used to represent this artwork
 * @param {*} artist_id Unique identifier of the preferred artist/culture associated with this artwork
 * @param {*} artist_display Readable description of the creator of this artwork. Includes artist names, nationality and lifespan dates
 * @param {*} date_display Readable, free-text description of the period of time associated with the creation of this artwork. 
 * @param {*} short_description Short explanation describing the artwork
 * @param {*} alt_titles Alternate names for this artwork
 * @param {*} date_start The year of the period of time associated with the creation of this artwork
 * @param {*} date_end The year of the period of time associated with the creation of this artwork
 * @param {*} place_origin The location where the creation, design, or production of the artwork took place, or the original location of the artwork
 * @param {*} description Longer explanation describing the artwork
 * @param {*} medium_display The substances or materials used in the creation of a artwork
 * @param {*} artist_ids Unique identifier of all artist/cultures associated with this artwork
 * @param {*} artist_titles Names of all artist/cultures associated with this artwork
 * @param {*} style_title The name of the preferred style term for this artwork
 * @param {*} classification_title The name of the preferred classification term for this artwork
 */
function Artwork(id, title, image_id, iiif_url
                , artist_id , artist_display
                , date_display, short_description, date_start
                , date_end, place_origin, description
                , medium_display, artist_ids, artist_titles
                , style_title, classification_title
) {
    this.id = id;
    this.title = title;
    this.image_id = image_id;
    this.iiif_url = iiif_url;
    this.image_url = imageUrlConstructor(activeArtwork.iiif_url, activeArtwork.image_id, 843);
    this.artist_id = artist_id;
    this.artist_display = artist_display;
    this.date_display = date_display;
    this.short_description = short_description;
    this.alt_titles = alt_titles;
    this.date_start = date_start;
    this.date_end = date_end;
    this.place_origin = place_origin;
    this.description = description;
    this.medium_display = medium_display;
    this.artist_ids = artist_ids;
    this.artist_titles = artist_titles;
    this.style_title = style_title;
    this.classification_title = classification_title;
}

/**
 * The artist object and all of its details related to their name, life span,
 * and description
 * 
 * @param {*} id Unique identifier of this artist. Taken from the source system.
 * @param {*} title The name of this artist
 * @param {*} birth_date The year this artist was born
 * @param {*} death_date The year this artist died
 * @param {*} description A biographical description of the artist
 */
function Artist(id, title, birth_date, death_date, description) {
    this.id = id;
    this.title = title;
    this.birth_date = birth_date;
    this.death_date = death_date;
    this.description = description;
    //would need to collect a collection of their work
    //could also get links to all exhibitions their artwork is involved in
}

/**
 * The exhibitions object and all of its details related to their name, life span,
 * and description
 * 
 * @param {*} id Unique identifier of this resource. Taken from the source system.
 * @param {*} title The name of this resource
 * @param {*} short_description Brief explanation of what this exhibition is
 * @param {*} image_url URL to the hero image from the website
 * @param {*} gallery_title The name of the gallery that mainly housed the exhibition
 * @param {*} artwork_ids Unique identifiers of the artworks that were part of the exhibition
 * @param {*} image_id Unique identifier of the preferred image to use to represent this exhibition
 */
function Exhibitions(id, title, short_description, image_url
                        , gallery_title, artwork_ids, image_id) {
    this.id = id;
    this.title = title;
    this.short_description = short_description;
    this.image_url = image_url;
    this.gallery_title = gallery_title;
    this.artwork_ids = artwork_ids;
    this.image_id = image_id;
}

function dateTest() {
    var newDate = new Date();
    document.getElementById("date1").innerHTML = newDate.toString();
    console.log(newDate);
}

dateTest();