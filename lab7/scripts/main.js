const categoriaSelect = document.getElementById("categoria");
const ordenarSelect = document.getElementById("ordenar");
const pesquisarInput = document.getElementById("procurar");

// ------------------------------------------------------
//  Inicializar o localStorage (chave produtos-selecionados)
// ------------------------------------------------------

const KEY = "cesto";                           // chave única nova

function getCesto() {
  try { 
    return JSON.parse(localStorage.getItem(KEY)) || []; 
  }
  catch { 
    return []; 
  }
}
function setCesto(lista) {
  localStorage.setItem(KEY, JSON.stringify(lista || []));
}
function clearCesto() {
  localStorage.removeItem(KEY);
}


// ------------------------------------------------------
//  URL base da API
// ------------------------------------------------------
const BASE_URL = "https://deisishop.pythonanywhere.com";

// ------------------------------------------------------
//  Quando o DOM estiver carregado
// ------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {

  carregarCategorias(); // preenche o <select> com categorias
  carregarProdutos();   // mostra todos os produtos inicialmente
  atualizaCesto();      // mantém o cesto atualizado

  categoriaSelect.addEventListener("change", () => carregarProdutos());
  ordenarSelect.addEventListener("change", () => carregarProdutos());
  pesquisarInput.addEventListener("input", () => carregarProdutos());
});

// ------------------------------------------------------
// Carregar categorias da API e preencher o <select>
// ------------------------------------------------------
async function carregarCategorias() {


  try {
    const resposta = await fetch(`${BASE_URL}/categories/`, {
      headers: { Accept: "application/json" },
    });
    if (!resposta.ok) throw new Error(`Erro HTTP ${resposta.status}`);

    const categorias = await resposta.json(); // ex.: ["T-shirts","Canecas","Meias"]

    categorias.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat;         // a própria string
      option.textContent = cat;   // a própria string
      categoriaSelect.appendChild(option);
    });
  } catch (erro) {
    console.error("Erro ao carregar categorias:", erro);
  }
}



// ------------------------------------------------------
//  Buscar produtos da API e renderizar
// ------------------------------------------------------
async function carregarProdutos() {
  const secao = document.querySelector("#produtos");
  secao.innerHTML = "<p>A carregar produtos...</p>";

  const categoria = document.getElementById('categoria')?.value;
  const ordenar = document.getElementById('ordenar')?.value;
  const termo = pesquisarInput.value.trim().toLowerCase();



  try {
    // 1) Tenta pedir já filtrado ao servidor
    const qs = categoria ? `?category=${encodeURIComponent(categoria)}` : "";
    const resp = await fetch(`${BASE_URL}/products/${qs}`, {
      headers: { Accept: "application/json" },
    });
    if (!resp.ok) throw new Error(`Erro HTTP ${resp.status}`);

    const dados = await resp.json();
    const produtos = Array.isArray(dados) ? dados : (dados.results || dados.products || []);

    // 2) Fallback: se a API não filtrou, filtramos no cliente
    let lista = categoria
      ? produtos.filter(p => {
          // tenta várias formas comuns de campo de categoria
          const cat = (p.category || p.categoria || p.category_name || "").toString().toLowerCase();

          // se vier como array de categorias
          if (Array.isArray(p.categories)) {
            return p.categories
              .map(x => x.toString().toLowerCase())
              .includes(categoria.toLowerCase());
          }

          return cat === categoria.toLowerCase();
        })
      : [...produtos];

    if (termo) {
      lista = lista.filter(p =>
        (p.title?.toLowerCase().includes(termo)) ||
        (p.description?.toLowerCase().includes(termo))
      );
    }

    
    if (ordenar === "asc") {
      lista.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (ordenar === "desc") {
      lista.sort((a, b) => Number(b.price) - Number(a.price));
    }

    

    // 3) Render
    if (!lista.length) {
      secao.innerHTML = "<p>Nenhum produto encontrado.</p>";
      return;
    }

    secao.innerHTML = "";
    lista.forEach(produto => secao.appendChild(criarProduto(produto)));

    
  } catch (e) {
    console.error("Falha ao carregar produtos:", e);
    secao.innerHTML = `<p style="color:#b00020">Erro a carregar produtos: ${e.message}</p>`;
  }
}




// ------------------------------------------------------
//  Criar um <article> para cada produto (catálogo)
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
//  Adicionar um produto ao cesto (localStorage + DOM)
// ------------------------------------------------------
function adicionarAoCesto(produto) {
  const lista = getCesto();
  lista.push(produto);
  setCesto(lista);
  atualizaCesto();
}

// ------------------------------------------------------
//  Atualizar o cesto no DOM
// ------------------------------------------------------
function atualizaCesto() {
  const secaoCesto = document.querySelector("#cesto");
  secaoCesto.innerHTML = "";

  const lista = getCesto();

  if (lista.length === 0) {
    clearCesto(); 
    secaoCesto.innerHTML = "";
    secaoCesto.classList.add("cesto-vazio");
    return;
  }
  secaoCesto.classList.remove("cesto-vazio");

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

  const botaoComprar = document.createElement("button");
  botaoComprar.textContent = "Comprar";
  botaoComprar.addEventListener("click", () => {

    setCesto(getCesto()); 

      // redireciona o utilizador para a página de checkout/cesto
    window.location.href = "cesto.html";
  });

  

  secaoCesto.append(hr, pTotal,botaoComprar);
}

// ------------------------------------------------------
//  Criar <article> para cada produto dentro do cesto
// ------------------------------------------------------
function criaProdutoCesto(produto) {
  const article = document.createElement("article");

  // figure (img) primeiro
  const figura = document.createElement("figure");
  const img = document.createElement("img");
  img.src = produto.image;
  img.alt = produto.title;
  img.width = 80;
  img.height = 80;
  figura.append(img);

  // título depois
  const titulo = document.createElement("h3");
  titulo.textContent = produto.title;

  // preço
  const preco = document.createElement("p");
  preco.className = "price";
  const valor = document.createElement("strong");
  valor.textContent = `€${Number(produto.price).toFixed(2)}`;
  preco.append("Preço: ", valor);

  // botão remover
  const botaoRemover = document.createElement("button");
  botaoRemover.textContent = "Remover";
  botaoRemover.addEventListener("click", () => {
    const nova = getCesto().filter(p => p.id !== produto.id);
    setCesto(nova);
    atualizaCesto();
  });

  // ORDEM CERTA: figura -> título -> preço -> botão
  article.append(figura, titulo, preco, botaoRemover);
  return article;
}

