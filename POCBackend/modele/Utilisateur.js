class Utilisateur {
  constructor(id, pseudo, email, motDePasse) {
    this.id = id;
    this.pseudo = pseudo;
    this.email = email;
  }

  static choixAlerte(code) {
    switch(code) {
      case "auth/wrong-password":
        return { message: ERREUR_MOT_DE_PASSE_INCORRECT, type: "erreur" };
        break;
      case "auth/weak-password":
        return { message: ERREUR_MOT_DE_PASSE_PAS_ASSEZ_SECURISE, type: "erreur" };
        break;
      case "auth/invalid-email":
        return { message: ERREUR_EMAIL_INVALIDE, type: "erreur" };
        break;
      case "auth/email-already-exists":
        return { message: ERREUR_EMAIL_DEJA_UTILISE, type: "erreur" };
        break;
      case "auth/email-already-in-use":
        return { message: ERREUR_EMAIL_DEJA_UTILISE, type: "erreur" };
        break;
      case "auth/too-many-requests":
        return { message: ERREUR_TROP_DE_TENTATIVES, type: "erreur" };
        break;
      case "auth/invalid-display-name":
        return { message: ERREUR_PSEUDO_INVALIDE, type: "erreur" };
        break;
      case "auth/user-not-found":
        return { message: ERREUR_EMAIL_INVALIDE, type: "erreur" };
        break;
      case "auth/requires-recent-login":
        return { message: ERREUR_CONNEXION_RECENTE_REQUISE, type: "erreur" };
        break;
      case "utilisateur_inconnu":
        return { message: ERREUR_UTILISATEUR_INCONNU, type: "erreur" };
        break;
      case "ajout_de_soi_en_ami":
        return { message: ERREUR_AJOUT_DE_SOI_EN_AMI, type: "erreur" };
        break;
      case "demande_ami_deja_envoyee":
        return { message: ERREUR_DEMANDE_AMI_DEJA_ENVOYEE, type: "erreur" };
        break;
      case "deja_ami":
        return { message: ERREUR_DEJA_AMI, type: "erreur" };
        break;
      case "miseAJourEffectuee":
        return { message: SUCCES_MISE_A_JOUR, type: "succes" };
        break;
      case "demandeAmiEnvoyee":
        return { message: SUCCES_DEMANDE_AMI, type: "succes" };
        break;
      default:
        alert(code);
    }
  }
}
