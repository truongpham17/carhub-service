export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

export function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  console.log(dLat);
  const dLon = degreesToRadians(lon2 - lon1);
  console.log(dLon);
  const lat1R = degreesToRadians(lat1);
  console.log(lat1R);
  const lat2R = degreesToRadians(lat2);
  console.log(lat2R);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1R) * Math.cos(lat2R);
  console.log(a);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  console.log(earthRadiusKm * c);
  return earthRadiusKm * c;
}
