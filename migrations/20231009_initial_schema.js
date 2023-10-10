exports.up = (knex) => {
  return knex.schema.createTable("reviews", (table) => {
    table.increments("id").primary();
    table.text("autor");
    table.text("comentario");
    table.text("loja");
    table.time("data");
    table.integer("avaliacao");
  });
};
