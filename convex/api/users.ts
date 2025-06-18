import { mutationGeneric } from "convex/server";
import { userArguments } from "../tables/users";

export const findUserOrCreateOne = mutationGeneric({
  args: userArguments,
  handler: async ({ db }, args) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
      if (!!me)
        return {
          me,
        };
      const _id = await db.insert("users", args);
      const user = await db.get(_id);
      return { me: user };
    } catch (error) {
      return { me: null };
    }
  },
});
