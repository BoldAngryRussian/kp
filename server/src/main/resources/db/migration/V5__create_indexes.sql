CREATE INDEX idx_product_price_list ON product(price_list_id, price_list_version);
CREATE INDEX idx_price_list_supplier ON price_list(suppliers_id);