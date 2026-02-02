#!/bin/bash

# Script de monitoramento e sincronização automática com GitHub
# Monitora alterações no projeto e faz push automático

PROJECT_DIR="/home/ubuntu/faculdade_site_online"
LOG_FILE="/tmp/watch-sync.log"
SYNC_SCRIPT="$PROJECT_DIR/sync-github.sh"

cd "$PROJECT_DIR"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "Iniciando monitoramento de alterações..."
log "Diretório: $PROJECT_DIR"

# Função para sincronizar
sync_to_github() {
    log "Detectada alteração. Sincronizando com GitHub..."
    bash "$SYNC_SCRIPT" 2>&1 | tee -a "$LOG_FILE"
}

# Usar inotifywait para monitorar alterações
if command -v inotifywait &> /dev/null; then
    log "inotifywait disponível. Monitorando alterações..."
    inotifywait -m -r -e modify,create,delete \
        --exclude '(\.git|node_modules|dist|\.manus)' \
        "$PROJECT_DIR" | while read -r directory events filename; do
        if [[ ! "$filename" =~ ^\.git ]]; then
            log "Alteração detectada: $directory$filename ($events)"
            sync_to_github
        fi
    done
else
    log "inotifywait não disponível. Usando polling a cada 60 segundos..."
    while true; do
        sleep 60
        if git status --porcelain | grep -q .; then
            sync_to_github
        fi
    done
fi
