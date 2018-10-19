# Octank Analytics

This is a SAM CLI application that supports the Octank Analytics Skill for Alexa.

```bash
.
├── README.md                   <-- This instructions file
├── commands.txt                <-- Deployment commands
├── analytics                   <-- Source code for the lambda function
│   ├── app.js                  <-- Lambda function code
│   ├── repo.js                 <-- Repository that queries DynamoDB
│   ├── package.json            <-- NodeJS dependencies
│   └── tests                   <-- Unit tests
│       └── unit
│           └── test_handler.js
└── template.yaml               <-- SAM template
```

## Requirements

* AWS CLI already configured with at least PowerUser permission
* [NodeJS 8.10+ installed](https://nodejs.org/en/download/)
* [Docker installed](https://www.docker.com/community-edition)

## Setup process

### Installing dependencies

In this example we use `npm` but you can use `yarn` if you prefer to manage NodeJS dependencies:

```bash
cd analytics
npm install
cd ../
```

### Local development

```bash
sam local invoke "Analytics" --event events/top.json
```

## Packaging and deployment

AWS Lambda NodeJS runtime requires a flat folder with all dependencies including the application. SAM will use `CodeUri` property to know where to look up for both application and dependencies:
Firstly, we need a `S3 bucket` where we can upload our Lambda functions packaged as ZIP before we deploy anything - If you don't have a S3 bucket to store code artifacts then this is a good time to create one.

Next, run the following command to package our Lambda function to S3:

```bash
sam package \
    --template-file template.yaml \
    --s3-bucket octank-sam-lambda-artifacts \
    --profile octank \
    --output-template-file packaged.yaml
```

Next, the following command will create a Cloudformation Stack and deploy your SAM resources.

```bash
sam deploy \
    --template-file ./packaged.yaml \
    --stack-name octank-analytics-alexa \
    --profile octank \
    --region us-east-1 \
    --capabilities CAPABILITY_IAM
```

> **See [Serverless Application Model (SAM) HOWTO Guide](https://github.com/awslabs/serverless-application-model/blob/master/HOWTO.md) for more details in how to get started.**

## Testing

We use `jest` for testing our code and it is already added in `package.json` under `scripts`, so that we can simply run the following command to run our tests:

```bash
cd analytics
npm run test
```
