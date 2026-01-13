<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use App\Repository\VariableRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;

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
    #[Groups(['article:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read'])]
    private ?string $nom = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read'])]
    private ?string $color = null;

    #[ORM\Column]
    #[Groups(['article:read'])]
    private ?bool $num_string = null;

    #[ORM\ManyToOne(inversedBy: 'variables')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Metadonnees $Meta = null;

    #[ORM\ManyToMany(targetEntity: Graphique::class, mappedBy: 'variables')]
    #[Groups(['article:read'])]
    private Collection $graphiques;

    public function __construct()
    {
        $this->graphiques = new ArrayCollection();
    }
    public function getGraphiques(): Collection
    {
        return $this->graphiques;
    }

    public function addGraphique(Graphique $graphique): self
    {
        if (!$this->graphiques->contains($graphique)) {
            $this->graphiques->add($graphique);
            $graphique->addVariable($this);
        }
        return $this;
    }

    public function removeGraphique(Graphique $graphique): self
    {
        if ($this->graphiques->removeElement($graphique)) {
            $graphique->removeVariable($this);
        }
        return $this;
    }
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
    public function getColor(): ?string
    {
        return $this->color;
    }
    public function setColor(string $Color): self
    {
        $this->color = $Color;
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
