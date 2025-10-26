
import { zodToJsonSchema } from "zod-to-json-schema";

export const buildJsonSchemas = (schemas: Record<string, any>) => {
  const jsonSchemas: Record<string, any> = {};
  for (const [key, schema] of Object.entries(schemas)) {
    jsonSchemas[key] = zodToJsonSchema(schema);
  }
  return {
    schemas: jsonSchemas,
    $ref: (name: string) => ({ $ref: `#/components/schemas/${name}` }),
  };
};
