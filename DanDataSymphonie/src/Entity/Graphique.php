<?php

namespace App\Entity;

use App\Repository\GraphiqueRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: GraphiqueRepository::class)]
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
    private ?Metadonnees $Metadonnées = null;

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

    public function setTitre(string $Titre): static
    {
        $this->Titre = $Titre;

        return $this;
    }

    public function getType(): ?string
    {
        return $this->Type;
    }

    public function setType(string $Type): static
    {
        $this->Type = $Type;

        return $this;
    }

    public function getMetadonnées(): ?Metadonnees
    {
        return $this->Metadonnées;
    }

    public function setMetadonnées(?Metadonnees $Metadonnées): static
    {
        $this->Metadonnées = $Metadonnées;

        return $this;
    }

    public function getBlocs(): ?Blocs
    {
        return $this->Blocs;
    }

    public function setBlocs(?Blocs $Blocs): static
    {
        $this->Blocs = $Blocs;

        return $this;
    }
}
