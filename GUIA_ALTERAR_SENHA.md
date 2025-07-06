# 🔐 Guia para Alterar Senha do Administrador

## Como Alterar a Senha

### Passo 1: Fazer Login
1. Clique no ícone de usuário (👤) no header
2. Digite suas credenciais atuais
3. Clique em "Entrar"

### Passo 2: Acessar Alterar Senha
1. Após fazer login, você verá novos ícones no header
2. Clique no ícone de cadeado (🔒) para "Alterar Senha"
3. O modal de alteração de senha será aberto

### Passo 3: Preencher o Formulário
1. **Senha Atual**: Digite sua senha atual
2. **Nova Senha**: Digite a nova senha desejada
3. **Confirmar Nova Senha**: Digite a nova senha novamente

### Passo 4: Salvar
1. Clique em "Alterar Senha"
2. Aguarde a confirmação
3. O modal fechará automaticamente após 2 segundos

## Validações de Segurança

O sistema verifica:

✅ **Campos Obrigatórios**: Todos os campos devem ser preenchidos
✅ **Senha Mínima**: Nova senha deve ter pelo menos 6 caracteres
✅ **Confirmação**: As senhas devem coincidir
✅ **Senha Diferente**: Nova senha deve ser diferente da atual
✅ **Senha Atual**: Deve estar correta para permitir alteração

## Funcionalidades do Modal

### 🔍 Visualizar Senhas
- Clique no ícone de olho (👁️) para mostrar/ocultar cada senha
- Útil para verificar se digitou corretamente

### ⚠️ Mensagens de Erro
- **"Preencha todos os campos"**: Campos vazios
- **"A nova senha deve ter pelo menos 6 caracteres"**: Senha muito curta
- **"As senhas não coincidem"**: Confirmação incorreta
- **"A nova senha deve ser diferente da senha atual"**: Senha igual
- **"Senha atual incorreta"**: Senha atual errada

### ✅ Confirmação de Sucesso
- Modal mostra confirmação visual
- Fecha automaticamente após 2 segundos
- Senha é atualizada no banco de dados

## Acesso Mobile

No menu mobile (hambúrguer):
1. Clique no ícone de menu (☰)
2. Procure por "Alterar Senha"
3. Clique para abrir o modal

## Segurança

### 🔒 Criptografia
- Senhas são criptografadas com bcrypt
- Hash é atualizado no banco de dados
- Senha atual é verificada antes da alteração

### 🛡️ Validações
- Verificação de autenticação
- Validação de formato de senha
- Confirmação obrigatória

### 🔄 Sessão
- Alteração não afeta a sessão atual
- Continue logado normalmente
- Nova senha será usada no próximo login

## Solução de Problemas

### Erro: "Senha atual incorreta"
- Verifique se digitou a senha atual corretamente
- Certifique-se de que está logado com a conta certa

### Erro: "As senhas não coincidem"
- Digite a nova senha exatamente igual nos dois campos
- Use o ícone de olho para verificar

### Modal não abre
- Verifique se está logado como administrador
- Recarregue a página se necessário

### Erro de conexão
- Verifique sua conexão com a internet
- Tente novamente em alguns segundos

## Próximos Passos

Após alterar a senha:
1. **Teste o Login**: Faça logout e login com a nova senha
2. **Guarde a Senha**: Anote a nova senha em local seguro
3. **Compartilhe**: Se necessário, compartilhe com outros administradores

## Notas Importantes

⚠️ **Importante**: 
- A senha é alterada apenas para o usuário logado
- Não afeta outros administradores
- A alteração é permanente
- Não há como reverter sem conhecer a nova senha

🔧 **Suporte**: 
- Se esquecer a senha, será necessário reset manual no banco
- Entre em contato com o administrador do sistema 