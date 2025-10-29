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
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Titre = null;

    #[ORM\Column(length: 255)]
    private ?string $Type = null;

    #[ORM\ManyToOne(inversedBy: 'graphiques')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Metadonnees $metadonnees_id = null;

    #[ORM\ManyToOne(inversedBy: 'graphiques')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Blocs $Blocs = null;

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
        return $this->metadonnees_id;
    }
    public function setMetadonnees(?Metadonnees $metadonnees_id): self
    {
        $this->metadonnees_id = $metadonnees_id;
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
}
