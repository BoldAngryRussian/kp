CREATE TABLE IF NOT EXISTS commercial_offer_history
(
    id SERIAL PRIMARY KEY,
    commercial_offer_id bigint NOT NULL,
    user_id bigint NOT NULL,
    user_action varchar(100) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);