using Presentation.ModelResponse;

namespace Domain.Repositories
{
    public interface IGenericRepository<T> where T : class
    {
        Task<ApiResult> AddAsync(T entity);

        Task<ApiResult> UpdateAsync(T entity);

        Task<ApiResult> DeleteAsync(int id);

        Task<ApiResult<T?>> GetByIdAsync(int id);

        Task<ApiResult<IEnumerable<T>>> GetAllAsync();
    }
}
