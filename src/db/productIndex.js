

const SQLQuery = {
    CREATE_PRODUCT_INDEX_TABLE : `CREATE TABLE IF NOT EXISTS product_index
    (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        product_id integer,
        product_name text,
        brand_id integer,
        category_id integer,
        size numeric,
        unit character varying(255),
        cost numeric,
        sale_price numeric,
        mrp numeric,
        product_display_name character varying(255),
        brand_name character varying(255),
        category_name character varying(255),
        company_id integer,
        featured_media_url text,
        max_quantity integer,
        min_quantity integer,
        status integer,
        barcode character varying(255),
        print_name character varying(255)
    )`,


}

export default SQLQuery;