<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{

    public const ROLE_VISITOR = 'ROLE_VISITOR'; // Visionnaire
    public const ROLE_SUBSCRIBER = 'ROLE_SUBSCRIBER'; // Abonné
    public const ROLE_AUTHOR = 'ROLE_AUTHOR'; // Auteur / Narrateur
    public const ROLE_EDITOR = 'ROLE_EDITOR'; // Éditeur
    public const ROLE_DESIGNER = 'ROLE_DESIGNER'; // Designer
    public const ROLE_DATA_PROVIDER = 'ROLE_DATA_PROVIDER'; // Fournisseur de données
    public const ROLE_ADMIN = 'ROLE_ADMIN'; // Administrateur

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column(type: 'json')]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 50)]
    private ?string $Pseudo = null;

    /**
     * @var Collection<int, Site>
     */
    #[ORM\OneToMany(targetEntity: Site::class, mappedBy: 'Admin')]
    private Collection $sites;

    /**
     * @var Collection<int, Articles>
     */
    #[ORM\OneToMany(targetEntity: Articles::class, mappedBy: 'auteur')]
    private Collection $articles;


    public function __construct()
    {
        $this->sites = new ArrayCollection();
        $this->articles = new ArrayCollection();
        $this->articleNotes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        if (!in_array(self::ROLE_VISITOR, $roles)) {
            $roles[] = self::ROLE_SUBSCRIBER;
        }
        return array_unique($roles);
    }
    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
    }

    public function getPseudo(): ?string
    {
        return $this->Pseudo;
    }

    public function setPseudo(string $Pseudo): static
    {
        $this->Pseudo = $Pseudo;

        return $this;
    }

    /**
     * @return Collection<int, Site>
     */
    public function getSites(): Collection
    {
        return $this->sites;
    }

    public function addSite(Site $site): static
    {
        if (!$this->sites->contains($site)) {
            $this->sites->add($site);
            $site->setAdmin($this);
        }

        return $this;
    }

    public function removeSite(Site $site): static
    {
        if ($this->sites->removeElement($site)) {
            // set the owning side to null (unless already changed)
            if ($site->getAdmin() === $this) {
                $site->setAdmin(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Articles>
     */
    public function getArticles(): Collection
    {
        return $this->articles;
    }

    public function addArticle(Articles $article): static
    {
        if (!$this->articles->contains($article)) {
            $this->articles->add($article);
            $article->setAuteur($this);
        }

        return $this;
    }

    public function removeArticle(Articles $article): static
    {
        if ($this->articles->removeElement($article)) {
            // set the owning side to null (unless already changed)
            if ($article->getAuteur() === $this) {
                $article->setAuteur(null);
            }
        }

        return $this;
    }

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: ArticleNote::class, cascade: ['persist', 'remove'])]
    private $articleNotes;


    public function getArticleNotes(): Collection
    {
        return $this->articleNotes;
    }

    public function addArticleNote(ArticleNote $articleNote): self
    {
        if (!$this->articleNotes->contains($articleNote)) {
            $this->articleNotes[] = $articleNote;
            $articleNote->setUser($this);
        }
        return $this;
    }

    public function removeArticleNote(ArticleNote $articleNote): self
    {
        if ($this->articleNotes->removeElement($articleNote)) {
            if ($articleNote->getUser() === $this) {
                $articleNote->setUser(null);
            }
        }
        return $this;
    }
}
