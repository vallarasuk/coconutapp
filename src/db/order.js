

const SQLQuery = {
    CREATE_ORDER_TABLE : `CREATE TABLE IF NOT EXISTS "order"
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        order_id integer,
        date DATETIME,
        total_amount numeric,
        store_id integer,
        company_id integer,
        order_number bigint,
        status integer,
        owner integer,
        shift integer,
        uuid uuid,
        payment_type integer,
        createdBy integer,
        type integer,
        customer_account integer,
        customer_phone_number character varying(255),
        created_at DATETIME,
        updated_at DATETIME
    )`,

}

export default SQLQuery;