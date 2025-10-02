let counter = 0;
const heading = document.querySelector('#counter');
const frase = document.querySelector('#pinta');
const input = document.querySelector('#input');
const pressionar = document.querySelector('#clique');
const color = document.querySelector('#cor-input');
const titulo = document.querySelector('#titulo');


function count() {
   counter++;
   heading.textContent = counter;
} 

function pintar(botao){
    if(botao.id === "botao1"){
        frase.style.color = "red";
    } else if (botao.id === "botao2"){
        frase.style.color = "green";
    } else if (botao.id === "botao3"){
        frase.style.color = "blue";
    }
}

input.addEventListener('keydown', () => {
    // Gera um número aleatório entre 0 e 255 para R, G e B
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    // Cria a cor no formato RGB
    const cor = `rgb(${r}, ${g}, ${b})`;

    // Aplica a cor de fundo no input
    input.style.backgroundColor = cor;
  });

function clicar(){
    const cor = color.value.trim().toLowerCase(); // Remove espaços e põe em minúsculas
    document.body.style.backgroundColor = cor;
}

function ratoEntrou() {
    titulo.textContent = 'Obrigado por passares!';
  }

  function ratoSaiu() {
    titulo.textContent = 'Passa por aqui!';
  }
  titulo.addEventListener('mouseover', ratoEntrou);
  titulo.addEventListener('mouseout', ratoSaiu);

