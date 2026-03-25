# Alpha Suplementos — v40

## Deploy GitHub Pages
Substitua os arquivos no repositório: ceo/, funcionario/, cliente/, shared/

## Deploy GAS
Abra o Apps Script, cole o conteúdo de Code_atualizado_v40.gs
Faça NEW DEPLOYMENT (não edite o deployment existente)
Atualize WEB_APP_URL nos 3 HTMLs se a URL mudar.

## Alterações v40
- Fix: "Salvo localmente" ao usar cashback
- Fix: Timeout de carregamento de clientes (5s → 20s + retry)
- Fix: Todos os fetch usam text()+JSON.parse() para tratar redirect do GAS
- Fix: Erro com cashback mostra mensagem real em vez de fallback silencioso
- Fix: Parsing robusto do cashback na planilha (coluna K pode ser string/moeda)
- Regra cashback: floor(v/4) em todos os pontos
