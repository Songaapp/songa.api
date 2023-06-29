const getAllUsers = {
  tags: ["users"],
  description: "Lists all the users",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: {
              count: 0,
              user: [],
            },
          },
        },
      },
    },
  },
};
const getAllRiders = {
  tags: ["Users"],
  description: "Lists all the users",
  responses: {
    200: {
      description: "OK",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: {
              count: 0,
              user: [],
            },
          },
        },
      },
    },
  },
};
export const userRoutesDocs = {
  "/api/users/auth": {
    get: getAllUsers,
    post: getAllRiders,
  },
};
