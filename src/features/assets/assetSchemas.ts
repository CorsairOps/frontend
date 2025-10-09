import {z} from "zod";
import {AssetRequestStatus, AssetRequestType} from "@/lib/api/services/assetServiceAPI";

export const assetRequestSchema = z.object({
  name: z.string().min(1, "Asset name is required").max(255, "Name cannot exceed 255 characters"),
  type: z.enum(Object.values(AssetRequestType) as [string, ...string[]]),
  status: z.enum(Object.values(AssetRequestStatus) as [string, ...string[]]),
  latitude: z.preprocess(
    val => val === "" ? undefined : Number(val),
    z.number({error: "Latitude is required"}).min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90")
      .refine(v => !isNaN(v), {message: "Latitude must be a number"})
  ),
  longitude: z.preprocess(
    val => val === "" ? undefined : Number(val),
    z.number({error: "Longitude is required"}).min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180")
      .refine(v => !isNaN(v), {message: "Longitude must be a number"})
  )
});