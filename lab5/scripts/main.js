let counter = 0;
const heading = document.querySelector('#counter');
const frase = document.querySelector('#pinta');
const input = document.querySelector('#input');
const pressionar = document.querySelector('#clique');
const color = document.querySelector('#cor-input');
const titulo = document.querySelector('#titulo');
let contador_automatico = 0;
const span = document.querySelector("span");


function count() {
   counter++;
   heading.innerHTML = counter;
} 

document.querySelectorAll('button.color').forEach(function(button) {
    button.onclick = function() {
        frase.style.color = button.dataset.color;
    }
})

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

document.querySelector('select').onchange = function() {
    document.querySelector('body').style.backgroundColor =
    this.value;
}

document.querySelector('form').onsubmit = (e) => {
  e.preventDefault();

  const nome = document.querySelector('#nome').value;
  const idade = document.querySelector('#idade').value;

  const p = document.createElement('p');
  p.textContent = nome +  ` - ` +  idade + ` anos`;

  document.querySelector('#lista').appendChild(p);
};


function contador() {
    
    span.innerHTML = ++contador_automatico;
}
setInterval(contador, 1000);



