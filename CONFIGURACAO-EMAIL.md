# 📧 Configuração do Sistema de Email

## ✅ O que foi implementado

O sistema de envio de emails foi implementado usando **Resend**, um serviço moderno e confiável de envio de emails transacionais.

### Funcionalidades:
- ✅ Envio de emails para `rodrigo@grupovendaforte.com`
- ✅ Templates HTML responsivos e profissionais
- ✅ Campos do formulário validados
- ✅ Mensagens de sucesso/erro para o usuário
- ✅ Reply-to configurado para responder direto ao cliente
- ✅ Dois formulários funcionando (Contact e CTA)

---

## 🚀 Como Configurar

### 1. Criar conta no Resend (GRÁTIS)

1. Acesse: https://resend.com/
2. Clique em "Sign Up" (cadastro gratuito)
3. Crie sua conta com email
4. Confirme seu email

### 2. Obter API Key

1. Faça login no Resend
2. No dashboard, vá em **"API Keys"**
3. Clique em **"Create API Key"**
4. Dê um nome: `Venda Forte Website`
5. Copie a chave que aparece (ela só é mostrada uma vez!)

### 3. Configurar domínio (IMPORTANTE)

Para enviar emails do domínio `@grupovendaforte.com`:

1. No Resend, vá em **"Domains"**
2. Clique em **"Add Domain"**
3. Digite: `grupovendaforte.com`
4. Copie os registros DNS que aparecem
5. Adicione esses registros no seu provedor de DNS/hospedagem

**Registros DNS necessários:**
```
Tipo: TXT
Nome: resend._domainkey
Valor: [valor fornecido pelo Resend]

Tipo: TXT  
Nome: @
Valor: [valor fornecido pelo Resend]
```

⚠️ **IMPORTANTE**: Sem configurar o domínio, os emails serão enviados de um domínio genérico do Resend.

### 4. Configurar variável de ambiente

1. Renomeie `.env.example` para `.env.local`
2. Cole sua API Key:
```env
RESEND_API_KEY=re_sua_chave_aqui
```

3. **NUNCA** commite o arquivo `.env.local` no Git!

---

## 📝 Estrutura Implementada

### API Route
```
app/api/send-email/route.ts
```
- Recebe dados do formulário via POST
- Valida campos obrigatórios
- Envia email usando Resend
- Retorna sucesso ou erro

### Componentes Atualizados

**components/Contact.tsx**
- Formulário principal com todos os campos
- Envio via API
- Validação de campos obrigatórios
- Feedback visual para o usuário

**components/CTA.tsx**
- Formulário simplificado
- Mesma funcionalidade de envio
- Integrado com API

---

## 📧 Template do Email

O email enviado contém:

- **Assunto**: 🔴 Nova Solicitação - [Nome do Cliente]
- **De**: Venda Forte Website <contato@grupovendaforte.com>
- **Para**: rodrigo@grupovendaforte.com
- **Reply-To**: [email do cliente]

**Campos incluídos:**
- 👤 Nome Completo
- 📧 E-mail (clicável)
- 📱 Telefone (clicável)
- 🏢 Empresa (se preenchido)
- 📍 Cidade (se preenchido)
- 🚜 Tipo de Equipamento (se selecionado)
- 💬 Mensagem

---

## 🔄 Fluxo de Funcionamento

1. **Cliente preenche** o formulário no site
2. **Frontend envia** dados para `/api/send-email`
3. **API valida** os dados recebidos
4. **Resend envia** o email formatado
5. **Rodrigo recebe** o email em rodrigo@grupovendaforte.com
6. **Rodrigo responde** diretamente (reply vai para o email do cliente)

---

## 🧪 Como Testar

### Teste Local (Desenvolvimento)

1. Configure `.env.local` com sua API Key
2. Execute: `npm run dev`
3. Acesse: http://localhost:3000
4. Preencha o formulário de contato
5. Clique em "Enviar Solicitação"
6. Verifique o email em rodrigo@grupovendaforte.com

### Teste em Produção

1. Configure as variáveis de ambiente no Vercel:
   - Vá em "Settings" > "Environment Variables"
   - Adicione: `RESEND_API_KEY` com o valor da chave

2. Faça o deploy
3. Teste o formulário no site em produção

---

## 💰 Plano Gratuito do Resend

- ✅ **3.000 emails/mês** gratuitos
- ✅ Perfeito para começar
- ✅ Upgrade fácil se precisar de mais

**Para o site Venda Forte**, 3.000 emails/mês é mais do que suficiente (equivale a ~100 contatos por dia).

---

## 🔐 Segurança

- ✅ API Key nunca exposta no frontend
- ✅ Validação de campos no backend
- ✅ Rate limiting do Resend
- ✅ Proteção contra spam

---

## 🐛 Solução de Problemas

### Email não chega

1. **Verifique a API Key** no `.env.local`
2. **Verifique o console** do navegador (F12)
3. **Verifique os logs** do Resend dashboard
4. **Verifique spam** na caixa de entrada

### Erro 401 (Unauthorized)

- API Key inválida ou expirada
- Reconfigurar a chave no `.env.local`

### Erro 403 (Forbidden)

- Domínio não verificado no Resend
- Configure os registros DNS

### Erro 500

- Problema no servidor
- Verificar logs no console do servidor

---

## 📊 Monitoramento

Você pode monitorar todos os emails enviados no dashboard do Resend:

1. Acesse: https://resend.com/emails
2. Veja:
   - Emails enviados
   - Status de entrega
   - Bounces
   - Aberturas (se configurado)

---

## 🎨 Personalizar Template

Para personalizar o template do email, edite:
```
app/api/send-email/route.ts
```

Na seção `html:` do método `resend.emails.send()`

---

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório GitHub ao Vercel
2. Configure a variável de ambiente:
   ```
   RESEND_API_KEY=re_sua_chave
   ```
3. Deploy automático!

### Outras Plataformas

Configure a variável `RESEND_API_KEY` nas configurações de ambiente da sua plataforma.

---

## ✅ Checklist de Configuração

- [ ] Criar conta no Resend
- [ ] Obter API Key
- [ ] Configurar domínio no Resend
- [ ] Adicionar registros DNS
- [ ] Criar arquivo `.env.local`
- [ ] Adicionar API Key no `.env.local`
- [ ] Testar formulário localmente
- [ ] Configurar variável no Vercel
- [ ] Fazer deploy
- [ ] Testar em produção

---

## 📞 Suporte

**Documentação Resend**: https://resend.com/docs
**API Reference**: https://resend.com/docs/api-reference

---

**Sistema configurado e pronto para uso!** 🎉

Após configurar a API Key e o domínio, o sistema funcionará perfeitamente e todos os contatos do site chegarão diretamente no email rodrigo@grupovendaforte.com.
