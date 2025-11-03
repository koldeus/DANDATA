<?php

namespace App\Entity;

use App\Repository\BlocsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BlocsRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(security: "is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Get(),
        new Put(security: "is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')")
    ]
)]
class Blocs
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:read', 'article:blocs', 'bloc:read'])] // ← Ajoutez article:read
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    #[Groups(['article:read', 'article:blocs', 'bloc:read'])] // ← Ajoutez article:read
    private ?string $type = null;

    #[ORM\Column]
    #[Groups(['article:read', 'article:blocs', 'bloc:read'])] // ← Ajoutez article:read
    private ?int $ordre = null;

    #[ORM\ManyToOne(inversedBy: 'blocs')]
    private ?Articles $article = null;

    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'blocs')]
    #[Groups(['article:read', 'article:blocs', 'bloc:read'])] // ← Ajoutez article:read
    private Collection $images;

    #[ORM\OneToMany(targetEntity: Graphique::class, mappedBy: 'blocs')]
    #[Groups(['article:read', 'article:blocs', 'bloc:read'])] // ← Ajoutez article:read
    private Collection $graphiques;

    #[ORM\OneToMany(targetEntity: Texte::class, mappedBy: 'blocs')]
    #[Groups(['article:read', 'article:blocs', 'bloc:read'])] // ← Ajoutez article:read
    private Collection $textes;

    #[ORM\OneToMany(targetEntity: Titre::class, mappedBy: 'blocs')]
    #[Groups(['article:read', 'article:blocs', 'bloc:read'])] // ← Ajoutez article:read
    private Collection $titres;
    public function __construct()
    {
        $this->images = new ArrayCollection();
        $this->graphiques = new ArrayCollection();
        $this->textes = new ArrayCollection();
        $this->titres = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getType(): ?string
    {
        return $this->type;
    }
    public function setType(string $type): self
    {
        $this->type = $type;
        return $this;
    }
    public function getOrdre(): ?int
    {
        return $this->ordre;
    }
    public function setOrdre(int $ordre): self
    {
        $this->ordre = $ordre;
        return $this;
    }
    public function getArticle(): ?Articles
    {
        return $this->article;
    }
    public function setArticle(?Articles $article): self
    {
        $this->article = $article;
        return $this;
    }

    public function getImages(): Collection
    {
        return $this->images;
    }
    public function addImage(Image $image): self
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setBlocs($this);
        }
        return $this;
    }
    public function removeImage(Image $image): self
    {
        if ($this->images->removeElement($image)) {
            if ($image->getBlocs() === $this)
                $image->setBlocs(null);
        }
        return $this;
    }

    public function getGraphiques(): Collection
    {
        return $this->graphiques;
    }
    public function addGraphique(Graphique $graphique): self
    {
        if (!$this->graphiques->contains($graphique)) {
            $this->graphiques->add($graphique);
            $graphique->setBlocs($this);
        }
        return $this;
    }
    public function removeGraphique(Graphique $graphique): self
    {
        if ($this->graphiques->removeElement($graphique)) {
            if ($graphique->getBlocs() === $this)
                $graphique->setBlocs(null);
        }
        return $this;
    }

    public function getTextes(): Collection
    {
        return $this->textes;
    }
    public function addTexte(Texte $texte): self
    {
        if (!$this->textes->contains($texte)) {
            $this->textes->add($texte);
            $texte->setBlocs($this);
        }
        return $this;
    }
    public function removeTexte(Texte $texte): self
    {
        if ($this->textes->removeElement($texte)) {
            if ($texte->getBlocs() === $this)
                $texte->setBlocs(null);
        }
        return $this;
    }

    public function getTitres(): Collection
    {
        return $this->titres;
    }
    public function addTitre(Titre $titre): self
    {
        if (!$this->titres->contains($titre)) {
            $this->titres->add($titre);
            $titre->setBlocs($this);
        }
        return $this;
    }
    public function removeTitre(Titre $titre): self
    {
        if ($this->titres->removeElement($titre)) {
            if ($titre->getBlocs() === $this)
                $titre->setBlocs(null);
        }
        return $this;
    }
}
