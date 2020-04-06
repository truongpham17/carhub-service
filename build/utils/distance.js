"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.degreesToRadians = degreesToRadians;
exports.distanceInKmBetweenEarthCoordinates = distanceInKmBetweenEarthCoordinates;

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const lat1R = degreesToRadians(lat1);
  const lat2R = degreesToRadians(lat2);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1R) * Math.cos(lat2R);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}