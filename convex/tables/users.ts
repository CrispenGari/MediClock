import { defineTable } from "convex/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

export const userArguments = {
  firstName: v.string(),
  lastName: v.string(),
  id: v.string(),
  email: v.string(),
  image: v.string(),
};
export const users = defineTable(userArguments);

export type TUser = typeof users.validator.type & {
  _creationTime: number;
  _id: Id<"users">;
};
