export const handler = async (event, ...other) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "This is whole new function that might work",
        input: event,
      },
      null,
      2
    ),
  };
};
