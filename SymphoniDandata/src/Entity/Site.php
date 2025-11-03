<?php

namespace App\Entity;

use App\Repository\SiteRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: SiteRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(normalizationContext: ['groups' => ['site:list']]),
        new Post(
            security: "is_granted('ROLE_DESIGNER') or is_granted('ROLE_ADMIN')",
            denormalizationContext: ['groups' => ['site:write']]
        ),
        new Get(),
        new Put(
            security: "is_granted('ROLE_DESIGNER') or is_granted('ROLE_ADMIN')",
            denormalizationContext: ['groups' => ['site:write']]
        ),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ]
)]

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
    #[Groups(['site:list', 'site:write'])]

    private ?Theme $Theme = null;

    #[ORM\ManyToOne(inversedBy: 'sites')]
    private ?User $Admin = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getNom(): ?string
    {
        return $this->Nom;
    }
    public function setNom(string $Nom): self
    {
        $this->Nom = $Nom;
        return $this;
    }
    public function getTheme(): ?Theme
    {
        return $this->Theme;
    }
    public function setTheme(?Theme $Theme): self
    {
        $this->Theme = $Theme;
        return $this;
    }
    public function getAdmin(): ?User
    {
        return $this->Admin;
    }
    public function setAdmin(?User $Admin): self
    {
        $this->Admin = $Admin;
        return $this;
    }
}
