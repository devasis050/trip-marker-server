
const API_KEY = process.env.MAP_API_KEY;


const mapPlaceSearchUrl = (text) => {
    return `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${API_KEY}`;
}

const placeFields = ['geometry', 'place_id', 'formatted_address'].join(',');

const placeByPlaceIdUrl = (placeId) => {
    return `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${placeFields}&key=${API_KEY}`;
}

exports.mapPlaceSearchUrl = mapPlaceSearchUrl;
exports.placeByPlaceIdUrl = placeByPlaceIdUrl;