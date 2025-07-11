using System.Data;
using Domain.Models;
using Domain.Repositories;
using Infrastructure.Shared;
using Presentation.ModelResponse;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Implementation
{
    public class WarehouseRepository : IWarehouseRepository
    {
        private readonly string _connectionString;

        public WarehouseRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection")!;
        }

        public async Task<ApiResult> AddAsync(Warehouse entity)
        {
            entity.Transaccion = "INSERTAR";
            return await ExecuteNonQueryAsync(
                entity, 
                "Encargado de almacén registrado exitosamente."
            );
        }

        public async Task<ApiResult> UpdateAsync(Warehouse entity)
        {
            entity.Transaccion = "ACTUALIZAR";
            return await ExecuteNonQueryAsync(
                entity, 
                "Encargado de almacén actualizado correctamente."
            );
        }

        public async Task<ApiResult> DeleteAsync(int id)
        {
            var entity = new Warehouse
            {
                Id = id,
                Transaccion = "ELIMINAR"
            };

            return await ExecuteNonQueryAsync(
                entity, 
                "Encargado de almacén eliminado exitosamente."
            );
        }

        public async Task<ApiResult<Warehouse?>> GetByIdAsync(int id)
        {
            var entity = new Warehouse
            {
                Id = id,
                Transaccion = "CONSULTAR_POR_ID"
            };

            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                var result = await DBXmlMethods.EjecutaBase(
                    NameStoreProcedure.FLORES_SP, 
                    _connectionString, 
                    entity.Transaccion, 
                    xml.ToString()
                );

                if (result.Tables.Count > 0 && result.Tables[0].Rows.Count > 0)
                {
                    var warehouse = MapFromRow(result.Tables[0].Rows[0]);
                    return new ApiResult<Warehouse?>(200, warehouse, "Encargado de almacén encontrado.");
                }

                return new ApiResult<Warehouse?>(404, null, "No se encontró el encargado de almacén.");
            }
            catch (Exception ex)
            {
                return new ApiResult<Warehouse?>(500, null, $"Ocurrió un error: {ex.Message}");
            }
        }

        public async Task<ApiResult<IEnumerable<Warehouse>>> GetAllAsync()
        {
            var entity = new Warehouse { Transaccion = "CONSULTAR_TODO" };

            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                var result = await DBXmlMethods.EjecutaBase(
                    NameStoreProcedure.FLORES_SP, 
                    _connectionString, 
                    entity.Transaccion, 
                    xml.ToString()
                );

                var list = new List<Warehouse>();

                if (result.Tables.Count > 0)
                {
                    foreach (DataRow row in result.Tables[0].Rows)
                    {
                        list.Add(MapFromRow(row));
                    }
                }

                return new ApiResult<IEnumerable<Warehouse>>(200, list, "Encargados de almacén obtenidos correctamente.");
            }
            catch (Exception ex)
            {
                return new ApiResult<IEnumerable<Warehouse>>(500, [], $"Ocurrió un error: {ex.Message}");
            }
        }

        private async Task<ApiResult> ExecuteNonQueryAsync(Warehouse entity, string mensajeExito)
        {
            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                await DBXmlMethods.EjecutaBase(
                    NameStoreProcedure.FLORES_SP, 
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

        private Warehouse MapFromRow(DataRow row)
        {
            return new Warehouse
            {
                Id = Convert.ToInt32(row["id"]),
                FullName = row["fullName"]?.ToString(),
                Identification = row["identification"]?.ToString(),
                Phone = row["phone"]?.ToString(),
                Email = row["email"]?.ToString(),
                YearsOfExperience = Convert.ToInt32(row["yearsOfExperience"]),
                Shift = row["shift"]?.ToString()
            };
        }
    }
}
