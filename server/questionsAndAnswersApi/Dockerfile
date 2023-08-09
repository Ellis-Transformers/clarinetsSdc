FROM node:16

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install
COPY . .

ENV PORT=3000
EXPOSE 3000
RUN npx prisma generate

CMD [ "npm","run","deploy" ]