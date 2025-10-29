<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;

#[ORM\Entity]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(
            security: "is_granted('ROLE_SUBSCRIBER') or is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"
        ),
        new Get(
            security: "object.getUser() == user or is_granted('ROLE_ADMIN')"
        ),
        new Put(
            security: "object.getUser() == user or is_granted('ROLE_ADMIN')"
        ),
        new Delete(
            security: "object.getUser() == user or is_granted('ROLE_ADMIN')"
        ),
    ]
)]
class ArticleNote
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Articles::class, inversedBy: 'articleNotes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Articles $article = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'articleNotes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(type: 'float')]
    private ?float $note = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getArticle(): ?Articles
    {
        return $this->article;
    }
    public function setArticle(?Articles $article): self
    {
        $this->article = $article;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }
    public function setUser(?User $user): self
    {
        $this->user = $user;
        return $this;
    }

    public function getNote(): ?float
    {
        return $this->note;
    }
    public function setNote(float $note): self
    {
        $this->note = $note;
        return $this;
    }
}
