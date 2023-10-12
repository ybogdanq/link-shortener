interface IErrorResponse {
  statusCode: number;
  headers?: { [key: string]: any };
  body: any;
  event: any;
}

export const errorResponse = ({
  event,
  body,
  statusCode,
  headers,
}: IErrorResponse) => {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": process.env.CLIENT_URL || "*",
      "Access-Control-Allow-Credentials": true,
      ...(headers ? headers : {}),
    },
    body: JSON.stringify(body),
  };
};
