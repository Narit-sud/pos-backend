import { QueryResult } from "../../class/QueryResult";
import { pool } from "../../utils/pool";

export async function swapCategoryIndexService(
    cat1UUID: string,
    cat2UUID: string,
): Promise<QueryResult> {
    const client = await pool.connect();
    const sql = `update product_category set "index" = $1 where "uuid" = $2`;
    try {
        await client.query("BEGIN");
        const cat1Index = (
            await client.query(
                `select "index" from product_category where "uuid" = $1`,
                [cat1UUID],
            )
        ).rows[0].index;
        const cat2Index = (
            await client.query(
                `select "index" from product_category where "uuid" = $1`,
                [cat2UUID],
            )
        ).rows[0].index;
        // set cat 1 index to -99
        await client.query(sql, [-99, cat1UUID]);
        // set cat 2 index to cat 1 index
        await client.query(sql, [cat1Index, cat2UUID]);
        // set cat 1 index to cat 2 index
        await client.query(sql, [cat2Index, cat1UUID]);
        await client.query("COMMIT");
        return new QueryResult("Update categories index success", 200);
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function swapMainIndexService(
    main1UUID: string,
    main2UUID: string,
): Promise<QueryResult> {
    const client = await pool.connect();
    const sql = `update product_main set "index" = $1 where "uuid" = $2`;
    try {
        await client.query("BEGIN");
        const main1Index = (
            await client.query(
                `select "index" from product_main where "uuid" = $1`,
                [main1UUID],
            )
        ).rows[0].index;
        const main2Index = (
            await client.query(
                `select "index" from product_main where "uuid" = $1`,
                [main2UUID],
            )
        ).rows[0].index;
        // set main 1 index to -99
        await client.query(sql, [-99, main1UUID]);
        // set main 2 index to main 1 index
        await client.query(sql, [main1Index, main2UUID]);
        // set main 1 index to main 2 index
        await client.query(sql, [main2Index, main1UUID]);
        await client.query("COMMIT");
        return new QueryResult("Update main products index success", 200);
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}
