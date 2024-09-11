<?php
namespace Scandiweb\Objects\Products;
interface ProductInterface {
    // Getter and Setter for id
    public function getId(): int;
    // Getter and Setter for product_id
    public function getProductId(): string;

    // Getter and Setter for name
    public function getName(): string;

    // Getter and Setter for instock
    public function isInstock(): bool;

    // Getter and Setter for gallery
    public function getGallery(): array;

    // Getter and Setter for description
    public function getDescription(): string;

    // Getter and Setter for prices
    public function getPrices(): array;

    // Getter and Setter for brand
    public function getBrand(): string;

    // Getter and Setter for type_name
    public function getTypeName(): string;

    // Getter and Setter for attributes
    public function getAttributes(): array;
    public function getFullJSON(): array;
}