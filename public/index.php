<?php

use FastRoute\Dispatcher;
use Scandiweb\Controller\GraphQL;
use Scandiweb\Repository\Database;
use Scandiweb\Repository\DBQueryBuilder;
use Scandiweb\Services\CategoryService;
use Scandiweb\Services\ProductService;

define("GRAPHQL_DEBUG", true);

class Entry
{
    public GraphQL $graphQL;
    public Database $database;
    public DBQueryBuilder $dbQueryBuilder;
    public ProductService $productService;
    public CategoryService $categoryService;

    public function __construct()
    {
        require_once __DIR__ . "/../vendor/autoload.php";

        $this->database = new Database();
        $this->dbQueryBuilder = new DBQueryBuilder($this->database);

        $this->productService = new ProductService($this->dbQueryBuilder);
        $this->categoryService = new CategoryService($this->dbQueryBuilder);
        $this->graphQL = new GraphQL(
            $this->productService,
            $this->categoryService
        );

        $dispatcher = FastRoute\simpleDispatcher(function (
            FastRoute\RouteCollector $r
        ) {
            $r->post("/graphql", [$this->graphQL, "handle"]);
        });
        $routeInfo = $dispatcher->dispatch(
            $_SERVER["REQUEST_METHOD"],
            $_SERVER["REQUEST_URI"]
        );
        switch ($routeInfo[0]) {
            case Dispatcher::NOT_FOUND:
                // ... 404 Not Found
                echo "Sorry, the API you requested was not found. ${routeInfo[0]}";
                break;
            case Dispatcher::METHOD_NOT_ALLOWED:
                $allowedMethods = $routeInfo[1];
                // ... 405 Method No Allowed
                break;
            case Dispatcher::FOUND:
                $handler = $routeInfo[1];
                $vars = $routeInfo[2];
                echo $handler($vars);
                break;
        }
    }
}

$entryPoint = new Entry();
