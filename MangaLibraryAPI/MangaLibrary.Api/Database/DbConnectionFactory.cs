using System.Data;
using Npgsql;

namespace MangaLibraryAPI.Database;

public class DbConnectionFactory(NpgsqlDataSource dataSource) : IDbConnectionFactory
{
    public async Task<IDbConnection> CreateDbConnectionAsync(CancellationToken cancellationToken)
    {
        return await dataSource.OpenConnectionAsync(cancellationToken);
    }
}

public interface IDbConnectionFactory
{
    public Task<IDbConnection> CreateDbConnectionAsync(CancellationToken cancellationToken = default);
}