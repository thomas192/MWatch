class VueAmis {
  constructor() {
    this.html = document.getElementById("html-vue-amis").innerHTML;
    this.listeDemandeAmi = null;
    this.listeAmi = null;
    // Fonctions prêtées par le controleur
    this.actionAjouterAmi = null;
    this.actionGererDemandeAmi = null;
  }

  /** Initialise la liste des utilisateurs qui ont envoyé une demande d'ami */
  initialiserListeDemandeAmi(listeDemandeAmi) {
    this.listeDemandeAmi = listeDemandeAmi;
  }

  /** Initialise la liste d'amis */
  initialiserListeAmi(listeAmi) {
    this.listeAmi = listeAmi;
  }

  /** Initialise la fonction actionGererDemandeAmi */
  initialiserActionGererDemandeAmi(actionGererDemandeAmi) {
    this.actionGererDemandeAmi = actionGererDemandeAmi;
  }

  /** Initialise la fonction actionAjouterAmi */
  initialiserActionAjouterAmi(actionAjouterAmi) {
    this.actionAjouterAmi = actionAjouterAmi;
  }

  /** Gère l'affichage de la vue */
  afficher() {
    console.log("VueAmis->afficher()");
    document.getElementsByTagName("contenu")[0].innerHTML = this.html;

    // Ecouteur du formulaire de demande d'ami
    document.getElementById("formulaire-ajouter-ami").addEventListener("submit",
    evenement => this.ajouterAmi(evenement));

    // Affichage des demandes d'ami
    if (this.listeDemandeAmi.length > 0) {
      document.getElementById("liste-demande-ami").style.display = "block";

      let listeDemandeAmiHtml = document.getElementById("liste-demande-ami");
      const demandeAmiHtml = listeDemandeAmiHtml.innerHTML;
      let listeDemandeAmiHtmlRemplacement = "";

      for (let i in this.listeDemandeAmi) {
        let listeDemandeAmiHtmlItemRemplacement = demandeAmiHtml;
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{div.id}",
          this.listeDemandeAmi[i].id);
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{a.texte}",
          "Demande d'ami de " + this.listeDemandeAmi[i].pseudo);
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{boutonAccepter.id}",
          this.listeDemandeAmi[i].id);
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{boutonRefuser.id}",
          this.listeDemandeAmi[i].id);
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{boutonAccepter.texte}",
          "Accepter");
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{boutonRefuser.texte}",
          "Refuser");
       listeDemandeAmiHtmlRemplacement += listeDemandeAmiHtmlItemRemplacement;
      }
      listeDemandeAmiHtml.innerHTML = listeDemandeAmiHtmlRemplacement;

      // Ajout d'un écouteur pour chaque bouton de chaque demande
      let listeBouton = document.getElementsByTagName("button");
      for (let i=0; i<listeBouton.length; i++) {
        let idBouton = listeBouton[i].id;
        let valeurBouton = listeBouton[i].value;
        listeBouton[i].addEventListener("click",
          evenement => this.gererDemandeAmi(evenement, idBouton, valeurBouton));
      }
    } else {
      document.getElementById("liste-demande-ami").style.display = "none";
    }

    // Affichage de la liste d'ami
    if (this.listeAmi.length > 0) {
      document.getElementById("liste-ami-vide").style.display = "none";

      let listeAmiHtml = document.getElementById("liste-ami");
      const amiHtml = listeAmiHtml.innerHTML;
      let listeAmiHtmlRemplacement = "";

      for (let i in this.listeAmi) {
        let listeAmiHtmlItemRemplacement = amiHtml;
        listeAmiHtmlItemRemplacement =
          listeAmiHtmlItemRemplacement.replace("{div.id}",
          this.listeAmi[i].id);
        listeAmiHtmlItemRemplacement =
          listeAmiHtmlItemRemplacement.replace("{a.href}",
          this.listeAmi[i].id);
        listeAmiHtmlItemRemplacement =
          listeAmiHtmlItemRemplacement.replace("{a.texte}",
          this.listeAmi[i].pseudo);
       listeAmiHtmlRemplacement += listeAmiHtmlItemRemplacement;
      }
      listeAmiHtml.innerHTML = listeAmiHtmlRemplacement;

    } else {
      document.getElementById("liste-ami").style.display = "none";
    }
  }

  async ajouterAmi(evenement) {
    console.log("VueAmis->actionAjouterAmi()");
    evenement.preventDefault();
    // Récupérer les valeurs des champs
    let emailUtilisateurAjoute = document.getElementById("email").value;
    // Ajouter ami
    let resultat = await this.actionAjouterAmi(emailUtilisateurAjoute);
    choixAlerte(resultat);
  }

  async gererDemandeAmi(evenement, idUtilisateurAccepte, reponse) {
    console.log("VueAmis->accepterDemandeAmi()");
    evenement.preventDefault();
    let resultat = await this.actionGererDemandeAmi(idUtilisateurAccepte, reponse);
    if (resultat !== "true") {
      choixAlerte(resultat);
    } else {
      // Mettre à jour la vue
      for (let i in this.listeDemandeAmi) {
        if (this.listeDemandeAmi[i].id === idUtilisateurAccepte) {
          let ami = this.listeDemandeAmi[i];
          this.listeDemandeAmi.splice(i, 1);
          if (reponse === "acceptee") {
            this.listeAmi.push(ami);
          }
          this.afficher();
        }
      }
    }
  }
}
