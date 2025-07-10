let currentOpenModal = null;

function openModalAndPauseAnimations(id) {
    const modalToOpen = document.getElementById(`modal-${id}`);
    if (!modalToOpen) return;

    currentOpenModal = modalToOpen;
    currentOpenModal.style.display = 'flex';
    
    // Pausar a animação do contêiner giratório
    const rotatingContainer = document.getElementById('rotating-divisions-container');
    if (rotatingContainer) {
        rotatingContainer.style.animationPlayState = 'paused';
    }
    document.querySelectorAll('.division').forEach(el => el.style.animationPlayState = 'paused');

    // Se o modal da linha do tempo for aberto, garanta que os itens da linha do tempo estejam visíveis
    if (id === 'linha-do-tempo') {
        const timelineItems = document.querySelectorAll('#modal-linha-do-tempo .timeline-item');
        timelineItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
    }
}

function closeModalAndResumeAnimations() {
    if (currentOpenModal) {
        currentOpenModal.style.display = 'none';
        // Hide all description boxes when closing Eixos da Computação modal
        if (currentOpenModal.id === 'modal-eixos-computacao') {
            document.querySelectorAll('.description-box').forEach(box => box.classList.remove('active'));
            document.querySelectorAll('.circle-button').forEach(button => button.classList.remove('active'));
        }
        // Hide all tab contents when closing Plugado e Desplugado modal
        if (currentOpenModal.id === 'modal-plugado-desplugado') {
            document.getElementById('initial-message').classList.remove('hidden');
            document.getElementById('plugado-content').classList.add('hidden');
            document.getElementById('desplugado-content').classList.add('hidden');
            document.getElementById('plugado-tab').classList.remove('active');
            document.getElementById('desplugado-tab').classList.remove('active');
            // Also close all category contents
            document.querySelectorAll('#plugado-content .category-content, #desplugado-content .category-content').forEach(content => content.classList.remove('active'));
            document.querySelectorAll('#plugado-content .arrow, #desplugado-content .arrow').forEach(arrow => arrow.classList.remove('active'));
        }
    }
    
    // Retomar a animação do contêiner giratório
    const rotatingContainer = document.getElementById('rotating-divisions-container');
    if (rotatingContainer) {
        rotatingContainer.style.animationPlayState = 'running';
    }
    document.querySelectorAll('.division').forEach(el => el.style.animationPlayState = 'running');
    currentOpenModal = null;
}

document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', closeModalAndResumeAnimations);
});

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        closeModalAndResumeAnimations();
    }
}

// Função para posicionar as divisões uniformemente no contêiner giratório
function positionDivisionsOnOrbit() {
    // Obter o contêiner giratório, não a órbita principal diretamente
    const rotatingContainer = document.getElementById('rotating-divisions-container');
    if (!rotatingContainer) return; // Garante que o contêiner exista antes de tentar acessá-lo

    const divisions = rotatingContainer.querySelectorAll('.division');
    const numDivisions = divisions.length;

    // O raio da "órbita" que as divisões devem seguir é o raio do contêiner giratório.
    // Como o contêiner giratório tem 100% da largura/altura da órbita pai, usamos o offsetWidth/2 dele.
    const orbitRadius = (rotatingContainer.offsetWidth / 2); 
    // Verifica se há divisões antes de tentar acessar offsetWidth
    const divisionSize = divisions.length > 0 ? divisions[0].offsetWidth : 0; 

    // Posição inicial (em graus), para que a primeira divisão comece no topo
    const startAngle = -90; 

    divisions.forEach((division, index) => {
        // Calcular o ângulo para cada divisão, distribuindo-as uniformemente
        const angle = startAngle + (360 / numDivisions) * index; 
        const angleRad = (angle * Math.PI) / 180; // Converter para radianos

        // Calcular a posição x e y em relação ao centro do contêiner giratório
        const x = orbitRadius * Math.cos(angleRad) - (divisionSize / 2); // Centralizar a divisão horizontalmente
        const y = orbitRadius * Math.sin(angleRad) - (divisionSize / 2); // Centralizar a divisão verticalmente

        // Definir a posição absoluta da divisão dentro do contêiner giratório
        division.style.left = `${x + orbitRadius}px`;
        division.style.top = `${y + orbitRadius}px`;
        
        // Definir animationDelay para que as divisões iniciem já distribuídas.
        // A duração da animação do contêiner giratório é de 60s.
        division.style.animationDelay = `${(60 / numDivisions) * index * -1}s`; 
    });
}

