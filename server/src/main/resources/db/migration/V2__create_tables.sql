CREATE TABLE IF NOT EXISTS commercial_offer
(
    id SERIAL PRIMARY KEY,
    manager_id bigint NOT NULL,
    customer_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commercial_offer_details
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price integer NOT NULL,
    markup_extra integer,
    markup_percent integer,
    transport_extra integer,
    transport_percent integer,
    quantity integer NOT NULL,
    weight_kg integer NOT NULL,
    commercial_offer_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commercial_offer_details_offer
        FOREIGN KEY (commercial_offer_id)
        REFERENCES commercial_offer (id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS customers
(
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    second_name VARCHAR(255),
    third_name VARCHAR(255),
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    address VARCHAR(1024),
    details TEXT,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS suppliers
(
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    second_name VARCHAR(255),
    third_name VARCHAR(255),
    phone VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    address VARCHAR(1024),
    details TEXT,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users
(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    second_name VARCHAR(100) NOT NULL,
    third_name VARCHAR(100) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(320) NOT NULL,
    details text,
    password_hash text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS price_list
(
    id SERIAL PRIMARY KEY,
    suppliers_id BIGINT NOT NULL,
    version INT NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(1024),
    price BIGINT NOT NULL,
    price_list_id BIGINT NOT NULL,
    price_list_version BIGINT NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT product_price_list_fk FOREIGN KEY (price_list_id)
        REFERENCES public.price_list (id)
        ON DELETE CASCADE
);