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
