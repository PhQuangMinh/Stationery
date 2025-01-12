CREATE TABLE brand_category (
    brand_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    PRIMARY KEY (brand_id, category_id),
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE category_product (
    category_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    PRIMARY KEY (category_id, product_id),
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
