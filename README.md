# NestJs-User-CRUD

### Pt-br:
## **Descrição:**
Essa aplicação é uma API RESTful para um CRUD de usuários. Nela você pode se cadastrar como novo usuário, fazer login e, caso seja administrador, pode ter acesso ao CRUD de perfil e também manipular outros usuários.

## **Objetivo:**
Criei esse pequeno projeto para aprender sobre **NestJS**.  
Também utilizei de outras ferramentas como TypeORM, Docker, Docker-compose, nest-winston, @nestjs/swagger, @nestjs/jwt e @nestjs/passport. Algumas dessas ferramentas eu já conhecia, mas quis praticar mais. Outras delas fui aprendendo um pouco durante o desenvolvimento.  
O banco de dados usado foi o Postgres.
## **Instalação:**
Os pré-requisitos para rodar essa aplicação são Docker e Docker-compose. Caso não tenha instalado os seguintes links podem te ajudar:
- Instalação do Docker: https://docs.docker.com/engine/install/
- Instalação do Docker-compose: https://docs.docker.com/compose/install/

Para gerar as imagens dos containers rode `docker-compose build`.  
Depois disso, rode `docker-compose up` para rodar os containers no terminal atual.  
  
*Observação:* O comando no Dockerfile da API roda o comando `npm run start:dev`. Caso queira rodar de maneira diferente interrompa o container da aplicação e rode pelo próprio npm.

## **Uso:**
### **Cadastro de usuários**
Para se **cadastrar** como novo usuário comum faça uma requisição HTTP com método POST para o endpoint de `/auth/signup` passando um json com as seguintes informações:
```json
{
  "name": "Seu nome de usuário",
  "email": "seu-email@example.com",
  "password": "sua-senha",
  "passwordConfirmation": "sua-senha",
  "profiles": [
    { "id": "uuid-do-perfil", 
      "description": "descrição do perfil"
    }
  ]
}
```  

### **Login**
Para fazer **login** com seu usuário faça uma requisição POST para o endpoint `/auth/signin` passando um JSON com _'email'_ e _'password'_.
  

### **Permissão para operar o CRUD de usuários**
Cada usuário tem um atributo `'role'` que define se ele é usuário comum (`'USER'`) ou administrador (`'ADMIN'`).  
Apenas um administrador tem autorização para usar endpoints como `user/*`. Os métodos para esses endpoints estão definidos em `src/user/user.controller.ts` e também podem ser vistos pelo swagger.
### **Testes unitários**
Para rodar os testes unitários use o comando `npm run test`.  

### **Swagger**  
Essa aplicação também tem swagger rodando no endpoint `/swagger`. Nela você consegue ver os métodos definidos para cada endpoint. Porém, não foi totalmente configurado então não haverá o "template" do JSON a ser enviado ou a resposta esperada.  

---
En: