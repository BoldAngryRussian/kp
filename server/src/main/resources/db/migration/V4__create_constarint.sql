ALTER TABLE price_list
ADD CONSTRAINT unique_supplier_version UNIQUE (suppliers_id, version);

ALTER TABLE product
ALTER COLUMN price_list_version TYPE INT;