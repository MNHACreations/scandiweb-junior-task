<?php

namespace Scandiweb\Repository;

use PDO;
use PDOException;
use Scandiweb\Internals\ConfigurationManager;

class Database extends ConfigurationManager
{
    private PDO $connection;
    private bool $connection_status = false;

    function __construct()
    {
        parent::__construct();

        define("DBHOST", "localhost");
        define("DBUSERNAME", "root");
        define("DBPASSWORD", "rootpwd");
        define("DBNAME", "scandiweb");
        define("INITIALDB", "/../Resources/initial.sql");
        define("DATAFILE", "/../Resources/data.json");

        // TODO: Implement constraint check-out mechanics -Muhammad
        try {
            // Get database.initializeDatabase && database.populateData from the config.json file (At /Resources). (Used as a condition to make the DB's schema and populate the json data)
            $database_config = parent::getConfig()["database"];
            // TODO: Release a PR Request with the modification (Why are we inverting)
            $initialize_db = $database_config["initializeDatabase"];
            $populate_data = $database_config["populateData"];

            $this->connection = new PDO(
                "mysql:host=" . DBHOST,
                DBUSERNAME,
                DBPASSWORD
            );
            $this->connection->setAttribute(
                PDO::ATTR_ERRMODE,
                PDO::ERRMODE_EXCEPTION
            );
            $this->connection_status = true;

            if ($initialize_db) {
                ($initial_file = fopen(__DIR__ . INITIALDB, "r")) or
                    die(
                        "Unable to open the SQL intitalization file, please contact an administrator."
                    );
                $sql = fread($initial_file, filesize(__DIR__ . INITIALDB));
                $preparedSql = $this->connection->prepare($sql);
                $preparedSql->execute();
                $preparedSql->closeCursor();
            } else {
                $selectDatabase = "USE " . DBNAME;
                $this->connection->query($selectDatabase);
            }
            if ($populate_data) {
                // Initalize scandiweb's populated json file (data.json).
                ($json_file = fopen(__DIR__ . DATAFILE, "r")) or
                    die(
                        "Unable to open the SQL intitalization file, please contact an administrator."
                    );
                $raw = fread($json_file, filesize(__DIR__ . DATAFILE));
                $json = json_decode($raw);

                $products_sql = "
                USE scandiweb;
                INSERT INTO products VALUES(
                :id,
                :product_id,
                :name,
                :instock,
                :gallery,
                :description,
                :category,
                :attributes,
                :prices,
                :brand,
                :typename
                );";

                $products_pst = $this->get_db()->prepare($products_sql, [
                    PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY,
                ]);

                //TODO: For god's sake (who wrote this???) | Push a PR Request using the DB check-out internal
                $products = $json->data->products;
                foreach ($products as $product) {
                    $products_pst->execute([
                        "id" => array_search($product, $products) + 1,
                        "product_id" => $product->id,
                        "name" => $product->name,
                        "instock" => $product->inStock ? 1 : 0,
                        "gallery" => json_encode($product->gallery),
                        "description" => $product->description,
                        "category" => $product->category,
                        "attributes" => json_encode($product->attributes),
                        "prices" => json_encode($product->prices),
                        "brand" => $product->brand,
                        "typename" => $product->__typename,
                    ]);

                    $products_pst->closeCursor();
                }

                $categories = $json->data->categories;
                $category_sql = "
                USE scandiweb;
                INSERT INTO categories VALUES(
                 :id,
                 :category_name,
                 :category_typename
                );";
                $category_pst = $this->get_db()->prepare($category_sql, [
                    PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY,
                ]);

                foreach ($categories as $category) {
                    $category_pst->execute([
                        "id" => array_search($category, $categories) + 1,
                        "category_name" => $category->name,
                        "category_typename" => $category->__typename,
                    ]);
                    $category_pst->closeCursor();

                    // Tried inserting already-existing data into the database.
                }
            }
        } catch (PDOException $e) {
            echo json_encode($e->getMessage());
        }
    }

    public function get_status(): bool
    {
        return $this->connection_status;
    }

    public function get_db(): PDO
    {
        return $this->connection;
    }
}
