using Heli.WarehouseAPI.Domain.Models;

namespace Heli.WarehouseAPI.Domain.Repositories;

public interface IConstructionMaterialRepository
{
    Task<ConstructionMaterial?> GetByIdAsync(int id);
    Task<IEnumerable<ConstructionMaterial>> GetAllAsync();
    Task<int> CreateAsync(ConstructionMaterial material);
    Task<bool> UpdateAsync(ConstructionMaterial material);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(string code);
    Task AddAsync(ConstructionMaterial constructionMaterial);
}