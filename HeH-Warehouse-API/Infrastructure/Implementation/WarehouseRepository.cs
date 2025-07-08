using System.Data;
using Domain.Models;
using Domain.Repositories;
using Infrastructure.Shared;
using Microsoft.Extensions.Configuration;
using Presentation.ModelResponse;

namespace Infrastructure.Implementation
{
    public class WarehouseRepository : IWarehouseRepository
    {
        private readonly string _connectionString;

        public WarehouseRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("conexion")!;
        }

        public async Task<ApiResult> AddAsync(Warehouse entity)
        {
            entity.Transaccion = "WAREHOUSE_ADD";
            return await ExecuteNonQueryAsync(entity, NameStoreProcedure.SET_FLORES_SP, "Encargado de almacén registrado exitosamente.");
        }

        public async Task<ApiResult> UpdateAsync(Warehouse entity)
        {
            entity.Transaccion = "WAREHOUSE_UPDATE";
            return await ExecuteNonQueryAsync(entity, NameStoreProcedure.SET_FLORES_SP, "Encargado de almacén actualizado correctamente.");
        }

        public async Task<ApiResult> DeleteAsync(int id)
        {
            var entity = new Warehouse
            {
                Id = id,
                Transaccion = "WAREHOUSE_DELETE"
            };

            return await ExecuteNonQueryAsync(entity, NameStoreProcedure.GET_FLORES_SP, "Encargado de almacén eliminado exitosamente.");
        }

        public async Task<ApiResult<Warehouse?>> GetByIdAsync(int id)
        {
            var entity = new Warehouse
            {
                Id = id,
                Transaccion = "WAREHOUSE_GET_BY_ID"
            };

            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                var result = await DBXmlMethods.EjecutaBase(NameStoreProcedure.GET_FLORES_SP, _connectionString, entity.Transaccion, xml.ToString());

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
            var entity = new Warehouse { Transaccion = "WAREHOUSE_GET_ALL" };

            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                var result = await DBXmlMethods.EjecutaBase(NameStoreProcedure.GET_FLORES_SP, _connectionString, entity.Transaccion, xml.ToString());

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
                return new ApiResult<IEnumerable<Warehouse>>(500, Enumerable.Empty<Warehouse>(), $"Ocurrió un error: {ex.Message}");
            }
        }

        private async Task<ApiResult> ExecuteNonQueryAsync(Warehouse entity, string storedProcedure, string mensajeExito)
        {
            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                await DBXmlMethods.EjecutaBase(storedProcedure, _connectionString, entity.Transaccion!, xml.ToString());
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
