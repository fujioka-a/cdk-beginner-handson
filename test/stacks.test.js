const assert = require("node:assert/strict");
const test = require("node:test");

require("ts-node/register");

const { App } = require("aws-cdk-lib");
const { Match, Template } = require("aws-cdk-lib/assertions");
const { FirstSessionStack } = require("../lib/stacks/first-session-stack");
const { SecondSessionStack } = require("../lib/stacks/second-session-stack");

function createTemplates() {
  const app = new App();

  const firstSessionStack = new FirstSessionStack(app, "FirstSessionStack", {
    stackName: "cdk-workshop-first-session",
  });
  const secondSessionStack = new SecondSessionStack(app, "SecondSessionStack", {
    stackName: "cdk-workshop-second-session",
  });

  return {
    first: Template.fromStack(firstSessionStack),
    second: Template.fromStack(secondSessionStack),
  };
}

test("FirstSessionStack creates a versioned encrypted S3 bucket for the workshop", () => {
  const { first } = createTemplates();

  first.hasResourceProperties("AWS::S3::Bucket", {
    BucketEncryption: {
      ServerSideEncryptionConfiguration: [
        {
          ServerSideEncryptionByDefault: {
            SSEAlgorithm: "AES256",
          },
        },
      ],
    },
    VersioningConfiguration: {
      Status: "Enabled",
    },
  });

  first.hasOutput("WorkshopBucketName", {});
});

test("SecondSessionStack keeps the L1, L2, and L3 examples in the synthesized template", () => {
  const { second } = createTemplates();

  second.resourceCountIs("AWS::SQS::Queue", 4);
  second.resourceCountIs("AWS::Lambda::Function", 1);
  second.resourceCountIs("AWS::Lambda::EventSourceMapping", 1);

  second.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "cdk-workshop-l1-queue",
    VisibilityTimeout: 30,
  });

  second.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "cdk-workshop-l2-queue",
    VisibilityTimeout: 30,
  });

  second.hasResourceProperties("AWS::Lambda::Function", {
    FunctionName: "cdk-workshop-l3-pattern-processor",
    Handler: "index.handler",
    Runtime: "nodejs22.x",
    TracingConfig: {
      Mode: "Active",
    },
  });
});

test("SecondSessionStack wires the L3 queue to its DLQ and Lambda consumer", () => {
  const { second } = createTemplates();

  second.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "cdk-workshop-l3-pattern-dlq",
  });

  second.hasResourceProperties("AWS::SQS::Queue", {
    QueueName: "cdk-workshop-l3-pattern-queue",
    RedrivePolicy: {
      deadLetterTargetArn: {
        "Fn::GetAtt": [Match.anyValue(), "Arn"],
      },
      maxReceiveCount: 3,
    },
    VisibilityTimeout: 30,
  });

  second.hasResourceProperties("AWS::Lambda::EventSourceMapping", {
    EventSourceArn: {
      "Fn::GetAtt": [Match.anyValue(), "Arn"],
    },
    FunctionName: {
      Ref: Match.anyValue(),
    },
  });

  second.hasOutput("L3QueueUrl", {});
  second.hasOutput("L3DeadLetterQueueUrl", {});
  second.hasOutput("L3LambdaName", {});

  const outputs = second.findOutputs("*");
  assert.ok(outputs.L3QueueUrl);
  assert.ok(outputs.L3DeadLetterQueueUrl);
  assert.ok(outputs.L3LambdaName);
});
