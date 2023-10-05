export const handler = async (event, ...other) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "I don't really know what to do to configure this",
        input: event,
      },
      null,
      2
    ),
  };
};
