using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace ZTMApp;

public class ZTMDb: DbContext
{
    public ZTMDb(DbContextOptions<ZTMDb> options)
        : base(options) { }
    public DbSet<User> Users => Set<User>();

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var connectionStringBuilder = new SqliteConnectionStringBuilder { DataSource = "MyDb.db" };
        var connectionString = connectionStringBuilder.ToString();
        var connection = new SqliteConnection(connectionString);

        optionsBuilder.UseSqlite(connection);
    }
}