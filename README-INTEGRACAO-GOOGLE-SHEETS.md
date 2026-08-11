# Integração do RSVP com Google Sheets

O formulário do Arielzinha envia as respostas para o Google Apps Script configurado em `script.js`.

## Planilha

ID configurado:
`1asEXBa225YLaeo4Iy9qBmM08V1J6Vn8EdqLwDxPeWe0`

A aba usada é `Respostas`. O Apps Script cria a aba e o cabeçalho automaticamente caso ela ainda não exista.

## Apps Script

O código está no arquivo `google-apps-script.gs`.

1. Abra a planilha.
2. Vá em **Extensões → Apps Script**.
3. Cole o conteúdo de `google-apps-script.gs`.
4. Salve.
5. Vá em **Implantar → Nova implantação**.
6. Tipo: **Aplicativo da Web**.
7. Executar como: **Eu**.
8. Quem tem acesso: **Qualquer pessoa**.
9. Implante/reimplante e autorize o acesso solicitado.

O endpoint já está configurado no `script.js`.

## Importante ao atualizar o Apps Script

Se você alterar o código depois da primeira implantação, faça uma nova implantação da versão atualizada ou edite a implantação existente para apontar para a nova versão.
