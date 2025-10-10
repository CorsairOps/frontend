import {z} from "zod";
import {MissionRequestStatus} from "@/lib/api/services/missionServiceAPI";

export const missionRequestSchema = z.object({
  name: z.string().min(1, "Mission name is required").max(255, "Mission name cannot exceed 255 characters"),
  priority: z.preprocess(
    val => val === "" ? undefined : Number(val),
    z.number({error: "Priority is required"}).min(1, "Priority must be between 1 and 5").max(5, "Priority must be between 1 and 5")
      .refine(v => !isNaN(v), {message: "Priority must be a number"})
  ),
  status: z.enum(Object.values(MissionRequestStatus) as [string, ...string[]]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  description: z.string().max(3000, "Description cannot exceed 3000 characters").optional()
});

export const missionLogSchema = z.object({
  entry: z.string().min(1, "Log entry is required").max(5000, "Log entry cannot exceed 5000 characters")
});