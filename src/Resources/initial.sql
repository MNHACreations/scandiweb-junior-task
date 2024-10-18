CREATE DATABASE IF NOT EXISTS scandiweb;
USE scandiweb;

CREATE TABLE IF NOT EXISTS products(
id INT auto_increment PRIMARY KEY,
product_id VARCHAR(150) UNIQUE NOT NULL,
name VARCHAR(150),
instock boolean,
gallery JSON,
description text,
category text,
attributes json,
prices json,
brand text,
typename text
);
CREATE TABLE IF NOT EXISTS orders(
    id INT auto_increment PRIMARY KEY,
    product_id VARCHAR(150) NOT NULL,
    name VARCHAR(150),
    attributes VARCHAR(150),
    quantity VARCHAR(20),
    total_price VARCHAR(20),
    date VARCHAR(150)
);
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) UNIQUE,
    typename VARCHAR(20)
);
