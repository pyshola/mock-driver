const locationSchema = z.object({
  type: z.enum(["Polygon"]),
  coordinates: z.array(z.array(z.array(z.number()))),
});
const coordinateSchema = z.object({
  type: z.enum(["Point"]),
  coordinates: z.array(z.number()),
});
const distanceInMiles = z.number();

export const coordinate = tool({
  description:
    "Pick coordinates along the road within the distance from the center point",
  inputSchema: z.object({
    center: coordinateSchema.describe("The center point as a GeoJSON Point"),
    maxDistance: distanceInMiles.describe(
      "The maximum distance from the center point in miles",
    ),
  }),

  execute: async (latitude, longitude) => {
    // Convert miles to degrees (approximation)
    const milesToDegrees = (miles) => miles / 69;
    const lat = latitude;
    const lng = longitude;
    const radius = milesToDegrees(distance || 5); // Default to 5 miles if not provided
    let point;
    let attempts = 0;
    const isPointInPolygon = (point, polygon) => {
      const x = point.coordinates[0];
      const y = point.coordinates[1];
      let inside = false;
      for (
        let i = 0, j = polygon.coordinates[0].length - 1;
        i < polygon.coordinates[0].length;
        j = i++
      ) {
        const xi = polygon.coordinates[0][i][0];
        const yi = polygon.coordinates[0][i][1];
        const xj = polygon.coordinates[0][j][0];
        const yj = polygon.coordinates[0][j][1];
        const intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    };
    do {
      const u = Math.random();
      const v = Math.random();
      const w = radius * Math.sqrt(u);
      const t = 2 * Math.PI * v;
      const x = w * Math.cos(t);
      const y = w * Math.sin(t);
      const newLat = lat + y;
      const newLng = lng + x / Math.cos((lat * Math.PI) / 180);
      point = {
        type: "Point",
        coordinates: [newLng, newLat],
      };
      attempts++;
      if (attempts > 20) {
        break;
      }
    } while (!isPointInPolygon(point, geofenceData.location));
    return point;
  },
});
