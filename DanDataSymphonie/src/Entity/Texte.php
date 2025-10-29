<?php

namespace App\Entity;

use App\Repository\TexteRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TexteRepository::class)]
class Texte
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $titre = null;

    #[ORM\ManyToOne(inversedBy: 'textes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Blocs $Blocs = null;

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
