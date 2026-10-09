# Editor de Páginas — protótipo de apresentação

Protótipo interativo de uma nova função: um editor visual de páginas (no estilo do Puck) em que o dev também pode abrir o **HTML e o CSS** de cada seção, ajustar e **salvar como uma nova versão** do componente, que fica disponível para o resto do time.

Nada é salvo de verdade: todo o estado fica em memória e volta ao início ao recarregar a página (ou em `⋯ › Reiniciar demonstração`).

## Rodar

```bash
npm install
npm run dev
```

Abra no computador (a partir de 1100px de largura).

## Roteiro sugerido para a apresentação

1. **Biblioteca (esquerda):** 13 tipos de bloco (cabeçalho, banner, convênios, quem somos, especialidades, números, equipe, depoimentos, blog, FAQ, CTA, contato, rodapé) e 23 versões, entre oficiais e do time. Arraste uma versão para a página ou clique nela para adicionar.
2. **Canvas (centro):** a home completa de uma clínica fictícia. Clique numa seção para selecionar; a barra da seção permite reordenar, duplicar e remover. Alterne entre Desktop, Tablet e Celular no topo.
3. **Inspetor (direita):** edita o conteúdo da seção (textos, listas, imagens), que no sistema real vem do banco, e o layout. Também permite trocar a versão do componente mantendo o conteúdo. Sem seleção, mostra o tema da página (cor, fonte, arredondamento).
4. **Engrenagem ⚙️ (o diferencial):** abre o HTML (template Mustache com as variáveis do banco) e o CSS da seção, com pré-visualização ao vivo. O texto não é editado no código: o código só referencia as variáveis.
5. **Salvar como nova versão:** pede um nome único e publica a versão na biblioteca, com autoria "Você" e o selo "Nova". Use o filtro **Minhas** para ver as suas versões.

Atalhos: `Ctrl+Z` / `Ctrl+Shift+Z` (desfazer/refazer), `Delete` (remove a seção selecionada), `Esc` (tira a seleção ou sai da visualização).

## Stack

Vite + React + TypeScript, Tailwind v4, shadcn/ui (Radix), dnd-kit, CodeMirror e Mustache. Cada seção é renderizada em um Shadow DOM, então o CSS do componente não vaza para o editor, e o responsivo usa container queries (é isso que faz a troca de dispositivo funcionar).

```
src/editor/
  library/        tipos de bloco (campos + conteúdo padrão) e versões (HTML + CSS)
  components/     canvas, biblioteca, inspetor, diálogo de código, topbar
  store.ts        estado (zustand) + histórico de desfazer
  template.ts     render Mustache, tema global e variáveis disponíveis
```

Para adicionar um componente novo à biblioteca, crie um arquivo em `src/editor/library/` seguindo os existentes e registre-o em `library/index.ts`.
