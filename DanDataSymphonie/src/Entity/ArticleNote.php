<?php
// src/Entity/ArticleNote.php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class ArticleNote
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private $id;

    #[ORM\ManyToOne(targetEntity: Articles::class, inversedBy: 'articleNotes')]
    #[ORM\JoinColumn(nullable: false)]
    private $article;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'articleNotes')]
    #[ORM\JoinColumn(nullable: false)]
    private $user;

     #[ORM\Column]
    private ?float $note = null;

    public function getId(): ?int { return $this->id; }
    public function getArticle(): ?Articles { return $this->article; }
    public function setArticle(?Articles $articles): self { $this->articles = $articles; return $this; }
    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): self { $this->user = $user; return $this; }
    public function getNote(): ?float { return $this->note; }
    public function setNote(float $note): self { $this->note = $note; return $this; }
}
