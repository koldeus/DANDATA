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
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ApiResource(
    operations: [
        new GetCollection(security: "is_granted('ROLE_ADMIN')"),
        new Post(),
        new Get(security: "object == user or is_granted('ROLE_ADMIN')"),
        new Put(security: "object == user or is_granted('ROLE_ADMIN')"),
        new Delete(security: "object == user or is_granted('ROLE_ADMIN')"),
    ]
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
    #[Groups(['article:read', 'article:list'])]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    #[Groups(['article:read'])]
    private ?string $email = null;

    #[ORM\Column(type: 'json')]
    #[Groups(['article:read'])]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 50)]


    #[Groups(['article:read', 'article:list'])]
    private ?string $pseudo = null;

    #[ORM\OneToMany(targetEntity: Articles::class, mappedBy: 'auteur')]
    private Collection $articles;

    #[ORM\OneToMany(mappedBy: 'user', targetEntity: ArticleNote::class, cascade: ['persist', 'remove'])]
    private Collection $articleNotes;

    public function __construct()
    {
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

    #[Groups(['user:write'])]
    private ?string $plainPassword = null;

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): self
    {
        $this->plainPassword = $plainPassword;
        return $this;
    }

}
