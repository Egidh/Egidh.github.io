/*!
* Start Bootstrap - Personal v1.0.1 (https://startbootstrap.com/template-overviews/personal)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-personal/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your project

document.addEventListener("DOMContentLoaded", function() {
    // CAROUSEL DE COMPÉTENCES
    const carousel = document.getElementById('carouselItems');
    if (carousel) {
        const items = document.querySelectorAll('#carouselItems .skill-item');
        let currentIndex = 0;
        const maxIndex = items.length - 1;

        function updateCarousel() {
            const offset = items[0].offsetWidth * currentIndex;
            carousel.scrollTo({ left: offset, behavior: 'smooth' });
        }

        const nextBtnCarousel = document.getElementById('nextBtn');
        const prevBtnCarousel = document.getElementById('prevBtn');
        
        if (nextBtnCarousel && prevBtnCarousel) {
            nextBtnCarousel.addEventListener('click', () => {
                if (currentIndex < maxIndex) currentIndex++;
                updateCarousel();
            });

            prevBtnCarousel.addEventListener('click', () => {
                if (currentIndex > 0) currentIndex--;
                updateCarousel();
            });
        }
        
        // Ajout du défilement horizontal par trackpad/souris
        carousel.addEventListener('wheel', function(e) {
            if (e.deltaX === 0 && Math.abs(e.deltaY) > 0) {
                // Si l'utilisateur fait défiler verticalement, convertir en défilement horizontal
                e.preventDefault();
                carousel.scrollLeft += e.deltaY;
                
                // Mise à jour de l'index selon la position du défilement
                currentIndex = Math.round(carousel.scrollLeft / items[0].offsetWidth);
            }
        }, { passive: false });
    }

    // GESTION DES SECTIONS DU CV
    const sections = document.querySelectorAll('.cv-section');
    const indicators = document.querySelectorAll('.section-indicator');
    const prevBtn = document.getElementById('prevSection');
    const nextBtn = document.getElementById('nextSection');
    let currentSectionIndex = 0;
    
    // Initialisation : afficher la première section
    if(sections.length > 0) {
        sections[0].classList.add('active', 'slide-in-right');
    }
    
    // Fonction pour changer de section
    function goToSection(index, direction) {
        // Si on clique sur l'indicateur actif, ne rien faire
        if (index === currentSectionIndex) return;
        
        // Vérifier si on va en avant ou en arrière
        const goingForward = direction === 'next' || (direction === undefined && index > currentSectionIndex);
        
        // Déterminer les classes d'animation en fonction de la direction
        const inClass = goingForward ? 'slide-in-right' : 'slide-in-left';
        const outClass = goingForward ? 'slide-out-left' : 'slide-out-right';
        
        // Masquer la section actuelle avec animation de sortie
        sections[currentSectionIndex].classList.remove('slide-in-right', 'slide-in-left');
        sections[currentSectionIndex].classList.add(outClass);
        
        // Attendre la fin de l'animation de sortie
        setTimeout(() => {
            // Désactiver l'ancienne section
            sections[currentSectionIndex].classList.remove('active', outClass);
            
            // Activer la nouvelle section avec l'animation d'entrée appropriée
            sections[index].classList.add('active', inClass);
            
            // Mettre à jour les indicateurs
            indicators.forEach((indicator, i) => {
                indicator.classList.toggle('active', i === index);
            });
            
            // Mettre à jour les boutons de navigation
            if (prevBtn && nextBtn) {
                prevBtn.disabled = index === 0;
                nextBtn.disabled = index === sections.length - 1;
            }
            
            // Mettre à jour l'index courant
            currentSectionIndex = index;
        }, 400); // Durée légèrement inférieure à celle de l'animation
    }
    
    // Écouteurs d'événements pour les boutons de navigation entre sections
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentSectionIndex > 0) {
                goToSection(currentSectionIndex - 1, 'prev');
            }
        });
        
        nextBtn.addEventListener('click', function() {
            if (currentSectionIndex < sections.length - 1) {
                goToSection(currentSectionIndex + 1, 'next');
            }
        });
    }
    
    // Écouteurs pour les indicateurs (points de navigation)
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            console.log('Indicator clicked:', index);
            const direction = index > currentSectionIndex ? 'next' : 'prev';
            goToSection(index, direction);
        });
    });
    
    // Navigation avec les touches de clavier
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            if (currentSectionIndex < sections.length - 1) {
                goToSection(currentSectionIndex + 1, 'next');
            }
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            if (currentSectionIndex > 0) {
                goToSection(currentSectionIndex - 1, 'prev');
            }
        }
    });
    
    // Ajout du défilement horizontal entre sections avec trackpad (seulement horizontal)
    document.addEventListener('wheel', function(e) {
        // Traiter à la fois le défilement horizontal (trackpad) et vertical (molette)
        if (Math.abs(e.deltaX) > 10 && !isScrollableElement(e.target)) {
            e.preventDefault();
            if (e.deltaX > 0 && currentSectionIndex < sections.length - 1) {
                goToSection(currentSectionIndex + 1, 'next');
            } else if (e.deltaX < 0 && currentSectionIndex > 0) {
                goToSection(currentSectionIndex - 1, 'prev');
            }
        } else if (Math.abs(e.deltaY) > 50 && !isScrollableElement(e.target)) {
            // Pour la molette, le défilement vers le bas (deltaY positif) fait avancer
            if (e.deltaY > 0 && currentSectionIndex < sections.length - 1) {
                e.preventDefault(); // Bloquer seulement si on change de section
                goToSection(currentSectionIndex + 1, 'next');
            // Le défilement vers le haut (deltaY négatif) fait reculer  
            } else if (e.deltaY < 0 && currentSectionIndex > 0) {
                e.preventDefault(); // Bloquer seulement si on change de section
                goToSection(currentSectionIndex - 1, 'prev');
            }
            // Si aucune condition n'est remplie, le scroll naturel continue
        }
    }, { passive: false });
    
    // Fonction pour vérifier si l'élément est scrollable et actuellement en train de défiler
    function isScrollableElement(element) {
        let currentElement = element;
        
        // Remonter dans les parents pour trouver un élément scrollable
        while (currentElement && currentElement !== document.body) {
            const hasScroll = currentElement.scrollHeight > currentElement.clientHeight || 
                              currentElement.scrollWidth > currentElement.clientWidth;
            
            // Si c'est le carousel, on le considère comme géré séparément
            if (currentElement.id === 'carouselItems') return true;
            
            if (hasScroll) {
                const isScrolledToEnd = currentElement.scrollHeight - currentElement.scrollTop <= currentElement.clientHeight + 5;
                const isScrolledToStart = currentElement.scrollTop <= 5;
                
                // Si on n'est pas au bout du scroll, considérer que c'est scrollable
                if (!isScrolledToEnd && !isScrolledToStart) return true;
            }
            
            currentElement = currentElement.parentElement;
        }
        
        return false;
    }
    
    // NAVIGATION TACTILE
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    const swipeThreshold = 80; // Seuil de distance pour détecter un swipe
    
    // Configuration des événements tactiles
    document.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: false });
    
    // Fonction pour gérer les gestes de swipe
    function handleSwipe() {
        // Calculer la distance horizontale et verticale du swipe
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Ne réagir qu'aux swipes horizontaux qui dépassent le seuil
        if (Math.abs(deltaX) > swipeThreshold && Math.abs(deltaX) > Math.abs(deltaY)) {
            // Éviter les swipes courts ou accidentels
            const targetElement = document.elementFromPoint(touchStartX, touchStartY);
            if (!isScrollableElement(targetElement)) {
                if (deltaX > 0 && currentSectionIndex > 0) {
                    // Swipe de gauche à droite -> section précédente
                    goToSection(currentSectionIndex - 1, 'prev');
                } else if (deltaX < 0 && currentSectionIndex < sections.length - 1) {
                    // Swipe de droite à gauche -> section suivante
                    goToSection(currentSectionIndex + 1, 'next');
                }
            }
        }
    }
});
