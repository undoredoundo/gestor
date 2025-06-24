import { z } from "zod/v4";

export const createStockSchema = z.object({
  clientId: z.string().refine((value) => !Number.isNaN(Number(value))),
  descriptionId: z.string().refine((value) => !Number.isNaN(Number(value))),
  codeId: z.string().refine((value) => !Number.isNaN(Number(value))),
  date: z.date(),
  quantity: z.string().refine((value) => !Number.isNaN(Number(value))),
  status: z.enum(["ingreso", "egreso"]),
  note: z.string().optional(),
});

export const createResourceSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("client"),
    name: z.string(),
  }),
  z.object({
    type: z.literal("description"),
    name: z.string(),
    clientId: z.number().int(),
  }),
  z.object({
    type: z.literal("code"),
    name: z.string(),
    clientId: z.number().int(),
  }),
]);
