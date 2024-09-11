<?php
namespace Scandiweb\Services;

use Scandiweb\Objects\Categories\Category;
use Scandiweb\Repository\DBQueryBuilder;

class CategoryService {

    private DBQueryBuilder $dbQueryBuilder;

    function __construct(DBQueryBuilder $dbQueryBuilder) {
        $this->dbQueryBuilder = $dbQueryBuilder;
    }


    /** @return Category[] */
    public function getCategories(DBQueryBuilder $dbQueryBuilder): array
    {
        $categories = [];
        $db_categories = $this->dbQueryBuilder->select_all("categories");

        foreach ($db_categories as $db_category) {
            $categories[$db_category['id']] = new Category($db_category);
        }

        return $categories;

    }
    public function getCategoryById($id): Category
    {
        return new Category($this->dbQueryBuilder->select_one($id, "categories"));
    }

}