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

export const createClientSchema = z.object({
  name: z.string().min(1, "El nombre debe tener al menos 1 caracter"),
});
