# 繰り返しTODOアプリ設計書

## 概要
定期的なタスク（植物の水やり、カーテンの洗濯など）を管理するTODOアプリケーション。

## 主要機能
1. **繰り返しタスクの作成・管理**
   - 日次、週次、月次、カスタム間隔での繰り返し設定
   - 次回実行日の自動計算
   
2. **リマインダー機能**
   - タスク実行日の通知
   - 未完了タスクの警告

3. **カテゴリー管理**
   - 家事、植物、メンテナンスなどのカテゴリー分類
   
4. **実行履歴**
   - タスクの完了履歴
   - 統計情報の表示

## データモデル

### タスクテーブル (tasks)
- id: UUID
- title: string
- description: string
- category_id: UUID
- recurrence_pattern: enum (daily, weekly, monthly, custom)
- recurrence_interval: number
- next_due_date: date
- created_at: timestamp
- updated_at: timestamp

### カテゴリーテーブル (categories)
- id: UUID
- name: string
- color: string
- icon: string

### タスク履歴テーブル (task_histories)
- id: UUID
- task_id: UUID
- completed_at: timestamp
- notes: string

## API設計

### エンドポイント
- GET /api/tasks - タスク一覧取得
- POST /api/tasks - タスク作成
- PUT /api/tasks/:id - タスク更新
- DELETE /api/tasks/:id - タスク削除
- POST /api/tasks/:id/complete - タスク完了
- GET /api/tasks/:id/history - タスク履歴取得
- GET /api/categories - カテゴリー一覧取得

## UI/UX設計

### 画面構成
1. **ダッシュボード**
   - 今日のタスク
   - 期限切れタスク
   - 今週のタスク予定

2. **タスク一覧**
   - カテゴリー別フィルター
   - カレンダービュー
   - リストビュー

3. **タスク詳細・編集**
   - 繰り返し設定
   - カテゴリー選択
   - 実行履歴表示

### レスポンシブデザイン
- モバイルファースト設計
- スワイプ操作でのタスク完了
- タッチフレンドリーなUI