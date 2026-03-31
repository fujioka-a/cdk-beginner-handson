import { Tags } from "aws-cdk-lib";
import type { Construct } from "constructs";

export function applyWorkshopTags(scope: Construct): void {
  Tags.of(scope).add("Project", "cdk-beginner-handson");
  Tags.of(scope).add("ManagedBy", "AWS CDK");
}
