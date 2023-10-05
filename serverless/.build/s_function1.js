
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'ybogdanq',
  applicationName: 'aws-starter',
  appUid: 'tsJtxhTyB5DMVj36bf',
  orgUid: 'a78f5310-5c90-4f36-a5e7-e0b603b7a475',
  deploymentUid: '9ffe2a0f-cc53-4ab0-a0c3-87d084e85661',
  serviceName: 'aws-starter',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'dev',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '7.0.5',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'aws-starter-dev-function1', timeout: 6 };

try {
  const userHandler = require('./index.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}