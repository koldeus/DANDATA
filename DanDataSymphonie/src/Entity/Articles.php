<?php

namespace App\Entity;

use App\Repository\ArticlesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ArticlesRepository::class)]
class Articles
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\Column(length: 255)]
    private ?string $Slug = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $Resume = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?user $auteur = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?theme $theme = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    private ?categorie $categorie = null;

    /**
     * @var Collection<int, Blocs>
     */
    #[ORM\OneToMany(targetEntity: Blocs::class, mappedBy: 'article')]
    private Collection $blocs;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    private ?image $Image_Principale = null;

    public function __construct()
    {
        $this->blocs = new ArrayCollection();
        $this->users = new ArrayCollection();
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

    public function setTitre(string $titre): static
    {
        $this->titre = $titre;

        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->Slug;
    }

    public function setSlug(string $Slug): static
    {
        $this->Slug = $Slug;

        return $this;
    }

    public function getResume(): ?string
    {
        return $this->Resume;
    }

    public function setResume(?string $Resume): static
    {
        $this->Resume = $Resume;

        return $this;
    }

    public function getAuteur(): ?user
    {
        return $this->auteur;
    }

    public function setAuteur(?user $auteur): static
    {
        $this->auteur = $auteur;

        return $this;
    }

    public function getTheme(): ?theme
    {
        return $this->theme;
    }

    public function setTheme(?theme $theme): static
    {
        $this->theme = $theme;

        return $this;
    }

    public function getCategorie(): ?categorie
    {
        return $this->categorie;
    }

    public function setCategorie(?categorie $categorie): static
    {
        $this->categorie = $categorie;

        return $this;
    }

    /**
     * @return Collection<int, Blocs>
     */
    public function getBlocs(): Collection
    {
        return $this->blocs;
    }

    public function addBloc(Blocs $bloc): static
    {
        if (!$this->blocs->contains($bloc)) {
            $this->blocs->add($bloc);
            $bloc->setArticle($this);
        }

        return $this;
    }

    public function removeBloc(Blocs $bloc): static
    {
        if ($this->blocs->removeElement($bloc)) {
            // set the owning side to null (unless already changed)
            if ($bloc->getArticle() === $this) {
                $bloc->setArticle(null);
            }
        }

        return $this;
    }

    public function getImagePrincipale(): ?image
    {
        return $this->Image_Principale;
    }

    public function setImagePrincipale(?image $Image_Principale): static
    {
        $this->Image_Principale = $Image_Principale;

        return $this;
    }

    #[ORM\OneToMany(mappedBy: 'article', targetEntity: ArticleNote::class, cascade: ['persist', 'remove'])]
    private $articleNotes;


    public function getArticleNotes(): Collection
    {
        return $this->articleNotes;
    }

    public function addArticleNote(ArticleNote $articleNote): self
    {
        if (!$this->articleNotes->contains($articleNote)) {
            $this->articleNotes[] = $articleNote;
            $articleNote->setArticle($this);
        }
        return $this;
    }

    public function removeArticleNote(ArticleNote $articleNote): self
    {
        if ($this->articleNotes->removeElement($articleNote)) {
            if ($articleNote->getArticle() === $this) {
                $articleNote->setArticle(null);
            }
        }
        return $this;
    }

}
