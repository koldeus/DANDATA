<?php

namespace App\Entity;

use App\Repository\SiteRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SiteRepository::class)]
class Site
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    private ?string $Nom = null;

    #[ORM\ManyToOne(inversedBy: 'sites')]
    #[ORM\JoinColumn(nullable: false)]
    private ?theme $Theme = null;

    #[ORM\ManyToOne(inversedBy: 'sites')]
    private ?user $Admin = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNom(): ?string
    {
        return $this->Nom;
    }

    public function setNom(string $Nom): static
    {
        $this->Nom = $Nom;

        return $this;
    }

    public function getTheme(): ?theme
    {
        return $this->Theme;
    }

    public function setTheme(?theme $Theme): static
    {
        $this->Theme = $Theme;

        return $this;
    }

    public function getAdmin(): ?user
    {
        return $this->Admin;
    }

    public function setAdmin(?user $Admin): static
    {
        $this->Admin = $Admin;

        return $this;
    }
}
