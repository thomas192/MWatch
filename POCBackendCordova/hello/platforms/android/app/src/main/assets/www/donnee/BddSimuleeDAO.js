//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// DAO dans laquelle on simule les donnees de BDD en attendant le merge des 2 POC                               //
// Les donnees simulees sont toutes a supprimer une fois la merge faites                                        //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class BddSimuleeDAO{

    // Initialisation de données de tests, a effacer une fois le merge fait et la BDD liée
    constructor(){
        this.genreAime = ["Aventure", "Crime", "Mystère","Téléfilm","Thriller","Guerre"]; 
        this.filmVuAime = [];
        this.filmVuNonAime = [];
        this.filmVouloirVoir = [];
        this.filmPasVouloirVoir = [];
    }

    // Renvoie la liste des genres aimes par l'utilisateur 
    getGenreAime(utilisateur){
        //A remplacer par appel BDD
        return this.genreAime;
    }

    // True -> film présent dans la table de l'utilisateur ; False -> Film non présent dans la table de l'utilisateur
    isInBdd(id, utilisateur){ // Cherche a savoir si un film ("id") est déjà présent dans la table d'"utilisateur"
        //A remplacer par appel BDD
        console.log("DEBUG : Film vus et aimés :" , this.filmVuAime);
        console.log("DEBUG : Film vus et non aimés :" , this.filmVuNonAime);
        console.log("DEBUG : Film non vus et envie de voir :" , this.filmVouloirVoir);
        console.log("DEBUG : Film non vus et pas envoie de voir :" , this.filmPasVouloirVoir);
        if(this.filmVuAime.includes(id) || this.filmVuNonAime.includes(id) || this.filmVouloirVoir.includes(id) || this.filmPasVouloirVoir.includes(id)) 
        {            
            return true;
        } else {
            return false;
        }
    }

    utilisateurVouloirVoirFilm(id, utilisateur){ // Ajout du film ("id") dans la table d'"utilisateur" en tant que film voulant être vu
        //A remplacer par appel BDD
        this.filmVouloirVoir.push(id);
    }
    utilisateurPasVouloirVoirFilm(id, utilisateur){ // Ajout du film ("id") dans la table d'"utilisateur" en tant que film ne voulant pas être vu
        //A remplacer par appel BDD
        this.filmPasVouloirVoir.push(id);
    }
    utilisateurFilmVuAime(id, utilisateur){ // Ajout du film ("id") dans la table d'"utilisateur" en tant que film deja vu et aime
        //A remplacer par appel BDD
        this.filmVuAime.push(id);
    }
    utilisateurFilmVuNonAime(id, utilisateur){ // Ajout du film ("id") dans la table d'"utilisateur" en tant que film deja vu et non aime
        //A remplacer par appel BDD
        this.filmVuNonAime.push(id);
    }

}