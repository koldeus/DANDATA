<?php

namespace App\Entity;

use App\Repository\MetadonneesRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: MetadonneesRepository::class)]
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

    /**
     * @var Collection<int, Variable>
     */
    #[ORM\OneToMany(targetEntity: Variable::class, mappedBy: 'Meta')]
    private Collection $variables;

    /**
     * @var Collection<int, Graphique>
     */
    #[ORM\OneToMany(targetEntity: Graphique::class, mappedBy: 'Metadonnées')]
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

    public function setUrl(string $url): static
    {
        $this->url = $url;

        return $this;
    }

    public function isApiFichier(): ?bool
    {
        return $this->api_fichier;
    }

    public function setApiFichier(bool $api_fichier): static
    {
        $this->api_fichier = $api_fichier;

        return $this;
    }

    public function getExtensionRetour(): ?string
    {
        return $this->extension_retour;
    }

    public function setExtensionRetour(string $extension_retour): static
    {
        $this->extension_retour = $extension_retour;

        return $this;
    }

    /**
     * @return Collection<int, Variable>
     */
    public function getVariables(): Collection
    {
        return $this->variables;
    }

    public function addVariable(Variable $variable): static
    {
        if (!$this->variables->contains($variable)) {
            $this->variables->add($variable);
            $variable->setMeta($this);
        }

        return $this;
    }

    public function removeVariable(Variable $variable): static
    {
        if ($this->variables->removeElement($variable)) {
            // set the owning side to null (unless already changed)
            if ($variable->getMeta() === $this) {
                $variable->setMeta(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Graphique>
     */
    public function getGraphiques(): Collection
    {
        return $this->graphiques;
    }

    public function addGraphique(Graphique $graphique): static
    {
        if (!$this->graphiques->contains($graphique)) {
            $this->graphiques->add($graphique);
            $graphique->setMetadonnées($this);
        }

        return $this;
    }

    public function removeGraphique(Graphique $graphique): static
    {
        if ($this->graphiques->removeElement($graphique)) {
            // set the owning side to null (unless already changed)
            if ($graphique->getMetadonnées() === $this) {
                $graphique->setMetadonnées(null);
            }
        }

        return $this;
    }
}
