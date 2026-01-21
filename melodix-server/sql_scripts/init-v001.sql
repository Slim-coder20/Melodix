USE harmony;

CREATE TABLE categories
(
    id SMALLINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE stocks
(
    id SMALLINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE products (
    id SMALLINT NOT NULL AUTO_INCREMENT,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    id_category SMALLINT,
    price FLOAT NOT NULL,
    monthly FLOAT NOT NULL,
    badge VARCHAR(100) NOT NULL,
    image VARCHAR(100) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_category_product FOREIGN KEY (id_category)
        REFERENCES categories(id)
        -- ON DELETE CASCADE
        -- ON UPDATE RESTRICT
);

CREATE TABLE stock_product
(
    stock_id SMALLINT NOT NULL,
    product_id SMALLINT NOT NULL,
    PRIMARY KEY (stock_id, product_id),
    CONSTRAINT fk_product
        FOREIGN KEY (product_id) REFERENCES products (id),
    CONSTRAINT fk_stock
        FOREIGN KEY (stock_id) REFERENCES stocks (id)
);
