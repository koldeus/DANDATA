<?php
namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use App\Entity\User;
use Symfony\Component\Security\Core\Security;


class UserController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(Security $security): JsonResponse
    {
        /** @var User $user */
        $user = $security->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Unauthorized'], 401);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'roles' => $user->getRoles(),
        ]);
    }

    #[Route('/api/check-email', name: 'api_check_email', methods: ['GET'])]
    public function checkEmail(Request $request, UserRepository $userRepo): JsonResponse
    {
        $email = $request->query->get('email');

        if (!$email) {
            return new JsonResponse([
                'error' => 'Email manquant dans la requête.'
            ], 400);
        }

        $userExists = $userRepo->findOneBy(['email' => $email]) !== null;

        return new JsonResponse([
            'exists' => $userExists
        ]);
    }
}
