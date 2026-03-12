/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {Array} coord1 - [longitude, latitude]
 * @param {Array} coord2 - [longitude, latitude]
 * @returns {Number} Distance in kilometers
 */
const calculateDistance = (coord1, coord2) => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Check if point is inside polygon
 * @param {Array} point - [longitude, latitude]
 * @param {Array} polygon - Array of [longitude, latitude] arrays
 * @returns {Boolean}
 */
const isPointInPolygon = (point, polygon) => {
    const x = point[0], y = point[1];
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0], yi = polygon[i][1];
        const xj = polygon[j][0], yj = polygon[j][1];

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

/**
 * Calculate area of polygon in hectares
 * @param {Array} coordinates - Array of [longitude, latitude] arrays
 * @returns {Number} Area in hectares
 */
const calculatePolygonArea = (coordinates) => {
    if (!coordinates || coordinates.length < 3) return 0;

    let area = 0;
    const R = 6371000; // Earth's radius in meters

    for (let i = 0; i < coordinates.length - 1; i++) {
        const [lon1, lat1] = coordinates[i];
        const [lon2, lat2] = coordinates[i + 1];

        const x1 = R * Math.cos(lat1 * Math.PI / 180) * Math.cos(lon1 * Math.PI / 180);
        const y1 = R * Math.cos(lat1 * Math.PI / 180) * Math.sin(lon1 * Math.PI / 180);
        const z1 = R * Math.sin(lat1 * Math.PI / 180);

        const x2 = R * Math.cos(lat2 * Math.PI / 180) * Math.cos(lon2 * Math.PI / 180);
        const y2 = R * Math.cos(lat2 * Math.PI / 180) * Math.sin(lon2 * Math.PI / 180);
        const z2 = R * Math.sin(lat2 * Math.PI / 180);

        area += Math.sqrt(Math.pow(y1 * z2 - z1 * y2, 2) +
            Math.pow(z1 * x2 - x1 * z2, 2) +
            Math.pow(x1 * y2 - y1 * x2, 2)) / 2;
    }

    return area / 10000; // Convert to hectares
};

/**
 * Generate bounding box from center point and radius
 * @param {Array} center - [longitude, latitude]
 * @param {Number} radiusKm - Radius in kilometers
 * @returns {Object} Bounding box { minLon, maxLon, minLat, maxLat }
 */
const getBoundingBox = (center, radiusKm) => {
    const [lon, lat] = center;
    const R = 6371;

    const radDist = radiusKm / R;
    const radLat = lat * Math.PI / 180;
    const radLon = lon * Math.PI / 180;

    const minLat = Math.asin(Math.sin(radLat) * Math.cos(radDist) +
        Math.cos(radLat) * Math.sin(radDist) * Math.cos(225 * Math.PI / 180));
    const maxLat = Math.asin(Math.sin(radLat) * Math.cos(radDist) +
        Math.cos(radLat) * Math.sin(radDist) * Math.cos(45 * Math.PI / 180));

    const deltaLon = Math.asin(Math.sin(radDist) / Math.cos(radLat));

    return {
        minLon: (radLon - deltaLon) * 180 / Math.PI,
        maxLon: (radLon + deltaLon) * 180 / Math.PI,
        minLat: minLat * 180 / Math.PI,
        maxLat: maxLat * 180 / Math.PI
    };
};

/**
 * Validate coordinates array
 * @param {Array} coords - Coordinates to validate
 * @returns {Boolean}
 */
const isValidCoordinates = (coords) => {
    if (!Array.isArray(coords) || coords.length !== 2) return false;
    const [lon, lat] = coords;
    return (
        typeof lon === 'number' &&
        typeof lat === 'number' &&
        lon >= -180 && lon <= 180 &&
        lat >= -90 && lat <= 90
    );
};

module.exports = {
    calculateDistance,
    isPointInPolygon,
    calculatePolygonArea,
    getBoundingBox,
    isValidCoordinates
};