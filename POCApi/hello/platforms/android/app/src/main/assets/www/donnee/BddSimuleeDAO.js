class BddSimuleeDAO{
    constructor(){
        this.genreAime = ["Aventure", "Crime", "Mystère","Téléfilm","Thriller","Guerre"];
        this.filmVuAime = [];
        this.filmVuNonAime = [];
        this.filmVouloirVoir = [];
        this.filmPasVouloirVoir = [];
    }

    getGenreAime(utilisateur){
        //A remplacer par appel BDD
        return this.genreAime;
    }

    isInBdd(id, utilisateur){
        //A remplacer par appel BDD
        console.log("filmAime : " + this.filmAime)
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

    utilisateurVouloirVoirFilm(id, utilisateur){
        //A remplacer par appel BDD
        this.filmVouloirVoir.push(id);
    }
    utilisateurPasVouloirVoirFilm(id, utilisateur){
        //A remplacer par appel BDD
        this.filmPasVouloirVoir.push(id);
    }
    utilisateurFilmVuAime(id, utilisateur){
        //A remplacer par appel BDD
        this.filmVuAime.push(id);
    }
    utilisateurFilmVuNonAime(id, utilisateur){
        //A remplacer par appel BDD
        this.filmVuNonAime.push(id);
    }

}