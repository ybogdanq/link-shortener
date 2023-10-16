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
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE,PATCH",
      ...(headers ? headers : {}),
    },
    body: JSON.stringify(body),
  };
};
