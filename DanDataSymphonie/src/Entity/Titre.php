<?php

namespace App\Entity;

use App\Repository\TitreRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TitreRepository::class)]
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

    public function setTitre(string $Titre): static
    {
        $this->Titre = $Titre;

        return $this;
    }

    public function getNiveau(): ?int
    {
        return $this->Niveau;
    }

    public function setNiveau(int $Niveau): static
    {
        $this->Niveau = $Niveau;

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
