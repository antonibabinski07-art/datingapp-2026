using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class PaginationHelper
{
    public static async Task<PaginationResult<T>> CreateAsync<T>(IQueryable<T> query, int pageSize, int pageNumber)
    {
        var count = await query.CountAsync();
        var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PaginationResult<T>
        {
            Metadata = new PaginationMetadata
            {
                PageNumber = pageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)pageSize),
                PageSize = pageSize,
                TotalCount = count
            },
            Items = items
        };
    }
}

public class PaginationResult<T>
{
    public PaginationMetadata Metadata { get; set; } = default!;
    public List<T> Items { get; set; } = [];
}

public class PaginationMetadata
{
    public int PageNumber { get; set; }
    public int TotalPages { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }
}
