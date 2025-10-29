const BASE_URL = "https://deisishop.pythonanywhere.com";

const KEY = "cesto";      

function gerarReferencia() {
  const d = new Date();
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const n  = Number(localStorage.getItem("compraCount") || 0) + 1;
  localStorage.setItem("compraCount", String(n));
  return `${yy}${mm}${dd}-${String(n).padStart(4, "0")}`;
}

function getCesto() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; }
  catch { return []; }
}
function setCesto(lista) {
  localStorage.setItem(KEY, JSON.stringify(lista || []));
}
function clearCesto() {
  localStorage.removeItem(KEY);
}

document.addEventListener("DOMContentLoaded", () => {
  const secao = document.querySelector("#cesto");
  const lista = getCesto();

  if (!lista.length) {
    secao.innerHTML = "<p>O seu cesto está vazio.</p>";
    secao.classList.add("cesto-vazio");
    return;
  }
  secao.classList.remove("cesto-vazio");

  // mostrar produtos e calcular total
  let total = 0;
  lista.forEach(p => {
    total += Number(p.price || 0);
    const artigo = document.createElement("article");
    artigo.innerHTML = `
      <figure><img src="${p.image}" alt="${p.title}" /></figure>
      <h3>${p.title}</h3>
      <p><strong>${Number(p.price).toFixed(2)} €</strong></p>
    `;
    secao.appendChild(artigo);
  });

  const linha = document.createElement("hr");
  const custoTotal = document.createElement("p");
  custoTotal.innerHTML = `<strong>Custo total:</strong> ${total.toFixed(2)} €`;
  secao.append(linha, custoTotal);

  // checkbox estudante
  const chk = document.createElement("input");
  chk.type = "checkbox";
  chk.id = "estudante";
  const lbl = document.createElement("label");
  lbl.htmlFor = "estudante";
  lbl.textContent = "És estudante do DEISI?";
  secao.append(lbl, chk);

  // campo cupão
  const cupao = document.createElement("input");
  cupao.type = "text";
  cupao.placeholder = "Cupão de desconto:";
  secao.append(cupao);

  // botão comprar
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = "Comprar";
  secao.append(botao);

  // resultados (p e hr)
  const valorFinal = document.createElement("p");
  valorFinal.innerHTML = `<strong>Valor final a pagar (com eventuais descontos):</strong> <span id="valorFinal">${total.toFixed(2)}</span> €`;
  const referencia = document.createElement("p");
  referencia.innerHTML = `Referência de pagamento: <span id="refPagamento">—</span>`;
  valorFinal.style.display = referencia.style.display = "none";
  secao.append(valorFinal, referencia);

  // ação de compra
  botao.addEventListener("click", async (e) => {
    e.preventDefault();
    botao.disabled = true;

    const produtosIds = lista.map(p => p.id);
    const estudante   = chk.checked;
    const codigo      = cupao.value.trim();

    try {
      const resp = await fetch(`${BASE_URL}/buy/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          products: produtosIds,
          student: estudante,
          coupon: codigo,
          name: "" // opcional
        })
      });

      const ct = resp.headers.get("content-type") || "";
      const isJson = ct.includes("application/json");

      if (!resp.ok) {
        const msg = isJson ? (await resp.json()).error : await resp.text();
        throw new Error(msg || `HTTP ${resp.status}`);
      }

      const dados = isJson ? await resp.json() : {};
      const totalFinal = dados.totalCost ? Number(dados.totalCost) : total;
      const ref = dados.reference || gerarReferencia();

      document.getElementById("valorFinal").textContent = totalFinal.toFixed(2);
      document.getElementById("refPagamento").textContent = ref;

      valorFinal.style.display = "block";
      referencia.style.display = "block";

      valorFinal.className = "valor-final";
      referencia.className = "referencia";

      // limpa o cesto se quiseres
      // localStorage.removeItem("cesto");
    } catch (err) {
      console.error(err);
      alert("Erro ao processar o pedido. Verifica o endpoint e tenta novamente.");
    } finally {
      botao.disabled = false;
    }
  });
});
