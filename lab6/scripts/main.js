// ------------------------------------------------------
// 1️⃣ Inicializar o localStorage (chave produtos-selecionados)
// ------------------------------------------------------
if (!localStorage.getItem("produtos-selecionados")) {
  localStorage.setItem("produtos-selecionados", JSON.stringify([]));
}

// ------------------------------------------------------
// 2️⃣ Funções utilitárias para o localStorage
// ------------------------------------------------------
function getCesto() {
  return JSON.parse(localStorage.getItem("produtos-selecionados")) || [];
}

function setCesto(lista) {
  localStorage.setItem("produtos-selecionados", JSON.stringify(lista));
}

// ------------------------------------------------------
// 3️⃣ Quando o DOM estiver carregado
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  carregarProdutos(produtos);
  atualizaCesto();
});

// ------------------------------------------------------
// 4️⃣ Carregar produtos e mostrá-los no DOM
// ------------------------------------------------------
function carregarProdutos(produtos) {
  const secao = document.querySelector("#produtos");
  secao.innerHTML = "";

  produtos.forEach((produto) => {
    const artigo = criarProduto(produto);
    secao.append(artigo);
  });
}

// ------------------------------------------------------
// 5️⃣ Criar um <article> para cada produto (catálogo)
// ------------------------------------------------------
function criarProduto(produto) {
  const article = document.createElement("article");

  const titulo = document.createElement("h2");
  titulo.textContent = produto.title;

  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = produto.image;
  img.alt = produto.title;
  figure.append(img);

  const descricao = document.createElement("p");
  descricao.textContent = produto.description;

  const preco = document.createElement("p");
  const valor = document.createElement("strong");
  valor.textContent = `€${Number(produto.price).toFixed(2)}`;
  preco.append("Preço: ", valor);

  const botao = document.createElement("button");
  botao.textContent = "+ Adicionar ao cesto";
  botao.addEventListener("click", () => adicionarAoCesto(produto));

  article.append(titulo, figure, descricao, preco, botao);

  return article;
}

// ------------------------------------------------------
// 6️⃣ Adicionar um produto ao cesto (localStorage + DOM)
// ------------------------------------------------------
function adicionarAoCesto(produto) {
  const lista = getCesto();
  lista.push(produto);
  setCesto(lista);
  atualizaCesto();
}

// ------------------------------------------------------
// 7️⃣ Atualizar o cesto no DOM
// ------------------------------------------------------
function atualizaCesto() {
  const secaoCesto = document.querySelector("#cesto");
  secaoCesto.innerHTML = "";

  const lista = getCesto();

  if (lista.length === 0) {
    secaoCesto.textContent = "O cesto está vazio.";
    return;
  }

  // cria um artigo por produto
  lista.forEach((produto) => {
    const artigo = criaProdutoCesto(produto);
    secaoCesto.append(artigo);
  });

  // calcula o total
  const total = lista.reduce((soma, p) => soma + Number(p.price || 0), 0);
  const hr = document.createElement("hr");
  const pTotal = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = `Total: €${total.toFixed(2)}`;
  pTotal.append(strong);

  secaoCesto.append(hr, pTotal);
}

// ------------------------------------------------------
// 8️⃣ Criar <article> para cada produto dentro do cesto
// ------------------------------------------------------
function criaProdutoCesto(produto) {
  const article = document.createElement("article");

  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  const figura = document.createElement("figure");
  const img = document.createElement("img");
  img.src = produto.image;
  img.alt = produto.title;
  img.width = 80;
  img.height = 80;
  figura.append(img);

  const preco = document.createElement("p");
  const valor = document.createElement("strong");
  valor.textContent = `€${Number(produto.price).toFixed(2)}`;
  preco.append("Preço: ", valor);

  const botaoRemover = document.createElement("button");
  botaoRemover.textContent = "Remover";
  botaoRemover.addEventListener("click", () => {
    // remove o produto do cesto
    const lista = getCesto().filter((p) => p.id !== produto.id);
    setCesto(lista);
    atualizaCesto();
  });

  article.append(titulo, figura, preco, botaoRemover);
  return article;
}
