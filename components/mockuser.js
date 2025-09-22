import { prompt } from "./prompts.js";
import { z } from "zod";
import { coordinate } from "./tools.js";
import { google } from "@ai-sdk/google";
import { stepCountIs, tool, generateObject, streamObject } from "ai";

const locationSchema = z.object({
  type: z.enum(["Polygon"]),
  coordinates: z.array(z.array(z.array(z.number()))),
});

async function generateMockDriver(geofenceData, latitude, longitude) {
  const result = await generateObject({
    model: google("models/gemini-2.5-flash"),
    tool: {
      coordinate,
      geofence: tool({
        description: "Pick coordinates within the polygon area ",
        inputSchema: locationSchema,
        execute: geofenceData.coordinates,
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
    prompt,
    });

    return result;
}

export const mockuser = async (req, res) => {
  console.log(req.body)
  const { latitude, longitude, geofence } = req.body;
  if (!latitude || !longitude || !geofence) {
    return res.status(400).json({ error: "Missing required parameters" });
  }
  console.log(geofence.features[0].geometry)
  // For simplicity, returning a static user object
  // In a real implementation, you would call generateMockDriver and return its result
  const users = await generateMockDriver(geofence.features[0].geometry, latitude, longitude);
  console.log(users)
  return res.json(users);  
  
};
