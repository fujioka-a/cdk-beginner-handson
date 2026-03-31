# cdk-beginner-handson

AWS CDK の初学者向けハンズオン用リポジトリです。  
第1回では S3 を使って CDK の基本操作を学び、第2回では SQS を使って L1 / L2 / L3 の違いを体感します。

## Goal

- 第1回: CDK の基本理解と S3 デプロイ
- 第2回: `cdk diff` の理解と SQS で学ぶ L1 / L2 / L3

## Structure

```text
cdk-beginner-handson/
├── bin/
│   └── workshop.ts
├── lambda/
│   └── index.js
├── lib/
│   ├── shared/
│   │   └── tags.ts
│   └── stacks/
│       ├── first-session-stack.ts
│       └── second-session-stack.ts
├── docs/
│   ├── README.md
│   └── requirements.md
├── package.json
├── tsconfig.json
├── biome.json
└── cdk.json
```

## Sessions

### Session 1

- `lib/stacks/first-session-stack.ts`
- S3 Bucket を明示的に定義
- `synth`, `diff`, `deploy` の基本フローを確認

### Session 2

- `lib/stacks/second-session-stack.ts`
- L1: `CfnQueue`
- L2: `Queue`
- L3: `SqsToLambda` （AWS Solutions Constructs の公式パターン）
- SQS + Lambda のデプロイ差分と CLI 確認を実施

## Node Setup

Node.js 22 系が使える状態にしてからハンズオンを始めてください。
導入方法は各自の使い慣れたものを使って構いません。
たとえば `mise` を使う場合は、次のように Node をセットアップできます。

```bash
mise use -g node@22
node --version
```

- ここでは「Node をセットアップすること」だけ把握しておけば十分です。
- `mise` はあくまで参考です。`nvm` や `volta` でも問題ありません。

## Commands

```bash
npm ci
npm run build
npm run lint
npm run format
npx cdk synth
npx cdk diff
npx cdk deploy --all --require-approval never --outputs-file cdk-outputs.json
```

## Notes

- 第1回と第2回のリソースは別スタックに分離しています。
- 参加者が読みやすいように、複雑な抽象化は避けてコメントを多めに入れています。
- 第2回では CloudFormation Outputs からキュー URL と Lambda 関数名を確認できます。

## CLI Validation Example

第2回のデプロイ後は、出力された `L2QueueUrl` または `L3QueueUrl` を使って確認できます。

```bash
aws sqs send-message \
  --queue-url <CloudFormation Output の Queue URL> \
  --message-body "hello from workshop"
```
