<?php
namespace Scandiweb\Services;

use Scandiweb\Objects\Products\Product;
use Scandiweb\Repository\DBQueryBuilder;

class ProductService
{
    private DBQueryBuilder $dbQueryBuilder;
    public function __construct(DBQueryBuilder $dbQueryBuilder)
    {
        $this->dbQueryBuilder = $dbQueryBuilder;
    }
    /* @return Product[] */
    public function get_products($category): array {
	// Return value
	$products = array();
	// Getting an associative array with all of the DB-products. TODO: Jump to DF and make sure it actually does that.
	$db_products = $this->dbQueryBuilder->select_all("products", $category);

	foreach ($db_products as $db_product) {
		array_push($products, new Product($db_product));
	}

	return $products;
    }
    /* @return Product */
    public function get_product($id): Product
    {
        $db_product = $this->dbQueryBuilder->select_one("products", $id);
        return new Product($db_product);
    }
    
    /* @return bool */
    public function insert_order(string $values): bool {
        
       return $this->dbQueryBuilder->insert_one("orders", $values);
    }
}
