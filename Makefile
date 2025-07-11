.PHONY: setup dev stop clean build logs

# 初回セットアップ
setup:
	@echo "Setting up the development environment..."
	docker-compose build
	docker-compose run --rm backend npm install
	docker-compose run --rm frontend npm install
	@echo "Setup complete!"

# 開発環境起動
dev:
	docker-compose up -d
	@echo "Development environment is running!"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:8000"
	@echo "MySQL: localhost:3306"

# 開発環境停止
stop:
	docker-compose stop

# Docker環境のクリーンアップ
clean:
	docker-compose down -v
	docker system prune -f

# ビルド
build:
	docker-compose build

# ログ表示
logs:
	docker-compose logs -f

# バックエンドのログ
logs-backend:
	docker-compose logs -f backend

# フロントエンドのログ
logs-frontend:
	docker-compose logs -f frontend

# データベースのログ
logs-db:
	docker-compose logs -f mysql