<?php

namespace App\Entity;

use App\Repository\BlocsRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BlocsRepository::class)]
class Blocs
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 20)]
    private ?string $type = null;

    #[ORM\Column]
    private ?int $ordre = null;

    #[ORM\ManyToOne(inversedBy: 'blocs')]
    private ?Articles $article = null;

    /**
     * @var Collection<int, Image>
     */
    #[ORM\OneToMany(targetEntity: Image::class, mappedBy: 'Blocs')]
    private Collection $images;

    /**
     * @var Collection<int, Graphique>
     */
    #[ORM\OneToMany(targetEntity: Graphique::class, mappedBy: 'Blocs')]
    private Collection $graphiques;

    /**
     * @var Collection<int, Texte>
     */
    #[ORM\OneToMany(targetEntity: Texte::class, mappedBy: 'Blocs')]
    private Collection $textes;

    /**
     * @var Collection<int, Titre>
     */
    #[ORM\OneToMany(targetEntity: Titre::class, mappedBy: 'Blocs')]
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

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getOrdre(): ?int
    {
        return $this->ordre;
    }

    public function setOrdre(int $ordre): static
    {
        $this->ordre = $ordre;

        return $this;
    }

    public function getArticle(): ?Articles
    {
        return $this->article;
    }

    public function setArticle(?Articles $article): static
    {
        $this->article = $article;

        return $this;
    }

    /**
     * @return Collection<int, Image>
     */
    public function getImages(): Collection
    {
        return $this->images;
    }

    public function addImage(Image $image): static
    {
        if (!$this->images->contains($image)) {
            $this->images->add($image);
            $image->setBlocs($this);
        }

        return $this;
    }

    public function removeImage(Image $image): static
    {
        if ($this->images->removeElement($image)) {
            // set the owning side to null (unless already changed)
            if ($image->getBlocs() === $this) {
                $image->setBlocs(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Graphique>
     */
    public function getGraphiques(): Collection
    {
        return $this->graphiques;
    }

    public function addGraphique(Graphique $graphique): static
    {
        if (!$this->graphiques->contains($graphique)) {
            $this->graphiques->add($graphique);
            $graphique->setBlocs($this);
        }

        return $this;
    }

    public function removeGraphique(Graphique $graphique): static
    {
        if ($this->graphiques->removeElement($graphique)) {
            // set the owning side to null (unless already changed)
            if ($graphique->getBlocs() === $this) {
                $graphique->setBlocs(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Texte>
     */
    public function getTextes(): Collection
    {
        return $this->textes;
    }

    public function addTexte(Texte $texte): static
    {
        if (!$this->textes->contains($texte)) {
            $this->textes->add($texte);
            $texte->setBlocs($this);
        }

        return $this;
    }

    public function removeTexte(Texte $texte): static
    {
        if ($this->textes->removeElement($texte)) {
            // set the owning side to null (unless already changed)
            if ($texte->getBlocs() === $this) {
                $texte->setBlocs(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Titre>
     */
    public function getTitres(): Collection
    {
        return $this->titres;
    }

    public function addTitre(Titre $titre): static
    {
        if (!$this->titres->contains($titre)) {
            $this->titres->add($titre);
            $titre->setBlocs($this);
        }

        return $this;
    }

    public function removeTitre(Titre $titre): static
    {
        if ($this->titres->removeElement($titre)) {
            // set the owning side to null (unless already changed)
            if ($titre->getBlocs() === $this) {
                $titre->setBlocs(null);
            }
        }

        return $this;
    }
}
