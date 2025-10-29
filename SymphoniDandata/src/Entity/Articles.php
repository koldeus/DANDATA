<?php

namespace App\Entity;

use App\Repository\ArticlesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;

#[ORM\Entity(repositoryClass: ArticlesRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(security: "is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Get(),
        new Put(security: "object.getAuteur() == user or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Delete(security: "object.getAuteur() == user or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['slug'])]

class Articles
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(length: 255)]
    private ?string $slug = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $resume = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $auteur = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Theme $theme = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    private ?Categorie $categorie = null;

    #[ORM\OneToMany(targetEntity: Blocs::class, mappedBy: 'article')]
    private Collection $blocs;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    private ?Image $imagePrincipale = null;

    #[ORM\OneToMany(mappedBy: 'article', targetEntity: ArticleNote::class, cascade: ['persist', 'remove'])]
    private Collection $articleNotes;

    public function __construct()
    {
        $this->blocs = new ArrayCollection();
        $this->articleNotes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getTitre(): ?string
    {
        return $this->titre;
    }
    public function setTitre(string $titre): self
    {
        $this->titre = $titre;
        return $this;
    }
    public function getSlug(): ?string
    {
        return $this->slug;
    }
    public function setSlug(string $slug): self
    {
        $this->slug = $slug;
        return $this;
    }
    public function getResume(): ?string
    {
        return $this->resume;
    }
    public function setResume(?string $resume): self
    {
        $this->resume = $resume;
        return $this;
    }

    public function getAuteur(): ?User
    {
        return $this->auteur;
    }
    public function setAuteur(?User $auteur): self
    {
        $this->auteur = $auteur;
        return $this;
    }

    public function getTheme(): ?Theme
    {
        return $this->theme;
    }
    public function setTheme(?Theme $theme): self
    {
        $this->theme = $theme;
        return $this;
    }

    public function getCategorie(): ?Categorie
    {
        return $this->categorie;
    }
    public function setCategorie(?Categorie $categorie): self
    {
        $this->categorie = $categorie;
        return $this;
    }

    public function getBlocs(): Collection
    {
        return $this->blocs;
    }
    public function addBloc(Blocs $bloc): self
    {
        if (!$this->blocs->contains($bloc)) {
            $this->blocs->add($bloc);
            $bloc->setArticle($this);
        }
        return $this;
    }
    public function removeBloc(Blocs $bloc): self
    {
        if ($this->blocs->removeElement($bloc)) {
            if ($bloc->getArticle() === $this)
                $bloc->setArticle(null);
        }
        return $this;
    }

    public function getImagePrincipale(): ?Image
    {
        return $this->imagePrincipale;
    }
    public function setImagePrincipale(?Image $imagePrincipale): self
    {
        $this->imagePrincipale = $imagePrincipale;
        return $this;
    }

    public function getArticleNotes(): Collection
    {
        return $this->articleNotes;
    }
    public function addArticleNote(ArticleNote $note): self
    {
        if (!$this->articleNotes->contains($note)) {
            $this->articleNotes->add($note);
            $note->setArticle($this);
        }
        return $this;
    }
    public function removeArticleNote(ArticleNote $note): self
    {
        if ($this->articleNotes->removeElement($note)) {
            if ($note->getArticle() === $this)
                $note->setArticle(null);
        }
        return $this;
    }
}
