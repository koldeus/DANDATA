<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Patch;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(security: "is_granted('ROLE_ADMIN')"),
        new Post(),
        new Get(security: "object == user or is_granted('ROLE_ADMIN')"),
        new Put(security: "object == user or is_granted('ROLE_ADMIN')"),
        new Patch(security: "object == user or is_granted('ROLE_ADMIN')"),
        new Delete(security: "object == user or is_granted('ROLE_ADMIN')"),
    ],
    normalizationContext: ['groups' => ['user:read', 'article:read', 'article:list']],
    denormalizationContext: ['groups' => ['user:write']]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    public const ROLE_VISITOR = 'ROLE_VISITOR';
    public const ROLE_SUBSCRIBER = 'ROLE_SUBSCRIBER';
    public const ROLE_AUTHOR = 'ROLE_AUTHOR';
    public const ROLE_EDITOR = 'ROLE_EDITOR';
    public const ROLE_DESIGNER = 'ROLE_DESIGNER';
    public const ROLE_DATA_PROVIDER = 'ROLE_DATA_PROVIDER';
    public const ROLE_ADMIN = 'ROLE_ADMIN';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read', 'article:read', 'article:list'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['user:read', 'user:write', 'article:read'])]
    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['user:read', 'user:write', 'article:read'])]
    private array $roles = [];

    #[ORM\Column]
    #[Groups(['user:write'])]
    #[Assert\NotBlank(groups: ['user:create'])]
    private ?string $password = null;

    #[ORM\Column(length: 50)]
    #[Groups(['user:read', 'user:write', 'article:read', 'article:list'])]
    #[Assert\NotBlank]
    private ?string $pseudo = null;

    #[Groups(['user:write'])]
    #[Assert\Length(min: 6, groups: ['user:create'])]
    private ?string $plainPassword = null;

    #[ORM\OneToMany(targetEntity: Articles::class, mappedBy: 'auteur')]
    private Collection $articles;

    #[ORM\OneToMany(targetEntity: Site::class, mappedBy: 'Admin')]
    private Collection $sites;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: ArticleNote::class, cascade: ['persist', 'remove'])]
    private Collection $articleNotes;

    public function __construct()
    {
        $this->articles = new ArrayCollection();
        $this->sites = new ArrayCollection();
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

    public function setEmail(string $email): self
    {
        $this->email = $email;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        if (!in_array(self::ROLE_VISITOR, $roles))
            $roles[] = self::ROLE_SUBSCRIBER;
        return array_unique($roles);
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    public function eraseCredentials(): void
    {
        $this->plainPassword = null;
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(string $pseudo): self
    {
        $this->pseudo = $pseudo;
        return $this;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }

    public function getArticles(): Collection
    {
        return $this->articles;
    }

    public function addArticle(Articles $article): self
    {
        if (!$this->articles->contains($article)) {
            $this->articles->add($article);
            $article->setAuteur($this);
        }
        return $this;
    }

    public function removeArticle(Articles $article): self
    {
        if ($this->articles->removeElement($article)) {
            if ($article->getAuteur() === $this)
                $article->setAuteur(null);
        }
        return $this;
    }

    public function getArticleNotes(): Collection
    {
        return $this->articleNotes;
    }

    public function addArticleNote(ArticleNote $note): self
    {
        if (!$this->articleNotes->contains($note)) {
            $this->articleNotes->add($note);
            $note->setUser($this);
        }
        return $this;
    }

    public function removeArticleNote(ArticleNote $note): self
    {
        if ($this->articleNotes->removeElement($note)) {
            if ($note->getUser() === $this)
                $note->setUser(null);
        }
        return $this;
    }

    public function getSites(): Collection
    {
        return $this->sites;
    }

    public function addSite(Site $site): self
    {
        if (!$this->sites->contains($site)) {
            $this->sites->add($site);
            $site->setAdmin($this);
        }
        return $this;
    }

    public function removeSite(Site $site): self
    {
        if ($this->sites->removeElement($site)) {
            if ($site->getAdmin() === $this)
                $site->setAdmin(null);
        }
        return $this;
    }

    #[Groups(['user:update'])]
    private ?string $currentPassword = null;

    public function getCurrentPassword(): ?string
    {
        return $this->currentPassword;
    }

    public function setCurrentPassword(?string $currentPassword): self
    {
        $this->currentPassword = $currentPassword;
        return $this;
    }
}