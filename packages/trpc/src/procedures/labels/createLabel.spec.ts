import { trpcSetup, tearDown } from "../../testutils";
import { recipeFactory } from "../../factories/recipeFactory";
import { prisma } from "@recipesage/prisma";
import { User } from "@prisma/client";
import type { CreateTRPCProxyClient } from "@trpc/client";
import type { AppRouter } from "../../index";

describe("create Label", () => {
  let user: User;
  let trpc: CreateTRPCProxyClient<AppRouter>;

  beforeAll(async () => {
    ({ user, trpc } = await trpcSetup());
  });

  afterAll(() => {
    return tearDown(user.id);
  });

  describe("success", () => {
    it("creates a label with all parameters provided", async () => {
      const label = await trpc.labels.createLabel.mutate({
        title: "diners",
        labelGroupId: null,
      });
      expect(typeof label.id).toBe("string");
      const response = await prisma.label.findFirst({
        where: {
          id: label.id,
        },
      });
      expect(typeof response?.id).toBe("string");
      
      const updatedLabel = await prisma.label.findUnique({
        where: {
          id: label.id,
        },
      });
      expect(updatedLabel?.title).toEqual("diners");
    });
  });
});
