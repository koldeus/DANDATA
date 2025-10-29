<?php

namespace App\Entity;

use App\Repository\VariableRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VariableRepository::class)]
class Variable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $nom = null;

    #[ORM\Column]
    private ?bool $num_string = null;

    #[ORM\ManyToOne(inversedBy: 'variables')]
    #[ORM\JoinColumn(nullable: false)]
    private ?metadonnees $Meta = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;

        return $this;
    }

    public function isNumString(): ?bool
    {
        return $this->num_string;
    }

    public function setNumString(bool $num_string): static
    {
        $this->num_string = $num_string;

        return $this;
    }

    public function getMeta(): ?metadonnees
    {
        return $this->Meta;
    }

    public function setMeta(?metadonnees $Meta): static
    {
        $this->Meta = $Meta;

        return $this;
    }
}
