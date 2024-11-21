import database from "infra/database.js";

async function status(request, response) {
  let databaseQuery;

  const updatedAt = new Date().toISOString();
  databaseQuery = await database.query("SHOW server_version;");
  const databaseVersion = databaseQuery.rows[0].server_version;
  databaseQuery = await database.query("SHOW max_connections;");
  const databaseMaxConnections = databaseQuery.rows[0].max_connections;
  databaseQuery = await database.query({
    text: "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [process.env.POSTGRES_DB],
  });
  const databaseOpennedConnections = databaseQuery.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(databaseMaxConnections),
        openned_connections: databaseOpennedConnections,
      },
    },
  });
}

export default status;
