<?php

namespace App\Entity;

use App\Repository\ThemeRepository;
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

#[ORM\Entity(repositoryClass: ThemeRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(security: "is_granted('ROLE_DESIGNER') or is_granted('ROLE_ADMIN')"),
        new Get(),
        new Put(security: "is_granted('ROLE_DESIGNER') or is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ]
)]
class Theme
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:read' ,'site:list'])]

    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Groups(['article:read','site:list'])]

    private ?string $Nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read','site:list'])]
    private ?string $Slug = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read','site:list'])]
    private ?string $Link = null;

    #[ORM\OneToMany(targetEntity: Site::class, mappedBy: 'Theme')]
    // Pas de Groups
    private Collection $sites;

    #[ORM\OneToMany(targetEntity: Articles::class, mappedBy: 'theme')]
    // Pas de Groups (référence circulaire)
    private Collection $articles;

    public function __construct()
    {
        $this->sites = new ArrayCollection();
        $this->articles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getNom(): ?string
    {
        return $this->Nom;
    }
    public function setNom(string $Nom): self
    {
        $this->Nom = $Nom;
        return $this;
    }
    public function getSlug(): ?string
    {
        return $this->Slug;
    }
    public function setSlug(string $Slug): self
    {
        $this->Slug = $Slug;
        return $this;
    }
    public function getLink(): ?string
    {
        return $this->Link;
    }
    public function setLink(string $Link): self
    {
        $this->Link = $Link;
        return $this;
    }

    public function getSites(): Collection
    {
        return $this->sites;
    }
    public function addSite(Site $site): self
    {
        if (!$this->sites->contains($site)) {
            $this->sites->add($site);
            $site->setTheme($this);
        }
        return $this;
    }
    public function removeSite(Site $site): self
    {
        if ($this->sites->removeElement($site)) {
            if ($site->getTheme() === $this)
                $site->setTheme(null);
        }
        return $this;
    }

    public function getArticles(): Collection
    {
        return $this->articles;
    }
    public function addArticle(Articles $article): self
    {
        if (!$this->articles->contains($article)) {
            $this->articles->add($article);
            $article->setTheme($this);
        }
        return $this;
    }
    public function removeArticle(Articles $article): self
    {
        if ($this->articles->removeElement($article)) {
            if ($article->getTheme() === $this)
                $article->setTheme(null);
        }
        return $this;
    }
}
