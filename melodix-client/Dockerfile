#Image Node.js légère 
FROM node:22-alpine

#Répertoire de travail dans le container 
WORKDIR /app 

#Copier les fichiers package pour installer les dépendances 
COPY package*.json ./

#Installer les dependances 
RUN npm install 

#Copier le reste du code 
COPY . .

#Exposer le port vite (5173)
EXPOSE 5173 

#Démarrer en mode développement 
CMD ["npm", "run", "dev", "--", "--host"]