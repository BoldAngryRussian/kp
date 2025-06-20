CREATE TABLE IF NOT EXISTS commercial_offer_details_description
(
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    commercial_offer_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);