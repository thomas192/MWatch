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
    default:
      alert(codeErreur);
  }
}
