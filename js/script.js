// A função de e-mail pode ficar solta, pois ela só é ativada quando você clica
function copiarEmail(event) {
    // Evita que a página pule para o topo ao clicar no link vazio (#)
    event.preventDefault(); 
    
    // O e-mail que vai para o Ctrl+C
    const email = "renanmoreira151@outlook.com";
    
    // Comando moderno para copiar para a área de transferência
    navigator.clipboard.writeText(email).then(() => {
        const tooltip = document.getElementById("tooltipEmail");
        
        // Adiciona a classe que faz a caixinha aparecer
        tooltip.classList.add("mostrar");
        
        // Um cronômetro para esconder a caixinha após 2 segundos (2000 milissegundos)
        setTimeout(() => {
            tooltip.classList.remove("mostrar");
        }, 2000);
    }).catch(err => {
        console.error("Erro ao copiar o e-mail: ", err);
    });
}

// O código do Canvas entra aqui, esperando o HTML carregar primeiro
document.addEventListener('DOMContentLoaded', function() {
    
    const canvas = document.getElementById('malhaDados');
    
    // Uma pequena trava de segurança para avisar no console caso o canvas não exista no HTML
    if (!canvas) {
        console.error("A tag <canvas id='malhaDados'> não foi encontrada no HTML.");
        return;
    }

    const ctx = canvas.getContext('2d');

    // Ajusta o tamanho da tela
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particulasArray = [];

    // Cria a classe da Partícula (Nó de Dados)
    class Particula {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.tamanho = Math.random() * 2 + 1; // Tamanho entre 1 e 3px
            // Velocidade bem lenta e sutil
            this.velocidadeX = (Math.random() - 0.5) * 0.5; 
            this.velocidadeY = (Math.random() - 0.5) * 0.5;
        }

        atualizar() {
            this.x += this.velocidadeX;
            this.y += this.velocidadeY;

            // Faz a partícula "quicar" e voltar se bater na borda
            if (this.x < 0 || this.x > canvas.width) this.velocidadeX = -this.velocidadeX;
            if (this.y < 0 || this.y > canvas.height) this.velocidadeY = -this.velocidadeY;
        }

        desenhar() {
            ctx.fillStyle = 'rgba(139, 58, 58, 0.7)'; // Tom de vinho/terracota
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.tamanho, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Inicializa a malha com a quantidade de nós baseada no tamanho da tela
    function iniciar() {
        particulasArray = [];
        let numeroParticulas = (canvas.width * canvas.height) / 15000;
        for (let i = 0; i < numeroParticulas; i++) {
            particulasArray.push(new Particula());
        }
    }

    // Função para conectar as partículas que estão próximas
    function conectar() {
        let opacidadeValor = 1;
        for (let a = 0; a < particulasArray.length; a++) {
            for (let b = a; b < particulasArray.length; b++) {
                // Calcula a distância entre os nós
                let distancia = ((particulasArray[a].x - particulasArray[b].x) * (particulasArray[a].x - particulasArray[b].x))
                              + ((particulasArray[a].y - particulasArray[b].y) * (particulasArray[a].y - particulasArray[b].y));
                
                // Se a distância for menor que o limite, desenha a linha
                if (distancia < (canvas.width / 7) * (canvas.height / 7)) {
                    opacidadeValor = 1 - (distancia / 20000);
                    // Linhas num tom de verde escuro atmosférico
                    ctx.strokeStyle = `rgba(43, 89, 63, ${opacidadeValor})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particulasArray[a].x, particulasArray[a].y);
                    ctx.lineTo(particulasArray[b].x, particulasArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Loop de animação
    function animar() {
        requestAnimationFrame(animar);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa a tela
        
        for (let i = 0; i < particulasArray.length; i++) {
            particulasArray[i].atualizar();
            particulasArray[i].desenhar();
        }
        conectar();
    }

    // Recalcula se o usuário redimensionar a janela
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        iniciar();
    });

    // Inicia e roda a animação
    iniciar();
    animar();

    const observadorCards = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
            // Se o card entrou na área visível da tela
            if (entrada.isIntersecting) {
                // Adiciona a classe que revela o card
                entrada.target.classList.add('card-mostrar');
                
                // Opcional: faz com que a animação ocorra apenas uma vez (não repete se subir a página)
                observadorCards.unobserve(entrada.target);
            }
        });
    }, {
        // O card começa a aparecer quando 15% dele cruza a linha de baixo da tela
        threshold: 0.15 
    });

    // Seleciona todos os elementos que têm a classe 'card-escondido'
    const cardsProjetos = document.querySelectorAll('.card-escondido');
    
    // Aplica o observador e um atraso em cascata
    cardsProjetos.forEach((card, index) => {
        // Multiplica o índice por 0.2s para criar o efeito cascata (0s, 0.2s, 0.4s...)
        card.style.transitionDelay = `${index * 0.2}s`;
        observadorCards.observe(card);
    });

}); // Fim do ouvinte de evento

