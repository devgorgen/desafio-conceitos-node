const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const repositories = [];
const likes = [];

const app = express();
app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateId, validateIfExistId);

function validateIfExistId(request, response, next) {
  const { id } = request.params;

  if (!repositories.find((value) => value.id == id)) {
    return response.status(400).json({ error: "ID not finded" });
  }
  return next();
}

function validateId(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid project ID." });
  }
  return next();
}

function getNumeberOfLikes(id) {
  const likesById = likes.filter((value) => value.id == id);
  if (likesById) {
    return likesById.length;
  }
  return 0;
}

function addNewLike(id) {
  const newLike = { id };
  likes.push(newLike);
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories/", (request, response) => {
  const { title, url, techs } = request.body;

  const newReposirory = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(newReposirory);

  response.status(200).json(newReposirory);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repository = repositories.find((value) => value.id == id);
  repositories[repositories.indexOf(repository)].title = title;
  repositories[repositories.indexOf(repository)].url = url;
  repositories[repositories.indexOf(repository)].techs = techs;

  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repository = repositories.find((value) => value.id == id);
  repositories.splice(repositories.indexOf(repository), 1);
  return response.status(204).json({ error: "Deleted successfully" });
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  addNewLike(id);
  const repository = repositories.find((value) => value.id == id);
  repositories[repositories.indexOf(repository)].likes = getNumeberOfLikes(id);
  return response.status(200).json(repository);
});

module.exports = app;
