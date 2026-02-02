# 🚀 Informações de Deploy - Faculdade LA

## Status do Servidor

✅ **Servidor em Produção**: Ativo e funcionando
- **Porta Local**: 3001
- **URL Pública**: https://3001-i3igs9hf8141iy3vth04p-017b5870.us2.manus.computer
- **Repositório GitHub**: https://github.com/brunoburno554252-max/faculdade-site

## Comandos Disponíveis

### Desenvolvimento
```bash
pnpm dev          # Inicia servidor em desenvolvimento
pnpm build        # Compila para produção
pnpm start        # Inicia servidor em produção
pnpm check        # Verifica tipos TypeScript
pnpm test         # Executa testes
```

### Banco de Dados
```bash
pnpm db:push      # Sincroniza schema com banco de dados
```

## Sincronização com GitHub

### Automática
O script de monitoramento está rodando em background:
```bash
# Monitora alterações e faz push automático
bash watch-and-sync.sh
```

### Manual
```bash
# Sincronizar manualmente
bash sync-github.sh
```

## Estrutura do Projeto

```
faculdade_site_online/
├── client/              # Frontend React
├── server/              # Backend Express + tRPC
├── drizzle/            # Schema e migrations do banco
├── dist/               # Build de produção
├── sync-github.sh      # Script de sincronização
└── watch-and-sync.sh   # Monitoramento automático
```

## Variáveis de Ambiente

O servidor usa as seguintes variáveis (injetadas automaticamente):
- `DATABASE_URL`: Conexão MySQL
- `JWT_SECRET`: Chave de sessão
- `VITE_APP_ID`: ID da aplicação OAuth
- `OAUTH_SERVER_URL`: URL do servidor OAuth
- `PORT`: Porta do servidor (padrão: 3000)

## Próximos Passos

1. ✅ Servidor online e funcionando
2. ✅ Sincronização automática com GitHub configurada
3. ⏳ Integração da imagem do organograma (próxima etapa)
4. ⏳ Testes completos de funcionalidade

## Contato

Para dúvidas ou problemas, consulte o repositório:
https://github.com/brunoburno554252-max/faculdade-site
