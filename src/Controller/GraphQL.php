<?php

namespace Scandiweb\Controller;

use Scandiweb\Services\CategoryService;
use Scandiweb\Services\ProductService;
use GraphQL\GraphQL as GraphQLBase;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use GraphQL\Type\Schema;
use GraphQL\Type\SchemaConfig;
use RuntimeException;
use Throwable;
define(GRAPHQL_DEBUG, true);

class GraphQL
{
    private ProductService $productService;
    private CategoryService $categoryService;
    //    private CategoryService $category_service;
    public function __construct(
	ProductService $productService,
        CategoryService $categoryService) {
        $this->productService = $productService;
        $this->categoryService = $categoryService;
    }

    public function handle(): false|string
    {
        try {
            $categorySchema = new ObjectType([
                "name" => "Category",
                "fields" => [
                    "name" => ["type" => Type::string()],
                    "typename" => ["type" => Type::string()],
                ],
            ]);

            $attributeType = new ObjectType([
                "name" => "Attribute",
                "fields" => [
                    "id" => ["type" => Type::string()],
                    "displayValue" => ["type" => Type::string()],
                    "value" => ["type" => Type::string()],
                ],
            ]);

            $attributeSet = new ObjectType([
                "name" => "AttributeSet",
                "fields" => [
                    "id" => ["type" => Type::string()],
                    "name" => ["type" => Type::string()],
                    "type" => ["type" => Type::string()],
                    "items" => ["type" => Type::listOf($attributeType)],
                ],
            ]);

            $currencyType = new ObjectType([
                "name" => "Currency",
                "fields" => [
                    "label" => ["type" => Type::string()],
                    "symbol" => ["type" => Type::string()],
                ],
            ]);

            $priceType = new ObjectType([
                "name" => "Price",
                "fields" => [
                    "amount" => ["type" => Type::float()],
                    "currency" => ["type" => $currencyType],
                ],
            ]);

            $productType = new ObjectType([
                "name" => "Product",
                "fields" => [
                    "id" => ["type" => Type::id()],
                    "product_id" => ["type" => Type::string()],
                    "instock" => ["type" => Type::boolean()],
                    "gallery" => ["type" => Type::listOf(Type::string())],
                    "description" => ["type" => Type::string()],
                    "category" => ["type" => Type::string()],
                    "attributes" => ["type" => Type::listOf($attributeSet)],
                    "name" => ["type" => Type::string()],
                    "prices" => ["type" => Type::listOf($priceType)],
                    "brand" => ["type" => Type::string()],
                ],
            ]);
            $queryType = new ObjectType([
                "name" => "Query",
                "fields" => [
                    "products" => [
                        "type" => Type::listOf($productType),
                        "args" => [
                          "category" => ["type" => Type::string()],
                        ],
                        "resolve" => function ($root, $args) {
                            // Interatable<Itertable>
                            
                            $products = $this->productService->get_products($args["category"]);
                            
                            $products_associative = [];
                            foreach($products as $product) {
                                array_push($products_associative, $product->getFullJSON());
                            }
                            return $products_associative;
                        },
                    ],
                    "product" => [
                        "type" => $productType,
                        "args" => [
                            "id" => ["type" => Type::id()],
                        ],
                        "resolve" => function ($root, $args) {
                            // TODO: define the internal querying logic
                            return $this->productService
                                ->get_product($args["id"])
                                ->getFullJSON();
                            
                        },
                    ],

                    "category" => [
                        "type" => $categorySchema,
                        "args" => [
                            "id" => ["type" => Type::id()],
                        ],
                        "resolve" => function ($root, $args) {
                            return $this->categoryService
                                ->getCategoryById($args["id"])
                                ->getFullJSON();
                        },
                    ],
                ],
            ]);

            // See docs on schema options:
            // https://webonyx.github.io/graphql-php/schema-definition/#configuration-options
            $schema = new Schema(
                (new SchemaConfig())->setQuery($queryType)
                //                ->setMutation($mutationType)
            );

            $rawInput = file_get_contents("php://input");
            if ($rawInput === false) {
                throw new RuntimeException("Failed to get php://input");
            }

            $input = json_decode($rawInput, true);
            $query = $input["query"];

            $variableValues = $input["variables"] ?? null;

            $rootValue = [];
            $result = GraphQLBase::executeQuery(
                $schema,
                $query,
                $rootValue,
                null,
                $variableValues
            );
            $output = $result->toArray();
        } catch (Throwable $e) {
            $output = [
                "error" => [
                    "message" => $e->getMessage(),
                    "trace" => $e->getTrace(),
                ],
            ];
            error_log(json_encode($output));
        }

        header("Content-Type: application/json; charset=UTF-8");
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
        header("Access-Control-Allow-Headers: Content-Type, Authorization");
        header("Content-Type: application/json; charset=UTF-8");       
        //return json_encode($this->productService->get_products());
        return json_encode($output);
    }
}
