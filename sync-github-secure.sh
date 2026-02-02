#!/bin/bash

# Script de sincronização segura com GitHub via token
# O token deve ser passado via variável de ambiente GITHUB_TOKEN

set -e

PROJECT_DIR="/home/ubuntu/faculdade_site_online"
LOG_FILE="/tmp/github-sync-secure.log"

# Verificar se o token foi fornecido
if [ -z "$GITHUB_TOKEN" ]; then
    echo "ERRO: Variável GITHUB_TOKEN não configurada!"
    exit 1
fi

cd "$PROJECT_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Iniciando sincronização segura com GitHub..."

# Configurar git com token
git config --global credential.helper store
echo "https://${GITHUB_TOKEN}@github.com" > ~/.git-credentials
chmod 600 ~/.git-credentials

# Verificar se há alterações
if ! git status --porcelain | grep -q .; then
    log "Nenhuma alteração detectada."
    exit 0
fi

log "Alterações detectadas. Fazendo commit e push..."

# Adicionar todas as alterações
git add -A

# Criar commit
COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
git commit -m "$COMMIT_MSG" || log "Nenhuma alteração para commitar"

# Fazer push
git push origin main && log "✓ Sincronização concluída com sucesso!" || log "✗ Erro ao fazer push"

# Limpar credenciais do arquivo (por segurança)
rm -f ~/.git-credentials
