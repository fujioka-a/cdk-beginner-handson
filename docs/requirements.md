# cdk-beginner-handson
L1/L2/L3の違いを体感することにフォーカスしたCDKハンズオン

全2回のハンズオンを1つのリポジトリで管理する。
ただし、第1回・第2回で扱うスタックは明確に分離する。

---

## Goal

- 第1回: CDKの基本理解 + S3デプロイ
- 第2回: diff / L1 L2 L3理解 + SQS + Lambda

---

## Tech Stack

- AWS CDK v2
- TypeScript
- Node.js 22+
- Biome
- npm
- Node の導入手順は README に簡潔に記載する
- `mise` は参考程度に触れる

---

## Repository Structure

```text
cdk-beginner-handson/
├── bin/
│   └── workshop.ts
├── lambda/
│   └── index.js
├── lib/
│   └── stacks/
│       ├── first-session-stack.ts
│       └── second-session-stack.ts
│
├── package.json
├── tsconfig.json
├── biome.json
└── cdk.json
````

---

## Stack Design

---

### First Session Stack

File:
`lib/stacks/first-session-stack.ts`

Purpose:
第1回用

Resources:

* S3 Bucket
* （必要に応じて静的配信用設定）

Example class name:

```ts
export class FirstSessionStack extends Stack
```

Stack name:

```text
cdk-workshop-first-session
```

---

### Second Session Stack

File:
`lib/stacks/second-session-stack.ts`

Purpose:
第2回用

Resources:

* SQS Queue (L1)
* SQS Queue (L2)
* AWS Solutions Constructs の `SqsToLambda` (L3)

Example class name:

```ts
export class SecondSessionStack extends Stack
```

Stack name:

```text
cdk-workshop-second-session
```

---

## Entry Point

File:
`bin/workshop.ts`

Both stacks must be instantiated.

Example:

```ts
new FirstSessionStack(app, 'FirstSessionStack')
new SecondSessionStack(app, 'SecondSessionStack')
```

---

## Important Rules

---

### Rule 1: Stack Separation

第1回と第2回のリソースは絶対に混在させない。

NG:

```text
S3 + SQS を同一 Stack に配置
```

必ず stack を分ける。

---

### Rule 2: L1 / L2 / L3 Learning Purpose

第2回では以下を含める。

* L1: `CfnQueue` のサンプルコード
* L2: `sqs.Queue`
* L3: `SqsToLambda`

L3 は AWS 公式の Solutions Constructs を使う。

---

### Rule 3: Official L3 Pattern

第2回の L3 は自作 construct ではなく、AWS 公式の Solutions Constructs を使用する。

Pattern:

```ts
SqsToLambda
```

Responsibilities:

* Main Queue
* DLQ
* Lambda Function
* Event Source Mapping

---

### Rule 4: Beginner Friendly

コードは初心者向けのため、過度な abstraction を避ける。

Avoid:

* Generic utility abstraction
* advanced factory patterns
* inheritance heavy design

Prefer:

* explicit resource declarations
* readable naming
* comments

Please include detailed comments for workshop participants.
Comments should explain why each resource is defined.

---

## Commands

```bash
npm ci
npm run build
npx cdk synth
npx cdk diff
npx cdk deploy --all --require-approval never --outputs-file cdk-outputs.json
```

---

## Expected Learning Flow

---

### Session 1

* CDK basics
* synth
* S3 deploy

---

### Session 2

* diff meaning
* SQS + Lambda (L1 / L2 / L3)
* deploy
* CLI validation

---

## Validation

Second session must support CLI validation.

Example:

```bash
aws sqs send-message ...
aws sqs receive-message ...
```

---

## Output Quality

Implementation must prioritize:

1. readability
2. workshop clarity
3. learning effectiveness

not production optimization.

````
