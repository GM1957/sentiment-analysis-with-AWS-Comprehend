const Response = require('../common/API_Res');
const AWS = require('aws-sdk');
const Comprehend = new AWS.Comprehend();

exports.handler = async event => {
    const body = JSON.parse(event.body);
    if (!body || !body.email) return Response._400({ message: 'NO EMAIL FIELD FOUND PLEASE ADD THE EMAIL FIELD' });

    const params = {
        LanguageCode: 'en',
        TextList: [body.email]
    };
    try {
        const entityResults = await Comprehend.batchDetectEntities(params).promise();
        const sentimentResults = await Comprehend.batchDetectSentiment(params).promise();
        const entities = entityResults.ResultList[0];
        const sentiment = sentimentResults.ResultList[0];
        const responseData = {
            entities,
            sentiment
        };
        console.log(responseData);
        return Response._200(responseData)
    } catch (err) {
        console.log(err, 'error');
        return Response._400({ message: 'failed to work with Comprehend'});
    }
}