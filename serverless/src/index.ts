export const handler = async (event) => {
  return {
    statusCode: 200 as number,
    body: JSON.stringify(
      {
        message: "Go Serverless v100! Your function executed successfully!",
        input: event,
      },
      null,
      2
    ),
  };
};
