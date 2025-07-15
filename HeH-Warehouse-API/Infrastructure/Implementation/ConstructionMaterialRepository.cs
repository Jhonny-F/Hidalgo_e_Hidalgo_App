using System.Data;
using Domain.Models;
using Domain.Repositories;
using Infrastructure.Shared;
using Presentation.ModelResponse;
using Microsoft.Extensions.Configuration;
using Heli.WarehouseAPI.Domain.Models;
using Heli.WarehouseAPI.Domain.Repositories;

namespace Infrastructure.Implementation
{
    public class ConstructionMaterialRepository : IConstructionMaterialRepository
    {
        private readonly string _connectionString;

        public ConstructionMaterialRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<ApiResult> AddAsync(ConstructionMaterial entity)
        {
            entity.Transaccion = "INSERTAR";
            return await ExecuteNonQueryAsync(
                entity, 
                "Material de construcción registrado exitosamente."
            );
        }

        public async Task<ApiResult> UpdateAsync(ConstructionMaterial entity)
        {
            entity.Transaccion = "ACTUALIZAR";
            return await ExecuteNonQueryAsync(
                entity, 
                "Material de construcción actualizado correctamente."
            );
        }

        public async Task<ApiResult> DeleteAsync(int id)
        {
            var entity = new ConstructionMaterial
            {
                Id = id,
                Transaccion = "ELIMINAR"
            };

            return await ExecuteNonQueryAsync(
                entity, 
                "Material de construcción eliminado exitosamente."
            );
        }

        public async Task<ApiResult<ConstructionMaterial?>> GetByIdAsync(int id)
        {
            var entity = new ConstructionMaterial
            {
                Id = id,
                Transaccion = "CONSULTAR_POR_ID"
            };

            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                var result = await DBXmlMethods.EjecutaBase(
                    NameStoreProcedure.SP_CONSTRUCTION_MATERIALS, 
                    _connectionString, 
                    entity.Transaccion, 
                    xml.ToString()
                );

                if (result.Tables.Count > 0 && result.Tables[0].Rows.Count > 0)
                {
                    var material = MapFromRow(result.Tables[0].Rows[0]);
                    return new ApiResult<ConstructionMaterial?>(200, material, "Material encontrado.");
                }

                return new ApiResult<ConstructionMaterial?>(404, null, "No se encontró el material.");
            }
            catch (Exception ex)
            {
                return new ApiResult<ConstructionMaterial?>(500, null, $"Ocurrió un error: {ex.Message}");
            }
        }

        public async Task<ApiResult<IEnumerable<ConstructionMaterial>>> GetAllAsync()
        {
            var entity = new ConstructionMaterial { Transaccion = "CONSULTAR_TODO" };

            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                var result = await DBXmlMethods.EjecutaBase(
                    NameStoreProcedure.SP_CONSTRUCTION_MATERIALS, 
                    _connectionString, 
                    entity.Transaccion, 
                    xml.ToString()
                );

                var list = new List<ConstructionMaterial>();

                if (result.Tables.Count > 0)
                {
                    foreach (DataRow row in result.Tables[0].Rows)
                    {
                        list.Add(MapFromRow(row));
                    }
                }

                return new ApiResult<IEnumerable<ConstructionMaterial>>(200, list, "Listado de materiales obtenido correctamente.");
            }
            catch (Exception ex)
            {
                return new ApiResult<IEnumerable<ConstructionMaterial>>(500, [], $"Ocurrió un error: {ex.Message}");
            }
        }

        private async Task<ApiResult> ExecuteNonQueryAsync(ConstructionMaterial entity, string mensajeExito)
        {
            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                await DBXmlMethods.EjecutaBase(
                    NameStoreProcedure.SP_CONSTRUCTION_MATERIALS, 
                    _connectionString, 
                    entity.Transaccion!, 
                    xml.ToString()
                );
                return new ApiResult(200, mensajeExito);
            }
            catch (Exception ex)
            {
                return new ApiResult(500, $"Ocurrió un error: {ex.Message}");
            }
        }

        private ConstructionMaterial MapFromRow(DataRow row)
        {
            return new ConstructionMaterial
            {
                Id = Convert.ToInt32(row["id"]),
                Code = row["code"]?.ToString() ?? string.Empty,
                Name = row["name"]?.ToString() ?? string.Empty,
                MaterialType = row["materialType"]?.ToString() ?? "General",
                UnitOfMeasure = row["unitOfMeasure"]?.ToString() ?? "UN",
                UnitPrice = row["unitPrice"] != DBNull.Value ? Convert.ToDecimal(row["unitPrice"]) : 0,
                Stock = row["stock"] != DBNull.Value ? Convert.ToInt32(row["stock"]) : 0,
                MinStock = row["minStock"] != DBNull.Value ? Convert.ToInt32(row["minStock"]) : 0,
                MaxStock = row["maxStock"] != DBNull.Value ? Convert.ToInt32(row["maxStock"]) : 0,
                Description = row["description"]?.ToString(),
                ImageUrl = row["imageUrl"]?.ToString(),
                IsActive = row["isActive"] != DBNull.Value ? Convert.ToBoolean(row["isActive"]) : true,
                CreatedAt = row["createdAt"] != DBNull.Value ? Convert.ToDateTime(row["createdAt"]) : DateTime.UtcNow,
                UpdatedAt = row["updatedAt"] != DBNull.Value ? Convert.ToDateTime(row["updatedAt"]) : null
            };
        }

        Task<ConstructionMaterial?> IConstructionMaterialRepository.GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        Task<IEnumerable<ConstructionMaterial>> IConstructionMaterialRepository.GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<int> CreateAsync(ConstructionMaterial material)
        {
            throw new NotImplementedException();
        }

        Task<bool> IConstructionMaterialRepository.UpdateAsync(ConstructionMaterial material)
        {
            throw new NotImplementedException();
        }

        Task<bool> IConstructionMaterialRepository.DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<bool> ExistsAsync(string code)
        {
            throw new NotImplementedException();
        }

        Task IConstructionMaterialRepository.AddAsync(ConstructionMaterial constructionMaterial)
        {
            return AddAsync(constructionMaterial);
        }
    }
}