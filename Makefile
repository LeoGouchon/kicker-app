SHELL := bash
.DEFAULT_GOAL := help

# Chemin du checkout principal (premier worktree listé par git)
MAIN_WORKTREE := $(shell git worktree list --porcelain | head -n1 | cut -d' ' -f2-)

.PHONY: help install clean dev

help: ## Affiche les cibles disponibles
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

install: ## Prépare le worktree : .env + dépendances (script de création Orca)
	@if [ -f .env ]; then \
		echo ".env deja present, conserve"; \
	elif [ -f "$(MAIN_WORKTREE)/.env" ] && [ "$(MAIN_WORKTREE)" != "$(CURDIR)" ]; then \
		cp "$(MAIN_WORKTREE)/.env" .env && echo ".env copie depuis $(MAIN_WORKTREE)"; \
	else \
		cp .env.example .env && echo ".env cree depuis .env.example"; \
	fi
	npm ci

clean: ## Nettoie le worktree : node_modules, dist, .env (script de clôture Orca)
	rm -rf node_modules dist
	@if [ "$$(git rev-parse --git-dir)" = "$$(git rev-parse --git-common-dir)" ]; then \
		echo "Checkout principal : .env conserve"; \
	else \
		rm -f .env && echo ".env supprime"; \
	fi

dev: ## Lance le serveur de dev sur 5173 (échoue si le port est pris, requis par l'OIDC)
	npm run dev -- --port 5173 --strictPort
