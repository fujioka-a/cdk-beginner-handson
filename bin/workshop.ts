#!/usr/bin/env node
import { App } from "aws-cdk-lib";
import { FirstSessionStack } from "../lib/stacks/first-session-stack";
import { SecondSessionStack } from "../lib/stacks/second-session-stack";

const app = new App();

new FirstSessionStack(app, "FirstSessionStack", {
  stackName: "cdk-workshop-first-session",
});

new SecondSessionStack(app, "SecondSessionStack", {
  stackName: "cdk-workshop-second-session",
});
