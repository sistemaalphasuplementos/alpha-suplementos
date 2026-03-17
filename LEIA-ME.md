# Alpha Suplementos — Sistema de Fidelidade
## Guia de Acesso — 3 Perfis Separados

---

## 📁 Estrutura de arquivos

```
alpha_sistema/
├── shared/
│   └── logo.png          ← Logo usada em todos os perfis
├── ceo/
│   └── index.html        ← Painel do CEO
├── funcionario/
│   └── index.html        ← Painel do Funcionário
└── cliente/
    └── index.html        ← App do Cliente (PWA)
```

---

## 🔗 URLs de acesso (após publicar no Netlify)

| Perfil | URL | Senha demo |
|---|---|---|
| 👑 CEO | seusite.netlify.app/ceo/ | alpha2025 |
| 🧑‍💼 Funcionário | seusite.netlify.app/funcionario/ | func2025 |
| 👤 Cliente | seusite.netlify.app/cliente/ | (email + demo) |

---

## 👑 CEO — O que pode fazer

- Ver dashboard completo (vendas, pontos, cashback, níveis)
- Ver ranking de todos os clientes
- Ver todos os alertas CRM (somente leitura)
- Ver histórico de compras e financeiro
- Lançar promoções relâmpago (Push + WhatsApp)
- Ver histórico de indicações
- **NÃO pode registrar vendas** (responsabilidade do funcionário)

---

## 🧑‍💼 Funcionário — O que pode fazer

- **Registrar vendas** → o sistema calcula e distribui pontos e cashback automaticamente
- Ver e agir sobre alertas CRM de reposição
- Enviar WhatsApp personalizado para clientes (reposição, aniversário, nível, promoção, personalizada)
- Confirmar indicações de novos clientes
- Confirmar entrega de prêmios pelo código de retirada
- Consultar clientes e histórico

---

## 👤 Cliente — O que pode fazer (somente leitura)

- Ver pontos e cashback acumulados
- Ver cartão de fidelidade com nível
- Ver progresso para o próximo nível
- Ver ranking geral
- Ver loja de prêmios disponíveis
- Ver e compartilhar link de indicação
- Ver histórico de compras e resgates
- Ver benefícios do nível atual
- **NÃO pode editar nada** — compras e resgates são feitos pelo funcionário

---

## 🚀 Como publicar no Netlify (gratuito)

1. Acesse **netlify.com** → Login com Google
2. Na tela inicial, arraste a pasta **`alpha_sistema`** para a área de deploy
3. Aguarde ~30 segundos → seu site estará no ar!
4. Compartilhe os links com a equipe e clientes

---

## 🔑 Para integrar com o backend real (Google Apps Script)

No arquivo `cliente/index.html`, `funcionario/index.html` e `ceo/index.html`,
localize a variável `WEB_APP_URL` e substitua pela URL gerada no Apps Script:

```javascript
const WEB_APP_URL = 'https://script.google.com/macros/s/SUA_URL.../exec';
```

---

*Alpha Suplementos — Performance é o nosso negócio 🔥*
