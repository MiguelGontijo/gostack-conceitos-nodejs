const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid, v4, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function vldRepositoriesID (req, res, next){
const { id } = req.params;

  if (!validate(id)){
    return res.status(400).json({error: "Ivalid Repositories ID"});
  }

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0){
    return res.status(400).json( {error: "Repositories ID not found!"} );
  }
  
  return next();
}

app.use("/repositories/:id",vldRepositoriesID);

app.get("/repositories", (request, response) => {
  const { title, url, techs } = request.query;
  
  let results = title
    ? repositories.filter(repo => repo.title.includes(title) )
    : repositories 
  /* results = url
    ? repositories.filter(repo => repo.url.includes(url) )
    : repositories 
  results = techs
    ? repositories.filter(repo => repo.techs.includes(techs) )
    : repositories */

  return response.status(200).json( results );
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repo = { id:v4(),
                title,
                url,
                techs,
                likes: 0
              };
  
  repositories.push(repo);

  return response.status(200).json( repo );

});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0){
    return response.status(400).json( {error:"Repositorie ID not found!"} );
  }
  const repo = { id,
                  title,
                  url,
                  techs,
                  likes: repositories[repoIndex].likes
                };

  repositories[repoIndex] = repo 
  
  return response.status(200).json( repositories[repoIndex] );

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0){
    return response.status(400).json( {error: "Repositories ID not found!"} );
  }

  repositories.splice(repoIndex,1);

  return response.status(204).send();
});

app.post("/repositories/:id/like",vldRepositoriesID, (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0){
    return response.status(400).json( {error:"Repositorie ID not found!"} );
  }

  repositories[repoIndex].likes += 1;

  return response.status(200).json( repositories[repoIndex] );
});

module.exports = app;
