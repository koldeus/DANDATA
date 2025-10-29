<?php

namespace App\Entity;

use App\Repository\VariableRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;

#[ORM\Entity(repositoryClass: VariableRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(security: "is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_ADMIN')"),
        new Get(),
        new Put(security: "is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ]
)]
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
    private ?Metadonnees $Meta = null;

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getNom(): ?string
    {
        return $this->nom;
    }
    public function setNom(string $nom): self
    {
        $this->nom = $nom;
        return $this;
    }
    public function isNumString(): ?bool
    {
        return $this->num_string;
    }
    public function setNumString(bool $num_string): self
    {
        $this->num_string = $num_string;
        return $this;
    }
    public function getMeta(): ?Metadonnees
    {
        return $this->Meta;
    }
    public function setMeta(?Metadonnees $Meta): self
    {
        $this->Meta = $Meta;
        return $this;
    }
}
