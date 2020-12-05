function choixAlerte(codeErreur) {
  switch(codeErreur) {
    case "auth/wrong-password":
      alert(ERREUR_MOT_DE_PASSE_INCORRECT);
      break;
    case "auth/weak-password":
      alert(ERREUR_MOT_DE_PASSE_PAS_ASSEZ_SECURISE);
      break;
    case "auth/invalid-email":
      alert(ERREUR_EMAIL_INVALIDE);
      break;
    case "auth/email-already-exists":
      alert(ERREUR_EMAIL_DEJA_UTILISE);
      break;
    case "auth/email-already-in-use":
      alert(ERREUR_EMAIL_DEJA_UTILISE);
      break;
    case "auth/too-many-requests":
      alert(ERREUR_TROP_DE_TENTATIVES);
      break;
    case "auth/invalid-display-name":
      alert(ERREUR_PSEUDO_INVALIDE);
      break;
    case "auth/requires-recent-login":
      alert(ERREUR_CONNEXION_RECENTE_REQUISE);
      break;
    case "utilisateur_inconnu":
      alert(ERREUR_UTILISATEUR_INCONNU);
      break;
    case "ajout_de_soi_en_ami":
      alert(ERREUR_AJOUT_DE_SOI_EN_AMI);
      break;
    case "demande_ami_deja_envoyee":
      alert(ERREUR_DEMANDE_AMI_DEJA_ENVOYEE);
      break;
    case "deja_ami":
      alert(ERREUR_DEJA_AMI);
      break;
    default:
      alert(codeErreur);
  }
}


// Créé un objet erreur personnalisé
function exceptionPersonnalisee(code) {
  console.log("   exceptionPersonnalisee()");
  const objetErreur = new Error("Erreur personnalisée");
  objetErreur.code = code;
  throw objetErreur;
}
