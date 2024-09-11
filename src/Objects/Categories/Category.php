<?php

namespace Scandiweb\Objects\Categories;

class Category implements CategoryInterface
{
    protected string $name;
    protected string $typename;

    public function __construct($db_category)
    {
     $this->name = $db_category["name"];
     $this->typename = $db_category["typename"];
    }

    public function getName()
    {
        return $this->name;
    }

    public function getTypeName()
    {
        return $this->typename;
    }

    public function getFullJSON(): array {
        return (["name" => $this->name, "typename" => $this->typename]);
    }
}