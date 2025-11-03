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
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[ORM\Entity(repositoryClass: ImageRepository::class)]
#[Vich\Uploadable] // ✅ important pour activer l’upload
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
    #[Groups(['article:blocs', 'article:read', 'article:list'])]
    private ?int $id = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['article:blocs', 'article:read', 'article:list'])]
    private ?string $fileName = null;

    #[Vich\UploadableField(mapping: 'image_file', fileNameProperty: 'fileName')] // ✅ mapping image_file
    #[Groups(['article:write'])]
    private ?File $file = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:blocs', 'article:read', 'article:list'])]
    private ?string $alt = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:blocs', 'article:read', 'article:read'])]
    private ?string $slug = null;

    #[ORM\ManyToOne(inversedBy: 'images')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Blocs $blocs = null;

    #[ORM\OneToMany(targetEntity: Articles::class, mappedBy: 'Image_Principale')]
    private Collection $articles;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null; 
    public function __construct()
    {
        $this->articles = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFileName(): ?string
    {
        return $this->fileName;
    }
    public function setFileName(?string $fileName): self
    {
        $this->fileName = $fileName;
        return $this;
    }

    public function setFile(?File $file = null): void
    {
        $this->file = $file;
        if ($file) {
            $this->updatedAt = new \DateTimeImmutable();
        }
    }
    public function getFile(): ?File
    {
        return $this->file;
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
        return $this->slug;
    }
    public function setSlug(string $slug): self
    {
        $this->slug = $slug;
        return $this;
    }


    public function getBlocs(): ?Blocs
    {
        return $this->blocs;
    }
    public function setBlocs(?Blocs $blocs): self
    {
        $this->blocs = $blocs;
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
        if ($this->articles->removeElement($article) && $article->getImagePrincipale() === $this)
            $article->setImagePrincipale(null);
        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): self
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    #[Groups(['article:blocs', 'article:read', 'article:list'])]
    public function getUrl(): ?string
    {
        return $this->fileName ? '/uploads/images/' . $this->fileName : null;
    }
}
