<?php

namespace App\Entity;

use App\Repository\TexteRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: TexteRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(security: "is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Get(),
        new Put(security: "is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ]
)]
class Texte
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:blocs', 'article:read', 'article:write', 'bloc:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 4096)]
    #[Groups(['article:blocs', 'article:read', 'article:write', 'bloc:read'])]
    private ?string $texte = null;

    #[ORM\ManyToOne(inversedBy: 'textes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Blocs $blocs = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function gettexte(): ?string
    {
        return $this->texte;
    }
    public function settexte(string $texte): self
    {
        $this->texte = $texte;
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
