import il8n from "i18next";
import { initReactI18next} from "react-i18next";

const resources = {
    en:{
        translation:{
            "mainPage":"Main Page",
            "org":"Organizations",
            "dep":"Departments",
            "add-user":"Add User",
            "edit":"Edit",
            "create":"Create",
            "back":"Back",
            "logout":"Logout",
            "create-dep":"Create Department",
            "create-org":"Create Organization",
            "logout":"Logout",
            "email":"Email",
            "password":"Password",
            "login":"Login",
            "task-mngr":"Task Manager",
            "view":"View",
            "create-task":"Create Task",
            "view-task":"View Task",
            "cancel":"Cancel",
            "save":"Save",
            "pending":"Pending",
            "in-progress":"In Progress",
            "completed":"Completed",
            "high":"High",
            "medium":"Medium",
            "low":"Low",
            "admin":"Admin",
            "manager":"Manager",
            "user":"User",
            "update-user":"Update User",
            "lodaing-data":"Loading user data...",
            "name":"Name",
            "role":"Role",
            "title":"Title",
            "description":"Description",
            "duedate":"Due Date",
            "status":"Status",
            "priority":"Priority",
            "duedate":"Due Date",
            "assignedUsers":"Assigned Users",
            "update":"Update",
        }
    },
    "fr": {
        "translation": {
            "mainPage": "Page Principale",
            "org": "Organisations",
            "dep": "Départements",
            "add-user": "Ajouter un utilisateur",
            "edit": "Modifier",
            "create": "Créer",
            "back": "Retour",
            "logout": "Déconnexion",
            "create-dep": "Créer un département",
            "create-org": "Créer une organisation",
            "email": "E-mail",
            "password": "Mot de passe",
            "login": "Connexion",
            "task-mngr": "Gestionnaire de tâches",
            "view": "Voir",
            "create-task": "Créer une tâche",
            "view-task": "Voir la tâche",
            "cancel": "Annuler",
            "save": "Enregistrer",
            "pending": "En attente",
            "in-progress": "En cours",
            "completed": "Terminé",
            "high": "Élevé",
            "medium": "Moyen",
            "low": "Faible",
            "admin": "Administrateur",
            "manager": "Gestionnaire",
            "user": "Utilisateur",
            "update-user": "Mettre à jour l'utilisateur",
            "lodaing-data": "Chargement des données utilisateur...",
            "name": "Nom",
            "role": "Rôle",
            "title": "Titre",
            "description": "Description",
            "duedate": "Date d'échéance",
            "status": "Statut",
            "priority": "Priorité",
            "assignedUsers": "Utilisateurs assignés"
        }
    }
};

il8n
 .use(initReactI18next)
 .init({
    resources,
    lng: navigator.language.split('-')[0] || "en", 
    fallbackLng: "en", 
    interpolation:{
        escapeValue:false,
    }
})

export default il8n;
