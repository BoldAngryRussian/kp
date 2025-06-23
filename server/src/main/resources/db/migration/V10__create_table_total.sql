CREATE TABLE IF NOT EXISTS commercial_offer_total
(
    id SERIAL PRIMARY KEY,
    commercial_offer_id bigint NOT NULL,
    weight double precision,
    price_purchase double precision,
    price_transport double precision,
    price_sell double precision,
    marga double precision,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commercial_offer_total
        FOREIGN KEY (commercial_offer_id)
        REFERENCES commercial_offer (id)
        ON DELETE CASCADE
);

ALTER TABLE commercial_offer_total ADD CONSTRAINT commercial_offer_id_unique UNIQUE (commercial_offer_id);