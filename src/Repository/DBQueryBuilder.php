<?php
namespace Scandiweb\Repository;

use PDO;
use PhpParser\Node\Scalar\String_;
use RecursiveArrayIterator;

include_once("Database.php");
class DBQueryBuilder {
    private Database $database;
    public function __construct(Database $database) {
        $this->database = $database;
}
public function select_all($table, $category): array {
$sql = "SELECT * FROM {$table}" . 
    ((!is_null($category) && $category !== "all") ? " WHERE category='{$category}'" : "");

    $statement = $this->database->get_db()->prepare($sql);
    $statement->execute();

    $statement->setFetchMode(PDO::FETCH_ASSOC);
    $result = [];
    foreach(new RecursiveArrayIterator($statement->fetchAll()) as $key=>$value) {
        $result[$key] = $value;
    }
    return $result;
}
public function select_one($table, $id): array {
    $sql = "SELECT * FROM {$table} WHERE id = {$id}";
    return $this->database->get_db()->query($sql)->fetch(PDO::FETCH_ASSOC);
}

/* @return bool*/
    public function insert_one($table, $values): bool {
        $sql = "INSERT INTO {$table} VALUES ({$values})";
        $statement = $this->database->get_db()->prepare($sql);
        $state = $statement->execute();
        return $state;
        
    }
}
