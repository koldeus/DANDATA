<?php

namespace App\Entity;

use App\Repository\TitreRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;

#[ORM\Entity(repositoryClass: TitreRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(security: "is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Get(),
        new Put(security: "is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ]
)]
class Titre
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $Titre = null;

    #[ORM\Column]
    private ?int $Niveau = null;

    #[ORM\ManyToOne(inversedBy: 'titres')]
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
    public function getNiveau(): ?int
    {
        return $this->Niveau;
    }
    public function setNiveau(int $Niveau): self
    {
        $this->Niveau = $Niveau;
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
