# are-yatta プロジェクト開発ガイド

## プロジェクト概要

are-yattaは個人開発プロジェクトで、モノレポ構成で管理されます：

```
are-yatta/
├── CLAUDE.md
├── docker-compose.yml
├── Makefile
├── .gitignore
├── README.md
├── backend/           # バックエンドAPI
├── frontend/          # フロントエンドアプリケーション
├── infrastructure/    # インフラ設定
└── docs/             # 開発者向けドキュメント
```

## 開発環境構成

### 個人開発特化
- 開発者：1名
- モノレポで全体を統合管理
- 簡潔で効率的な開発フロー

### 技術スタック
- **Backend**: Node.js, Express.js, TypeScript（ポート: 8000）
- **Frontend**: React 18, TypeScript, Tailwind CSS（ポート: 3000）
- **Database**: MySQL（ポート: 3306）
- **Infrastructure**: Docker Compose, Vercel (Frontend), Railway/Render (Backend)
- **Documentation**: Markdown

## 環境構築手順

### 初回セットアップ

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/username/are-yatta.git
   cd are-yatta
   ```

2. **開発環境のセットアップ**
   ```bash
   make setup
   ```

3. **開発環境の起動**
   ```bash
   make dev
   ```

## Docker Compose構成

### サービス一覧
- **frontend**: フロントエンド開発サーバー（localhost:3000）
- **backend**: バックエンドAPIサーバー（localhost:8000）
- **mysql**: データベース（localhost:3306）

### 主要コマンド
- `make setup`: 初回環境構築
- `make dev`: 開発環境起動
- `make stop`: 開発環境停止
- `make clean`: Docker環境のクリーンアップ

## 開発方針・コーディング規約

### Node.js/Express (Backend)
- Node.js + Express.js + TypeScript の構成
- ORMライブラリ（Prisma推奨）でのDB操作
- RESTful API設計を基本とする
- 環境変数での設定管理

### React/TypeScript (Frontend)
- React 18 の機能（Concurrent Features等）を活用する
- TypeScript の型安全性を重視する
- Tailwind CSS でのユーティリティファーストアプローチ
- 関数コンポーネント + Hooks を基本とする
- **レスポンシブデザイン**: PC・スマートフォン両対応を必須とする
- **モバイルファースト**: スマートフォン画面から設計を開始する
- **Tailwind ブレークポイント**: sm（640px）, md（768px）, lg（1024px）を活用する

### Infrastructure（最安値構成）
- **Frontend**: Vercel（無料枠）
- **Backend**: Railway または Render（無料〜低価格）
- **Database**: PlanetScale（無料枠）または Railway MySQL
- **ローカル開発**: Docker Compose

### 個人開発向けコード品質
- **シンプル重視**: 過度な抽象化を避ける
- **可読性**: 将来の自分が理解できるコード
- **必要最小限**: 機能追加は段階的に行う
- **ドキュメント**: 設計判断の理由を記録する
- **レスポンシブ**: 全ページでPC・スマートフォン対応を確認する

### コミット規約
- Conventional Commits形式を使用する
- `feat:`, `fix:`, `docs:`, `refactor:`, `test:` などのプレフィックスを付ける

### ブランチ運用（個人開発簡易版）
- **main**: 本番環境用の安定版（直接コミット禁止）
- **develop**: 開発統合ブランチ（直接作業は避ける）
- **feature/xxx**: 機能開発用ブランチ（必ず作成する）

**重要**: 作業時は必ずfeatureブランチを作成し、mainブランチ以外なら自由にコミット・プッシュして良い

ブランチ作成手順：
```bash
git checkout develop
git pull origin develop
git checkout -b feature/機能名
# この後は自由にコミット・プッシュ可能
```

### ライブラリ管理・インストール規約

**重要**: ライブラリのインストールはDocker Compose環境下でのみ行う

#### Backend
```bash
# Docker Compose環境内でのライブラリ追加
docker-compose exec backend npm install package-name
docker-compose exec backend npm install --save-dev package-name  # devDependencies
```

#### Frontend
```bash
# Docker Compose環境内でのライブラリ追加
docker-compose exec frontend npm install package-name
docker-compose exec frontend npm install --save-dev package-name  # devDependencies
```

- ローカル環境への直接インストールは禁止
- 依存関係ファイル（package.json）を必ず更新する
- コンテナ再ビルドが必要な場合は `docker-compose build` を実行する

### 実装時の注意
- 実装前に設計・計画を確認する
- 複雑な変更時は段階的にアプローチする
- テスト追加は機能の重要度に応じて判断する
- **mainブランチ以外では自由にコミット・プッシュして良い**

## 開発フロー

### 個人開発向けワークフロー

1. **計画フェーズ**
   - 機能設計・仕様を確認する
   - docs/ で設計メモを確認する

2. **実装フェーズ**
   - developブランチから **必ずfeature/xxx ブランチを作成する**
   - 必要に応じてテスト作成
   - 機能実装

3. **動作確認**
   - `make dev`で全サービスを起動して動作確認する
   - **レスポンシブ確認**: PC・スマートフォン両方のレイアウトをテストする

4. **コミット・プッシュ**
   - Conventional Commits形式でコミットする
   - 適切な粒度でコミットを分割する
   - **featureブランチなら自由にプッシュして良い**

5. **完了後**
   - developブランチへのマージを検討する

### ディレクトリ間の連携

- **API仕様**: `docs/`で管理する
- **インフラ設定**: `infrastructure/`で管理する  
- **設計メモ**: `docs/`に記録し、参照する
- **共通型定義**: 必要に応じて共通化する

## Claude Code固有の設定

### 作業時の基本方針
- ファイルの読み込み・理解を先に行い、コード実装は後にする
- 既存のコードスタイルを理解し、一貫性を保つ
- 個人開発なので、シンプルで分かりやすい実装を優先する
- **UI実装時は必ずPC・スマートフォン両方での表示を考慮する**
- **Tailwindのレスポンシブクラス（sm:, md:, lg:）を適切に使用する**
- **mainブランチ以外では自由にコミット・プッシュして構わない**
- **作業時は必ずfeatureブランチを作成する**

### モノレポでの作業
- backend/ と frontend/ の連携を意識する
- API変更時は両側の整合性を確認する
- docs/ の設計メモを参照して実装方針を決める

### 品質管理
- 個人開発レベルの適切な品質を保つ
- 過度な抽象化や複雑な設計は避ける
- 将来の保守性を考慮したコード作成

## トラブルシューティング

### よくある問題と解決策

**Q: make setupが失敗する**
A: Docker Desktopが起動していることを確認してください

**Q: Docker Composeが起動しない**  
A: `make clean`でクリーンアップ後、再度`make setup`を実行

**Q: ポートが使用中エラー**
A: 既存のプロセスを確認し、必要に応じて停止してください

## 注意事項

- モノレポ構成で全体を一つのGitリポジトリで管理
- ローカル開発環境はDocker Composeで統合環境として動作
- 本番環境は各サービスを最安値構成でデプロイ（Vercel + Railway/Render）
- 個人開発なので、必要最小限の機能から始めて段階的に拡張する