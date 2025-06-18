import { defineSchema } from "convex/server";
import { users } from "./tables/users";

export default defineSchema(
  { users },
  { schemaValidation: true, strictTableNameTypes: true }
);
