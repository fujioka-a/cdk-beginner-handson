// 公式 L3 パターンが作成した SQS キューからメッセージを受け取り、
// Lambda がどのようにイベントを処理するかを確認するための最小実装です。
exports.handler = async (event) => {
  console.log("受信したイベント:", JSON.stringify(event, null, 2));

  return {
    batchItemFailures: [],
  };
};
