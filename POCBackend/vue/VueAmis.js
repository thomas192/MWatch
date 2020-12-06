class VueAmis {
  constructor() {
    this.html = document.getElementById("html-vue-amis").innerHTML;
    this.listeDemandeAmi = null;
    // Fonctions prêtées par le controleur
    this.actionAjouterAmi = null;
  }

  /** Initialise la liste des utilisateurs qui ont envoyé une demande d'ami */
  initialiserListeDemandeAmi(listeDemandeAmi) {
    this.listeDemandeAmi = listeDemandeAmi;
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
          listeDemandeAmiHtmlItemRemplacement.replace("{a.texte}",
          this.listeDemandeAmi[index].pseudo + " souhaite devenir votre ami");
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{boutonAccepter.value}",
          this.listeDemandeAmi[index].idUtilisateur);
        listeDemandeAmiHtmlItemRemplacement =
          listeDemandeAmiHtmlItemRemplacement.replace("{boutonRefuser.value}",
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
    } else {
      document.getElementById("liste-demande-ami").style.display = "none";
    }
  }

  async ajouterAmi(evenement) {
    console.log("VueProfil->actionAjouterAmi()");
    evenement.preventDefault();
    // Récupérer l'id de l'utilisateur connecté
    var idUtilisateur = firebase.auth().currentUser.uid;
    // Récupérer les valeurs des champs
    var emailUtilisateurAjoute = document.getElementById("email").value;
    // Ajouter ami
    var resultat = await this.actionAjouterAmi(idUtilisateur, emailUtilisateurAjoute);
    if(resultat != "true") {
      choixAlerte(resultat);
    }
  }
}
