# 🔧 Soluções de Problemas Comuns

## CSS não está carregando / Sem estilos

### Problema
As classes do Tailwind CSS não estão sendo aplicadas e o site aparece sem estilos.

### Solução

1. **Verifique se o `tailwind.config.ts` existe:**
   ```bash
   ls tailwind.config.ts
   ```

2. **Se não existir, crie o arquivo:**
   ```typescript
   // tailwind.config.ts
   import type { Config } from "tailwindcss";

   const config: Config = {
     content: [
       "./pages/**/*.{js,ts,jsx,tsx,mdx}",
       "./components/**/*.{js,ts,jsx,tsx,mdx}",
       "./app/**/*.{js,ts,jsx,tsx,mdx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   };

   export default config;
   ```

3. **Limpe o cache e reconstrua:**
   ```bash
   # Windows PowerShell
   Remove-Item -Recurse -Force .next
   npm run dev

   # Ou Linux/Mac
   rm -rf .next
   npm run dev
   ```

4. **Verifique se `globals.css` tem as diretivas do Tailwind:**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

5. **Verifique se `globals.css` está importado no layout:**
   ```typescript
   // app/layout.tsx
   import "./globals.css";
   ```

---

## Servidor não inicia

### Problema
`npm run dev` não funciona ou trava.

### Solução

1. **Mate processos Node em execução:**
   ```powershell
   # Windows
   Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

   # Linux/Mac
   killall node
   ```