// Chamar a função de posicionamento quando a página carregar
window.onload = function() {
    positionDivisionsOnOrbit();
    
    // Add animation on scroll for timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function checkScroll() {
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (itemTop < windowHeight * 0.85) {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Check on load and scroll
    window.addEventListener('load', checkScroll);
    window.addEventListener('scroll', checkScroll);

    // Eixos da Computação Interactive Circles functionality
    const culturaBtn = document.getElementById('cultura-btn');
    const culturaBox = document.getElementById('cultura-box');
    const mundoBtn = document.getElementById('mundo-btn');
    const mundoBox = document.getElementById('mundo-box');
    const pensamentoBtn = document.getElementById('pensamento-btn');
    const pensamentoBox = document.getElementById('pensamento-box');
    
    if (culturaBtn && culturaBox && mundoBtn && mundoBox && pensamentoBtn && pensamentoBox) {
        culturaBtn.addEventListener('click', function() {
            culturaBox.classList.toggle('active');
            culturaBtn.classList.toggle('active');
            
            mundoBox.classList.remove('active');
            mundoBtn.classList.remove('active');
            pensamentoBox.classList.remove('active');
            pensamentoBtn.classList.remove('active');
        });
        
        mundoBtn.addEventListener('click', function() {
            mundoBox.classList.toggle('active');
            mundoBtn.classList.toggle('active');
            
            culturaBox.classList.remove('active');
            culturaBtn.classList.remove('active');
            pensamentoBox.classList.remove('active');
            pensamentoBtn.classList.remove('active');
        });
        
        pensamentoBtn.addEventListener('click', function() {
            pensamentoBox.classList.toggle('active');
            pensamentoBtn.classList.toggle('active');
            
            culturaBox.classList.remove('active');
            culturaBtn.classList.remove('active');
            mundoBox.classList.remove('active');
            mundoBtn.classList.remove('active');
        });
    }

    // Plugado e Desplugado Tabs and Categories functionality
    const plugadoTab = document.getElementById('plugado-tab');
    const desplugadoTab = document.getElementById('desplugado-tab');
    const plugadoContent = document.getElementById('plugado-content');
    const desplugadoContent = document.getElementById('desplugado-content');
    const initialMessage = document.getElementById('initial-message');
    
    if (plugadoTab && desplugadoTab && plugadoContent && desplugadoContent && initialMessage) {
        plugadoTab.addEventListener('click', function() {
            initialMessage.classList.add('hidden');
            plugadoContent.classList.remove('hidden');
            desplugadoContent.classList.add('hidden');
            
            plugadoTab.classList.add('active');
            desplugadoTab.classList.remove('active');
        });
        
        desplugadoTab.addEventListener('click', function() {
            initialMessage.classList.add('hidden');
            plugadoContent.classList.add('hidden');
            desplugadoContent.classList.remove('hidden');
            
            plugadoTab.classList.remove('active');
            desplugadoTab.classList.add('active');
        });
        
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', function() {
                const arrow = this.querySelector('.arrow');
                const content = this.nextElementSibling;
                
                content.classList.toggle('active');
                arrow.classList.toggle('active');
            });
        });
    }

    // Timeline details toggle functionality re-added
    const detailsButtons = document.querySelectorAll('.details-btn');
    
    detailsButtons.forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            const detailsElement = document.getElementById(`details-${id}`);
            
            if (detailsElement.classList.contains('hidden')) {
                detailsElement.classList.remove('hidden');
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                    Menos detalhes
                `;
            } else {
                detailsElement.classList.add('hidden');
                this.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mais detalhes
                `;
            }
        });
    });
    
    // Show all details button functionality re-added
    const showAllButton = document.getElementById('showAllDetails');
    let allExpanded = false; // Track the state of expansion
    
    if (showAllButton) { // Check if the button exists before adding listener
        showAllButton.addEventListener('click', function() {
            const detailsElements = document.querySelectorAll('[id^="details-"]');
            
            if (!allExpanded) {
                detailsElements.forEach(element => {
                    element.classList.remove('hidden');
                });
                
                detailsButtons.forEach(button => {
                    button.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                        </svg>
                        Menos detalhes
                    `;
                });
                
                showAllButton.textContent = 'Recolher todos os detalhes';
                allExpanded = true;
            } else {
                detailsElements.forEach(element => {
                    element.classList.add('hidden');
                });
                
                detailsButtons.forEach(button => {
                    button.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Mais detalhes
                    `;
                });
                
                showAllButton.textContent = 'Expandir todos os detalhes';
                allExpanded = false;
            }
        });
    }

    // References modal hover effects (re-added)
    const referenceCards = document.querySelectorAll('.reference-card');
            
    referenceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.borderLeftWidth = '8px';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderLeftWidth = '5px';
        });
    });
};

// Re-posicionar as divisões se a janela for redimensionada
window.addEventListener('resize', positionDivisionsOnOrbit);
