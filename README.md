# AutiSpark — GitHub e Vercel com checkout Hotmart

Landing page completa, com imagens, fonte local, animações, prévias e botão fixo. Os quatro botões de compra já usam este checkout:

https://pay.hotmart.com/D108165131A?checkoutMode=10

## Publicar no GitHub

1. Extraia o ZIP.
2. Crie ou abra seu repositório no GitHub.
3. Envie o conteúdo extraído: arquivos na raiz e a pasta `assets`.
4. Confirme em Commit changes.

`index.html` e `vercel.json` devem estar na raiz do repositório, ao lado de `assets`. Envie o conteúdo do ZIP; enviar apenas o arquivo ZIP não publica o site.

## Publicar na Vercel

1. Use Add New → Project e importe o repositório.
2. Framework Preset: Other.
3. Root Directory: raiz do repositório (`./`).
4. Build Command: vazio; habilite Override se necessário.
5. Output Directory: `.`
6. Clique em Deploy.

O `vercel.json` já configura a saída estática na raiz, sem build. O projeto não exige instalação de dependências, banco de dados ou chaves de API.

## Checkout e preço

O link está centralizado em `config.js` e também nos quatro links de compra do `index.html`, para funcionar sem JavaScript. Se trocar o checkout futuramente, atualize esses locais, preservando os parâmetros do endereço.

O preço exibido continua em US$ 15, conforme a oferta definida nesta conversa. A Hotmart controla o preço efetivamente cobrado, impostos, formas de pagamento, entrega e reembolso. Confira a oferta na Hotmart antes de divulgar. Não foi incluída promessa de entrega instantânea nem prazo de reembolso não informado.

Os controles de amostra continuam abrindo páginas do guia; os botões de compra abrem o checkout. Os avisos de em breve ficam ocultos com o link configurado. Se a URL em `config.js` for removida ou inválida, o JavaScript retorna os botões ao modo de prévia.

## Arquivos

- `index.html`: conteúdo e links estáticos.
- `styles.css`: identidade visual, responsividade e animações.
- `app.js`: interações e configuração dos botões.
- `config.js`: checkout e preço.
- `assets/`: logo, imagens e fonte local.
- `vercel.json`: configuração para a Vercel.
- `FONT-LICENSE.txt`: licença da fonte Manrope.

O PDF completo vendido não está no diretório público. Apenas três amostras ficam disponíveis na landing page.

## Endereço definitivo

Depois da publicação, configure `og:image` em `index.html` com a URL absoluta da capa no seu domínio, terminando em `/assets/cover.webp`. Uma canonical com o endereço definitivo também pode ser adicionada. A exportação não aponta para a canonical do endereço anterior.

## Prévia local opcional

Com Python instalado, execute nesta pasta:

```sh
python3 -m http.server 8000
```

Abra http://localhost:8000 no navegador.
