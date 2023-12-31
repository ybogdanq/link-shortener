import * as jwt from "jsonwebtoken";

// Leaving here in case of debuging
//
// const getApiOptions = function (event) {
//   const apiOptions: { [key: string]: any } = {};
//   const tmp = event.methodArn.split(":");
//   const apiGatewayArnTmp = tmp[5].split("/");
//   apiOptions.awsAccountId = tmp[4];
//   apiOptions.region = tmp[3];
//   apiOptions.restApiId = apiGatewayArnTmp[0];
//   apiOptions.stageName = apiGatewayArnTmp[1];
//   return apiOptions;
// };

const denyPolicy = function (principalId, resource) {
  return generatePolicy(principalId, "Deny", resource);
};

const allowPolicy = function (principalId, resource) {
  return generatePolicy(principalId, "Allow", resource);
};

const generatePolicy = function (principalId, effect, resource) {
  const authResponse: { [key: string]: any } = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument: { [key: string]: any } = {};
    policyDocument.Version = "2012-10-17"; // default version
    policyDocument.Statement = [];
    const statementOne: { [key: string]: any } = {};
    statementOne.Action = "execute-api:Invoke"; // default action
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

export const authorizer = (event, context, callback) => {
  const token = event.authorizationToken.replace(/Bearer /g, "");

  jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET as string,
    (err, verified) => {
      if (err) {
        callback(null, denyPolicy("anonymous", event.methodArn));
      } else {
        callback(null, allowPolicy(verified.id, event.methodArn));
      }
    }
  );
};

export const handler = authorizer;
