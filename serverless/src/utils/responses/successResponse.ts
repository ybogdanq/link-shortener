interface ISuccessResponse {
  statusCode: number;
  headers?: { [key: string]: any };
  body: any;
  event: any;
}

export const successResponse = ({
  event,
  statusCode,
  headers,
  body,
}: ISuccessResponse) => {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials" : true,
      "Access-Control-Allow-Headers" : "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
      ...(headers ? headers : {}),
    },
    body: JSON.stringify(body),
  };
};
