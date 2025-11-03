<?php

namespace App\Entity;

use App\Repository\GraphiqueRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: GraphiqueRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(security: "is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Get(),
        new Put(security: "is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ]
)]
class Graphique
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:blocs', 'bloc:read', 'article:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:blocs', 'bloc:read', 'article:read'])]
    private ?string $Titre = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:blocs', 'bloc:read', 'article:read'])]
    private ?string $Type = null;

    #[ORM\ManyToOne(inversedBy: 'graphiques')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['article:blocs', 'bloc:read', 'article:read'])] 
    private ?Metadonnees $metadonnees = null;

    #[ORM\ManyToOne(inversedBy: 'graphiques')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Blocs $blocs = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getTitre(): ?string
    {
        return $this->Titre;
    }
    public function setTitre(string $Titre): self
    {
        $this->Titre = $Titre;
        return $this;
    }
    public function getType(): ?string
    {
        return $this->Type;
    }
    public function setType(string $Type): self
    {
        $this->Type = $Type;
        return $this;
    }
    public function getMetadonnees(): ?Metadonnees
    {
        return $this->metadonnees;
    }
    public function setMetadonnees(?Metadonnees $metadonnees): self
    {
        $this->metadonnees = $metadonnees;
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
}
