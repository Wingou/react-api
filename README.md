# api

Installer git 
> https://git-scm.com/download/win

Créer le dossier dans Git

$> Git clone [le projet]

Générer le fichier id_rsa et id_rsa.pub :
$> ssh-keygen -t rsa -b 2048

Aller dans C:\Users\[NomUser]\.ssh

Ouvrir le fichier id_rsa.pub avec NotePad.

Aller dans https://github.com/settings/keys
Aller dans SSH and GPG keys
Cliquer sur New SSH key
Ajouter le contenu de id_rsa.pub dans le champ

Sur le Terminal :
$> git config --global user.email "wing92300@gmail.com"



========================
EXECUTION :
$> node ./src/server.js


-------------------------------------

$> npm install
$> npm install dotenv
$> npm install odbc