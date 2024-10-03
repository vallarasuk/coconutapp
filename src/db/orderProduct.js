

const SQLQuery = {
    CREATE_ORDER_PRODUCT_TABLE : `CREATE TABLE IF NOT EXISTS order_product
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        order_product_id integer,
        order_id integer,
        local_order_id integer,
        product_id integer,
        quantity integer,
        sale_price numeric,
        store_id integer,
        company_id integer,
        cost_price numeric,
        mrp numeric,
        created_at DATETIME,
        updated_at DATETIME,
        FOREIGN KEY (product_id) REFERENCES product_index(product_id)
    )`,

}

export default SQLQuery;