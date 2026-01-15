// URL: http://localhost:8000/api/articles
// Method: POST
// Headers: Content-Type: application/json, Authorization: Bearer {token}

{
  "titre": "Mon premier article",
  "resume": "Ceci est le résumé de mon article",
  "theme": "/api/themes/1",
  "imagePrincipale": "/api/images/1",
  "blocs": [
    {
      "type": "titre",
      "ordre": 1,
      "texte": "Introduction",
      "niveau": 2
    },
    {
      "type": "texte",
      "ordre": 2,
      "texte": "Voici le contenu du texte"
    },
    {
      "type": "image",
      "ordre": 3,
      "images": ["/api/images/2"]
    },
    {
      "type": "graphique",
      "ordre": 4,
      "graphique": {
        "type": "bar",
        "metadonnees": "/api/metadonnees/1",
        "variables": ["/api/variables/1", "/api/variables/2"]
      }
    }
  ]
}

// Response (201 Created):
{
  "id": 1,
  "titre": "Mon premier article",
  "slug": "mon-premier-article",
  "resume": "Ceci est le résumé de mon article",
  "message": "Article créé avec succès"
}
