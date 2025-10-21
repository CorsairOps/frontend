import {z} from "zod";
import {OrderRequestStatus} from "@/lib/api/services/maintenanceServiceAPI";

export const maintenanceRequestSchema = z.object({
  assetId: z.string().min(1, "Asset ID is required.").max(255, "Asset ID must be at most 255 characters."),
  description: z.string().min(1, "Description is required."),
  status: z.enum(Object.values(OrderRequestStatus) as [string, ...string[]]),
  priority: z.number().min(1, "Priority must be at least 1.").max(5, "Priority must be at most 5.")
});

export const orderNoteRequestSchema = z.object({
  note: z.string().min(1, "Note content is required.")
});