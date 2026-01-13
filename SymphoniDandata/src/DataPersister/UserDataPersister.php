<?php

namespace App\DataPersister;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire; // <--- Import important

class UserDataPersister implements ProcessorInterface
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        
        // On indique ici quel service précis injecter
        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        if ($data instanceof User && method_exists($data, 'getPlainPassword') && $data->getPlainPassword()) {
            $hashed = $this->passwordHasher->hashPassword(
                $data,
                $data->getPlainPassword()
            );

            $data->setPassword($hashed);
            // Il est recommandé d'effacer le mot de passe en clair après hachage
            $data->eraseCredentials(); 
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}