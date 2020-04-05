

const mapPlaceSearchUrl = (text, API_KEY) => {
    return `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&key=${API_KEY}`;
}

const placeFields = ['geometry', 'place_id', 'formatted_address', 'name'].join(',');

const placeByPlaceIdUrl = (placeId, API_KEY) => {
    return `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=${placeFields}&key=${API_KEY}`;
}

exports.mapPlaceSearchUrl = mapPlaceSearchUrl;
exports.placeByPlaceIdUrl = placeByPlaceIdUrl;