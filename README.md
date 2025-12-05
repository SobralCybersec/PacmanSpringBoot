# Pacman Game - Spring Boot

<img src="https://i.imgur.com/511xZBb.png" width="800">

## Stack Utilizadas

- Spring Boot 3.2.0 (Back-end)
- H2 Database (Banco de Dados em Memória)
- JPA/Hibernate (ORM)
- Thymeleaf (Template Engine)
- HTML/CSS/JavaScript (Front-end)

## Pré-requisitos

- Java 17+
- Maven 3.6+

## Executar o projeto

```bash
mvn spring-boot:run
```

## Acessar a aplicação

- **Jogo**: http://localhost:8080
- **Console H2**: http://localhost:8080/h2-console
  - JDBC URL: `jdbc:h2:mem:pacmandb`
  - Username: `sa`
  - Password: (deixe em branco)

## Controles

- **Setas** ou **WASD** para mover o Pacman
- Digite seu nome no campo acima do jogo
- Coma a cereja vermelha para ativar o power-up

## API REST

### Salvar Score
```bash
POST /api/scores
Content-Type: application/json

{
  "playerName": "Nome",
  "score": 150
}
```

### Buscar Top Scores
```bash
GET /api/scores
```