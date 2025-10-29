<?php

namespace App\Entity;

use App\Repository\MetadonneesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;

#[ORM\Entity(repositoryClass: MetadonneesRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(security: "is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_ADMIN')"),
        new Get(),
        new Put(security: "is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ]
)]
class Metadonnees
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $url = null;

    #[ORM\Column]
    private ?bool $api_fichier = null;

    #[ORM\Column(length: 50)]
    private ?string $extension_retour = null;

    #[ORM\OneToMany(targetEntity: Variable::class, mappedBy: 'Meta', cascade: ['persist', 'remove'])]
    private Collection $variables;

    #[ORM\OneToMany(targetEntity: Graphique::class, mappedBy: 'Metadonnees', cascade: ['persist', 'remove'])]
    private Collection $graphiques;

    public function __construct()
    {
        $this->variables = new ArrayCollection();
        $this->graphiques = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    public function getUrl(): ?string
    {
        return $this->url;
    }
    public function setUrl(string $url): self
    {
        $this->url = $url;
        return $this;
    }
    public function isApiFichier(): ?bool
    {
        return $this->api_fichier;
    }
    public function setApiFichier(bool $api_fichier): self
    {
        $this->api_fichier = $api_fichier;
        return $this;
    }
    public function getExtensionRetour(): ?string
    {
        return $this->extension_retour;
    }
    public function setExtensionRetour(string $extension_retour): self
    {
        $this->extension_retour = $extension_retour;
        return $this;
    }

    public function getVariables(): Collection
    {
        return $this->variables;
    }
    public function addVariable(Variable $variable): self
    {
        if (!$this->variables->contains($variable)) {
            $this->variables->add($variable);
            $variable->setMeta($this);
        }
        return $this;
    }
    public function removeVariable(Variable $variable): self
    {
        if ($this->variables->removeElement($variable)) {
            if ($variable->getMeta() === $this)
                $variable->setMeta(null);
        }
        return $this;
    }

    public function getGraphiques(): Collection
    {
        return $this->graphiques;
    }
    public function addGraphique(Graphique $graphique): self
    {
        if (!$this->graphiques->contains($graphique)) {
            $this->graphiques->add($graphique);
            $graphique->setMetadonnees($this);
        }
        return $this;
    }
    public function removeGraphique(Graphique $graphique): self
    {
        if ($this->graphiques->removeElement($graphique)) {
            if ($graphique->getMetadonnees() === $this)
                $graphique->setMetadonnees(null);
        }
        return $this;
    }
}
