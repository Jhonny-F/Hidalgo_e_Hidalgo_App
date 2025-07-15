using Heli.WarehouseAPI.Domain.Models;
using System.Data;

namespace Heli.WarehouseAPI.Infrastructure.Shared;

public static class ConstructionMaterialDBExtensions
{
    public static ConstructionMaterial MapToConstructionMaterial(IDataReader reader)
    {
        return new ConstructionMaterial
        {
            Id = reader.GetInt32(reader.GetOrdinal("Id")),
            Code = reader.GetString(reader.GetOrdinal("Code")),
            Name = reader.GetString(reader.GetOrdinal("Name")),
            // Mapear todas las propiedades
        };
    }
}