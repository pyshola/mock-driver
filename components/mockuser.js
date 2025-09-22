import prompt from "./prompts";
import { z } from "zod";
import { coordinate } from "./tools";
import { google } from "@ai-sdk/google";
import { stepCountIs, tool, generateObject, streamObject } from "ai";

async function generateMockDriver(geofenceData, latitude, longitude) {
  const result = await generateObject({
    model: google("models/gemini-2.5-flash"),
    tool: {
      coordinate,
      geofence: tool({
        description: "Pick coordinates within the polygon area ",
        inputSchema: locationSchema,
        execute: geofenceData.location,
      }),
    },
    schema: z.object({
      users: z.array(
        z.object({
          title: z.enum(["Mr", "Prefer not to say"]),
          firstname: z.string().describe("The first name of the user"),
          lastname: z.string().describe("The last name of the user"),
          latitude: z.string().describe("The latitude of the user"),
          longitude: z.string().describe("The longitude of the user"),
          email: z.string().describe("The email of the user"),
          address: z.string().describe("The address of the user"),
          seat: z
            .enum(["2", "4", "6"])
            .describe("Number of seats for passenger"),
          color: z
            .enum([
              "Black",
              "Blue",
              "Gold",
              "Grey",
              "Navy",
              "Silver",
              "White",
              "Motocycle Generic",
            ])
            .describe("The user icon color"),
          heading: z.number().describe("The heading of car in degrees"),
        }),
      ),
    }),
    prompt: `Generate ${users} mock users with name, email, phone number, address, latitude, longitude within the geofence area of ${geofenceData.name} in ${cityData.name}. Return the response in the following array of JSON format:
                  [
                      {
                        "name": "John Doe",
                        "latitude": "37.7749",
                          "longitude": "-122.4194",
                          ...,
                      } ,
                      ...
                  ]
                      All fields are mandatory.

                      Use the following criteria when generating the users:
                      1. Ensure the user name is realistic with people living within ${cityData.name}, ${country}.
                      2. Ensure the phone number is a valid format.
                      3. Ensure email start with user, follower by name and is unique.
                      4. Ensure the email is a valid format and unique.
                      5. Ensure the address is realistic with people living within ${cityData.name}, ${country}.


                      Use the following criteria when generating the coodinates for the users:
                      1. Use lat, lng as the center point to randomise the user location within the geofence area.
                      2. Ensure coordinates (latitude, longitude) fall along a road.
                      3. The coordinates should represent a valid location on a street or highway.
                      4. The heading should be a realistic angle for car travel (e.g., 90 degrees represents east, 180 degrees represents south, etc.)
                      5. Ensure the coordinates are not in bodies of water, parks, or other non-navigable areas.
                      6. Ensure the coordinates are within a reasonable distance from the specified center point (latitude: ${latitude}, longitude: ${longitude}).
                      7. Ensure the latitude and longitude are on the road.
                      8. Ensure the heading or direction in degrees (0 to 360) that indicates the car's current movement.
                      9. Ensure the generated coordinates are not too far from a city or road.
                      10. Ensure the latitude and longitude are within the geofence area. the location is in GeoJSON format.
                      11. Produce a plausible (lat, lng, heading) for a car icon near a given center point, with the icon snapped to a drivable road segment and facing the road's direction.

                      Use the following criteria when generating the vehicle information for the users:
                      1. Ensure passenger seat is 2,4 or 6 if user type is passenger otherwise null.
                      2. Ensure the vehicle number is realistic.
                      3. Ensure the vehicle make is realistic, e.g Toyota, Tesla.
                      4. Ensure the vehicle model is realistic, e.g Camry.
                      5. Ensure phone is E.164 standard compliant identifier string.
                      6. Ensure the vehicle year is between 2008 to 2024.
                      7. Ensure color is one of the following Black,Blue,Gold,Green,Grey,Navy,Silver,White,Yellow if user type is passenger otherwise Motocycle Generic.

                      ## Review Focus Areas:
                      1. **Correctness** – Ensure the coordinate fall on the road, highway or street.
                      2. **Relevance** – Ensure the coordinates are within the geofence area.
                      3. **Diversity** – Ensure a variety of coordinates within the geofence area.
                      4. **Realism** – Ensure the coordinates represent real-world locations on roads.
                      5. **Compliance** – Ensure the coordinates adhere to the specified format and constraints.`,
  });
}

export default mockuser = (req, res) => {
  res.json({
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
  });
};