2. **Reinstale dependências:**
   ```bash
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

3. **Verifique a porta 3000:**
   ```bash
   # Se a porta 3000 estiver em uso, mude para outra
   npm run dev -- -p 3001
   ```

---

## Erro de build

### Problema
`npm run build` falha com erros.

### Solução

1. **Veja os erros específicos:**
   ```bash
   npm run build
   ```

2. **Erros comuns:**

   **Imports incorretos:**
   ```typescript
   // ❌ Errado
   import { Facebook } from 'lucide-react'  // Não existe

   // ✅ Correto
   import { Share2 } from 'lucide-react'
   ```

   **Componentes de servidor vs cliente:**
   ```typescript
   // Se usar hooks ou eventos, adicione no topo:
   'use client'
   ```

3. **Limpe e reconstrua:**
   ```bash
   Remove-Item -Recurse -Force .next
   npm run build
   ```

---

## Imagens não aparecem

### Problema
Imagens não são exibidas no site.

### Solução

1. **Use o componente Image do Next.js:**
   ```typescript
   import Image from 'next/image'

   <Image 
     src="/logo.png" 
     alt="Logo" 
     width={150} 
     height={50}
   />
   ```

2. **Coloque imagens na pasta `public/`:**
   ```
   public/
   ├── logo.png
   ├── hero-bg.jpg
   └── favicon.ico
   ```

3. **Configure domínios externos (se usar URLs externas):**
   ```typescript
   // next.config.ts
   const nextConfig = {
     images: {
       domains: ['example.com'],
     },
   };
   ```

---

## Animações não funcionam

### Problema
Animações do Framer Motion não aparecem.

### Solução

1. **Verifique se está instalado:**
   ```bash
   npm install framer-motion
   ```

2. **Use 'use client' no componente:**
   ```typescript
   'use client'
   import { motion } from 'framer-motion'
   ```

3. **Verifique sintaxe:**
   ```typescript
   <motion.div
     initial={{ opacity: 0 }}
     animate={{ opacity: 1 }}
     transition={{ duration: 0.5 }}
   >
   ```

---

## Formulários não enviam

### Problema
Ao submeter formulário, nada acontece.

### Solução

Os formulários ainda não têm backend integrado. Para fazê-los funcionar:

1. **Adicione handler:**
   ```typescript
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault()
     // Adicione sua lógica aqui
     console.log('Formulário enviado')
   }
   ```

2. **Integre com backend:**
   - API Routes do Next.js
   - Serviço de e-mail (SendGrid, AWS SES)
   - CRM (HubSpot, RD Station)

---

## Erro de TypeScript

### Problema
Erros de tipos TypeScript durante build.

### Solução

1. **Instale tipos ausentes:**
   ```bash
   npm install -D @types/react @types/node
   ```

2. **Ignore temporariamente:**
   ```typescript
   // @ts-ignore
   ```

3. **Configure tsconfig.json:**
   ```json
   {
     "compilerOptions": {
       "strict": false
     }
   }
   ```

---

## Performance lenta

### Problema
Site carrega lentamente.

### Solução

1. **Otimize imagens:**
   - Use next/image
   - Comprima imagens (TinyPNG, Squoosh)
   - Use WebP

2. **Lazy load componentes:**
   ```typescript
   import dynamic from 'next/dynamic'
   
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Carregando...</p>
   })
   ```

3. **Analise bundle:**
   ```bash
   npm install @next/bundle-analyzer
   ANALYZE=true npm run build
   ```

---

## Erro de hydration

### Problema
"Hydration failed" ou "Text content does not match" no console.

### Solução

1. **Não use `window` ou `document` sem checagem:**
   ```typescript
   // ❌ Errado
   const width = window.innerWidth

   // ✅ Correto
   const [width, setWidth] = useState(0)
   useEffect(() => {
     setWidth(window.innerWidth)
   }, [])
   ```

2. **Use `suppressHydrationWarning`:**
   ```typescript
   <div suppressHydrationWarning>
     {new Date().toLocaleDateString()}
   </div>
   ```

---

## Favicon não aparece

### Problema
Ícone da aba do navegador não muda.

### Solução

1. **Coloque favicon na pasta `app/`:**
   ```
   app/
   ├── favicon.ico
   ├── icon.png
   └── apple-icon.png
   ```

2. **Ou na pasta `public/`:**
   ```
   public/
   └── favicon.ico
   ```

3. **Limpe cache do navegador:**
   - Ctrl + Shift + R (Windows)
   - Cmd + Shift + R (Mac)

---

## Git não funciona

### Problema
Comandos git falham.

### Solução

1. **Inicialize repositório:**
   ```bash
   git init
   ```

2. **Configure usuário:**
   ```bash
   git config user.name "Seu Nome"
   git config user.email "seu@email.com"
   ```

3. **Primeiro commit:**
   ```bash
   git add .
   git commit -m "Initial commit"
   ```

---

## Deploy falha

### Problema
Deploy na Vercel/Netlify não funciona.

### Solução

1. **Verifique build local:**
   ```bash
   npm run build
   ```

2. **Configure variáveis de ambiente:**
   - Na plataforma de deploy
   - Use `NEXT_PUBLIC_` para variáveis do cliente

3. **Verifique Node version:**
   ```bash
   node -v  # Deve ser 18.x ou superior
   ```

4. **Configure no package.json:**
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

---

## Comandos Úteis de Diagnóstico

```bash
# Verificar versões
node -v
npm -v
npx next -v

# Limpar tudo e recomeçar
Remove-Item -Recurse -Force .next, node_modules
Remove-Item package-lock.json
npm install
npm run dev

# Ver portas em uso
netstat -ano | findstr :3000

# Logs detalhados
npm run dev -- --experimental-debug

# Verificar erros de TypeScript
npx tsc --noEmit
```

---

## Ainda com problemas?

Se nenhuma solução funcionou:

1. **Crie uma issue no GitHub** (se aplicável)
2. **Entre em contato:**
   - 📧 contato@grupovendaforte.com
   - 📱 +55 (11) 3456-7890

3. **Compartilhe:**
   - Mensagem de erro completa
   - Versão do Node: `node -v`
   - Sistema operacional
   - O que você estava tentando fazer

---

**Última atualização:** 29/06/2026
