<?php
namespace Scandiweb\Objects\Products;

use Hoa\Exception\Exception;


include_once(__DIR__ . "/ProductInterface.php");
class Product implements ProductInterface {

    protected int $id;
    protected string $product_id;
    protected string $name;
    protected bool $in_stock;
    protected array $gallery;
    protected string $description;
    protected string $category;
    protected array $prices;
    protected string $brand;
    protected string $type_name;
    protected array $attributes;


    private $db_product;
    public function __construct($db_product = array()) {
        $this->db_product = $db_product;

        $this->id = $db_product["id"];
        $this->product_id = $db_product["product_id"];
        $this->name = $db_product["name"];
        $this->in_stock = $db_product["instock"];
        $this->description = $db_product["description"];
        $this->prices= json_decode($db_product["prices"]);
        $this->brand = $db_product["brand"];
        $this->type_name = $db_product["typename"];
        $this->attributes = json_decode($db_product["attributes"]);
        $this->gallery = json_decode($db_product["gallery"]);
        $this->category = $db_product["category"];
        
    }




 /**
     * @inheritDoc
     */
    public function getAttributes(): array {
        return $this->attributes;
    }

    /**
     * @inheritDoc
     */
    public function getBrand(): string {
        return $this->brand;
    }

    /**
     * @inheritDoc
     */
    public function getDescription(): string {
        return $this->description;
    }

    /**
     * @inheritDoc
     */
    public function getGallery(): array {
        return $this->gallery;
    }

    /**
     * @inheritDoc
     */
    public function getId(): int {
        return $this->id;
    }

    /**
     * @inheritDoc
     */
    public function getName(): string {
        return $this->name;
    }

    /**
     * @inheritDoc
     */
    public function getPrices(): array {
        return $this->prices;
    }

    /**
     * @inheritDoc
     */
    public function getProductId(): string {
        return $this->product_id;
    }

    /**
     * @inheritDoc
     */
    public function getTypeName(): string {
        return $this->type_name;
    }


    public function isInstock(): bool
    {
        return $this->in_stock;
    }

    /** @return array */
    public function getFullJSON(): array {
        return [
            "id" => $this->id,
            "product_id" => $this->product_id,
            "name" => $this->name,
            "instock" => $this->in_stock,
            "gallery" => $this->gallery,
            "description" => $this->description,
            "category" => $this->category,
            "attributes" => $this->attributes,
            "prices" => $this->prices,
            "brand" => $this->brand,
            "__typename" => $this->type_name
        ];
    }
}
