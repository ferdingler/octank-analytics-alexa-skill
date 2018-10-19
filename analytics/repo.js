const AWS = require('aws-sdk');
const lodash = require('lodash');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.getSocialMediaStatus = async () => {
  const result = await dynamodb.get({
    TableName: 'OctankAnalytics',
    Key: { metricName: 'SocialMediaStatus' },
  }).promise();
  return result.Item.value;
};

exports.getTopProducts = async (n) => {
  const result = await dynamodb.get({
    TableName: 'OctankAnalytics',
    Key: { metricName: 'TopShoes' },
  }).promise();
  const value = result.Item.value;
  return lodash.take(value, n);
};