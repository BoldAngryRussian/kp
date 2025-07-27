CREATE TABLE IF NOT EXISTS commercial_offer_additional_services
(
    id SERIAL PRIMARY KEY,
    commercial_offer_id bigint NOT NULL,
    type text not null,
    count BIGINT NOT NULL,
    price BIGINT NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_commercial_offer_additional_services
        FOREIGN KEY (commercial_offer_id)
        REFERENCES commercial_offer (id)
        ON DELETE CASCADE
);