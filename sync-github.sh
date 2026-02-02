#!/bin/bash

# Script de sincronização automática com GitHub
# Este script faz push de todas as alterações para o repositório remoto

set -e

PROJECT_DIR="/home/ubuntu/faculdade_site_online"
LOG_FILE="/tmp/github-sync.log"

cd "$PROJECT_DIR"

# Função para registrar logs
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

log "Iniciando sincronização com GitHub..."

# Verificar se há alterações
if git status --porcelain | grep -q .; then
    log "Alterações detectadas. Fazendo commit e push..."
    
    # Adicionar todas as alterações
    git add -A
    
    # Criar commit com timestamp
    COMMIT_MSG="Auto-sync: $(date '+%Y-%m-%d %H:%M:%S')"
    git commit -m "$COMMIT_MSG" || log "Nenhuma alteração para commitar"
    
    # Fazer push para o repositório remoto
    git push origin main || git push origin master || log "Erro ao fazer push"
    
    log "Sincronização concluída com sucesso!"
else
    log "Nenhuma alteração detectada."
fi

log "Processo finalizado."
