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

      for (var index in this.listeDemandeAmi) {
        let listeDemandeAmiHtmlItemRemplacement = demandeAmiHtml;
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{div.id}",
          this.listeDemandeAmi[index].idUtilisateur);
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{a.texte}",
          "Demande d'ami de " + this.listeDemandeAmi[index].pseudo);
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{boutonAccepter.id}",
          this.listeDemandeAmi[index].idUtilisateur);
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{boutonRefuser.id}",
          this.listeDemandeAmi[index].idUtilisateur);
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
      var listeBouton = document.getElementsByTagName("button");
      var nombreBouton = listeBouton.length;
      for (var i=0; i<nombreBouton; i++) {
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

      for (var index in this.listeAmi) {
        let listeAmiHtmlItemRemplacement = amiHtml;
        listeAmiHtmlItemRemplacement =
          listeAmiHtmlItemRemplacement.replace("{div.id}",
          this.listeAmi[index].idUtilisateur);
        listeAmiHtmlItemRemplacement =
          listeAmiHtmlItemRemplacement.replace("{a.href}",
          this.listeAmi[index].idUtilisateur);
        listeAmiHtmlItemRemplacement =
          listeAmiHtmlItemRemplacement.replace("{a.texte}",
          this.listeAmi[index].pseudo);
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
    // Récupérer l'id de l'utilisateur connecté
    var idUtilisateur = firebase.auth().currentUser.uid;
    // Récupérer les valeurs des champs
    var emailUtilisateurAjoute = document.getElementById("email").value;
    // Ajouter ami
    var resultat = await this.actionAjouterAmi(idUtilisateur, emailUtilisateurAjoute);
    if (resultat != "true") {
      choixAlerte(resultat);
    }
  }

  async gererDemandeAmi(evenement, idUtilisateurAccepte, reponse) {
    console.log("VueAmis->accepterDemandeAmi()");
    evenement.preventDefault();
    var resultat = await this.actionGererDemandeAmi(idUtilisateurAccepte, reponse);
    if (resultat != "true") {
      choixAlerte(resultat);
    } else {
      // Mettre à jour l'html
      document.getElementById("demande-ami-de-" + idUtilisateurAccepte).innerHTML = "";
    }
  }
}
