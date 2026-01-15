<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\Patch;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Symfony\Component\Serializer\Annotation\Groups;
use App\Repository\ArticleNoteRepository;

#[ORM\Entity(repositoryClass: ArticleNoteRepository::class)]
#[ORM\Table(name: 'article_note')]
#[ApiResource(
        operations: [
            new GetCollection(),
            new Post(
                security: "is_granted('ROLE_SUBSCRIBER')"
            ),
            new Get(),
            new Put(
                security: "is_granted('ROLE_SUBSCRIBER')"
            ),
            new Patch(
                security: "is_granted('ROLE_SUBSCRIBER')"
            ),
            new Delete(
                security: "is_granted('ROLE_SUBSCRIBER')"
            ),
        ]
    )]
#[ApiFilter(SearchFilter::class, properties: ['article' => 'exact', 'user' => 'exact'])]
class ArticleNote
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Articles::class, inversedBy: 'articleNotes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['article:read'])]
    private ?Articles $article = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'articleNotes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['article:read'])]
    private ?User $user = null;

    #[ORM\Column(type: 'float')]
    #[Groups(['article:read'])]
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
