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
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\Link;

#[ORM\Entity(repositoryClass: ArticlesRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(
            normalizationContext: ['groups' => ['article:list']]
        ),
        new Post(
            security: "is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')",
            denormalizationContext: ['groups' => ['article:write']]
        ),
        new Get(
            uriTemplate: '/articles/{slug}',
            uriVariables: [
                'slug' => new Link(fromClass: Articles::class, identifiers: ['slug'])
            ],
            normalizationContext: ['groups' => ['article:read']]
        ),
        new Put(
            security: "object.getAuteur() == user or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')",
            denormalizationContext: ['groups' => ['article:write']]
        ),
        new Delete(
            security: "object.getAuteur() == user or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"
        ),
    ]
)]
#[ApiFilter(SearchFilter::class, properties: ['slug' => 'exact'])]
class Articles
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:read', 'article:list'])] 
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read', 'article:list', 'article:write'])] 
    private ?string $titre = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Groups(['article:read', 'article:list', 'article:write'])]
    private ?string $slug = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['article:read', 'article:list', 'article:write'])] 
    private ?string $resume = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['article:read', 'article:list', 'article:write'])]
    private ?User $auteur = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['article:read', 'article:list', 'article:write'])]
    private ?Theme $theme = null;

    #[ORM\ManyToMany(targetEntity: Categorie::class, inversedBy: 'articles')]
    #[ORM\JoinTable(name: 'articles_categories')]
    #[Groups(['article:read', 'article:list', 'article:write'])]
    private Collection $categories;

    #[ORM\OneToMany(targetEntity: Blocs::class, mappedBy: 'article')]
    #[Groups(['article:read'])]
    private Collection $blocs;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[Groups(['article:read', 'article:list', 'article:write'])]
    private ?Image $imagePrincipale = null;

    #[ORM\OneToMany(mappedBy: 'article', targetEntity: ArticleNote::class, cascade: ['persist', 'remove'])]
    #[Groups(['article:read'])] 
    private Collection $articleNotes;

    public function __construct()
    {
        $this->blocs = new ArrayCollection();
        $this->articleNotes = new ArrayCollection();
        $this->categories = new ArrayCollection();
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

    public function getCategories(): Collection
    {
        return $this->categories;
    }

    public function addCategorie(Categorie $categorie): self
    {
        if (!$this->categories->contains($categorie)) {
            $this->categories->add($categorie);
        }
        return $this;
    }

    public function removeCategorie(Categorie $categorie): self
    {
        $this->categories->removeElement($categorie);
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
    #[Groups(['article:read', 'article:list'])] 
    public function getMoyenneNotes(): ?float
    {
        if ($this->articleNotes->isEmpty()) {
            return null;
        }

        $total = 0;
        $count = 0;

        foreach ($this->articleNotes as $note) {
            $total += $note->getNote(); 
            $count++;
        }

        return $count > 0 ? round($total / $count, 2) : null;
    }


    #[Groups(['article:read', 'article:list'])] 
    public function getNombreNotes(): int
    {
        return $this->articleNotes->count();
    }

    public function addCategory(Categorie $category): static
    {
        if (!$this->categories->contains($category)) {
            $this->categories->add($category);
        }

        return $this;
    }

    public function removeCategory(Categorie $category): static
    {
        $this->categories->removeElement($category);

        return $this;
    }
}
