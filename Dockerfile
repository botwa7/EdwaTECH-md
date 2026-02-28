# Itilize imaj Node.js ofisyèl la
FROM node:18-alpine

# Mete katab travay la
WORKDIR /app

# Kopye package.json ak package-lock.json anvan
COPY package*.json ./

# Enstale depandans yo
RUN npm install --production

# Kopye tout rès kòd la
COPY . .

# Ekspose port 3000
EXPOSE 3000

# Kòmand pou lanse bot la
CMD ["node", "index.js"]
