import { z } from "zod/v4";

const stringNumber = z.string().refine((value) => !Number.isNaN(Number(value)));

export const createStockSchema = z.object({
  clientId: stringNumber,
  descriptionId: stringNumber,
  codeId: stringNumber,
  date: z.date(),
  quantity: stringNumber,
  status: z.enum(["ingreso", "egreso"]),
  note: z.string().optional(),
});

export const createResourceSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("client"),
    name: z.string(),
  }),
  z.object({
    type: z.enum(["description", "code"]),
    name: z.string(),
    clientId: z.number().int(),
  }),
  z.object({
    type: z.literal("tool"),
    name: z.string(),
    toolType: z.enum(["mecha", "macho", "fresa"]),
    count: stringNumber,
  }),
]);

export const updateResourceSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.enum(["client", "description", "code"]),
    name: z.string(),
    resourceId: z.number().int(),
  }),
  z.object({
    type: z.literal("tool"),
    name: z.string(),
    toolType: z.enum(["mecha", "macho", "fresa"]),
    resourceId: z.number().int(),
    count: stringNumber,
  }),
]);
