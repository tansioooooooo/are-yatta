# 繰り返しTODOアプリ

定期的なタスク（植物の水やり、カーテンの洗濯など）を管理するTODOアプリケーション。

## 機能

- 繰り返しタスクの作成・管理（日次、週次、月次、カスタム間隔）
- カテゴリー別のタスク整理
- タスク完了時の自動次回日程更新
- 実行履歴の記録
- レスポンシブデザイン（PC・スマートフォン対応）

## 技術スタック

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript, Prisma
- **Database**: MySQL
- **開発環境**: Docker Compose

## セットアップ

### 必要な環境

- Docker Desktop
- Git

### インストール手順

1. リポジトリをクローン
```bash
git clone https://github.com/username/are-yatta.git
cd are-yatta
```

2. 初回セットアップ
```bash
make setup
```

3. 開発環境を起動
```bash
make dev
```

4. アプリケーションにアクセス
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- MySQL: localhost:3306

## 開発コマンド

- `make dev` - 開発環境を起動
- `make stop` - 開発環境を停止
- `make logs` - ログを表示
- `make clean` - Docker環境をクリーンアップ

## 使い方

1. カテゴリーを作成（例：家事、植物、メンテナンス）
2. 繰り返しタスクを作成
3. タスクが期限になったら完了マーク
4. 自動的に次回の期限が設定される

## ライセンス

MIT