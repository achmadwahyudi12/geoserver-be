const turf = require('@turf/turf');
const wktHelper = require("wkt-parser-helper");

const Point = (latitude, longitude) => {
    try {
        // Validate that the latitude and longitude are numbers
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            throw new Error('Latitude and longitude must be numbers');
        }

        return turf.point([longitude, latitude]);
    } catch (error) {
        console.error('Error in Point:', error);
        return null;
    }
}

const PointToBuffer = (point, radius) => {
    try {
        // Validate that the point is a valid GeoJSON Point object
        if (!point || !point.geometry || point.geometry.type !== 'Point' || !Array.isArray(point.geometry.coordinates)) {
            throw new Error('Invalid point object');
        }
        
        point.geometry.coordinates = point.geometry.coordinates.map(coord => parseFloat(coord));

        // Validate that the coordinates are numbers
        const [longitude, latitude] = point.geometry.coordinates;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            throw new Error('Coordinates must contain numbers');
        }

        return turf.buffer(point, radius, { units: 'meters' });
    } catch (error) {
        console.error('Error in PointToBuffer:', error);
        return null;
    }
}

const FeatureToWKT = (feature) => {
    try {
        // Validate that the feature is a valid GeoJSON Feature object
        if (!feature || !feature.type || feature.type !== 'Feature' || !feature.geometry || !feature.geometry.type) {
            throw new Error('Invalid feature object');
        }

        return wktHelper.convertFeatureToWK(feature);
    } catch (error) {
        console.error('Error in FeatureToWKT:', error);
        return null;
    }
}

module.exports = { Point, PointToBuffer, FeatureToWKT };