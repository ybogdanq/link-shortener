
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'ybogdanq',
  applicationName: 'aws-starter',
  appUid: 'tsJtxhTyB5DMVj36bf',
  orgUid: 'a78f5310-5c90-4f36-a5e7-e0b603b7a475',
  deploymentUid: '90455d71-94a1-49ed-b694-ca8f554dc726',
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

const handlerWrapperArgs = { functionName: 'aws-starter-dev-createCustomer', timeout: 6 };

try {
  const userHandler = require('./createCustomer.js');
  module.exports.handler = serverlessSDK.handler(userHandler.createCustomer, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}