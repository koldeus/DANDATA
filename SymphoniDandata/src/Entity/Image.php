<?php

namespace App\Entity;

use App\Repository\ImageRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(security: "is_granted('ROLE_DESIGNER') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Get(),
        new Put(security: "is_granted('ROLE_DESIGNER') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ]
)]
class Image
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $url = null;

    #[ORM\Column(length: 255)]
    private ?string $alt = null;

    #[ORM\Column(length: 255)]
    private ?string $Slug = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Blocs $Blocs = null;

    #[ORM\OneToMany(targetEntity: Articles::class, mappedBy: 'Image_Principale')]
    private Collection $articles;

    public function __construct()
    {
        $this->articles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getUrl(): ?string
    {
        return $this->url;
    }
    public function setUrl(string $url): self
    {
        $this->url = $url;
        return $this;
    }
    public function getAlt(): ?string
    {
        return $this->alt;
    }
    public function setAlt(string $alt): self
    {
        $this->alt = $alt;
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
    public function getBlocs(): ?Blocs
    {
        return $this->Blocs;
    }
    public function setBlocs(?Blocs $Blocs): self
    {
        $this->Blocs = $Blocs;
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
            $article->setImagePrincipale($this);
        }
        return $this;
    }
    public function removeArticle(Articles $article): self
    {
        if ($this->articles->removeElement($article)) {
            if ($article->getImagePrincipale() === $this)
                $article->setImagePrincipale(null);
        }
        return $this;
    }
}
