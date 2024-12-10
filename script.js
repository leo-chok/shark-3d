$(document).ready(function () {
            try {
                $('.image').ripples({
                    resolution: 256,        // Résolution du canevas
                    dropRadius: 100,         // Taille des gouttes
                    perturbance: .5,      // Réfraction des vagues
                });
                console.log("Effet d'eau activé !");
            } catch (e) {
                console.error("Une erreur est survenue :", e);
            }
        });