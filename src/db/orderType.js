const SQLQuery = {
  CREATE_ORDER_TYPE_TABLE: `CREATE TABLE IF NOT EXISTS order_type
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        order_type_id integer, 
        name character varying(255),
        show_customer_selection integer,
        allow_store_order integer,
        allow_delivery integer,
        company_id integer,
        created_at DATETIME,
        updated_at DATETIME
    )`,
};

export default SQLQuery;
