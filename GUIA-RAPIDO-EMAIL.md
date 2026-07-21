# 📧 Guia Rápido - Ativar Envio de Emails

## ⚡ Passos Rápidos (5 minutos)

### 1. Criar Conta no Resend
👉 https://resend.com/signup
- Cadastre-se gratuitamente
- Confirme seu email

### 2. Pegar API Key
1. Login no Resend
2. Menu lateral: **"API Keys"**
3. Botão: **"Create API Key"**
4. Nome: `Venda Forte`
5. **COPIE A CHAVE** (não será mostrada novamente!)

### 3. Configurar no Projeto
Crie o arquivo `.env.local` na raiz do projeto:
```env
RESEND_API_KEY=re_sua_chave_aqui_colada
```

### 4. Testar Localmente
```bash
npm run dev
```
Acesse http://localhost:3000 e teste o formulário!

### 5. Deploy no Vercel
1. Vá em: https://vercel.com/seu-projeto/settings/environment-variables
2. Adicione:
   - **Nome**: `RESEND_API_KEY`
   - **Valor**: Sua chave do Resend
3. **Redeploy** o projeto

---

## ✅ Pronto!

Agora os emails vão para: **rodrigo@grupovendaforte.com**

---

## 🎯 Configuração Avançada (Opcional)

### Usar domínio próprio (@grupovendaforte.com)

1. No Resend: **"Domains"** > **"Add Domain"**
2. Digite: `grupovendaforte.com`
3. Copie os registros DNS
4. Adicione no seu provedor de DNS/hospedagem:

```
Tipo: TXT
Nome: resend._domainkey
Valor: [fornecido pelo Resend]

Tipo: TXT
Nome: @
Valor: [fornecido pelo Resend]
```

5. Aguarde propagação (até 24h)
6. Verifique no Resend dashboard

---

## 📊 Monitorar Emails

Dashboard: https://resend.com/emails
- Veja todos os emails enviados
- Status de entrega
- Erros

---

## 🆘 Problemas?

**Email não chega?**
- Verifique spam
- Confirme API Key no `.env.local`
- Veja logs no dashboard do Resend

**Erro 500?**
- API Key não configurada
- Adicione no `.env.local`

---

## 📝 Documentação Completa

Veja: `CONFIGURACAO-EMAIL.md`

---

**Tudo pronto em 5 minutos!** ⚡
