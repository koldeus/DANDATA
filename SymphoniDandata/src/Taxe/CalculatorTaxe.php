<?php

namespace App\Taxe;

class CalculatorTaxe
{

   public function __construct()
    {
    }

    public function calculerTVA($ht){
        return ($ht*20/100);
    }
    public function calculerTTC($ht){
        return ($ht*1.2);
    }
}