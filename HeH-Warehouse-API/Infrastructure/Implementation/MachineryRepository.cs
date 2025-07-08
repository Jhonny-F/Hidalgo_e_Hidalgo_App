using System.Data;
using System.Xml.Linq;
using Domain.Models;
using Domain.Repositories;
using Infrastructure.Shared;
using Presentation.ModelResponse;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Implementation
{
    public class MachineryRepository : IMachineryRepository
    {
        private readonly string _connectionString;

        public MachineryRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("conexion")!;
        }

        public async Task<ApiResult> AddAsync(Machinery entity)
        {
            entity.Transaccion = "MACHINERY_ADD";
            return await ExecuteNonQueryAsync(entity, NameStoreProcedure.SET_FLORES_SP, "Maquinaria registrada exitosamente.");
        }

        public async Task<ApiResult> UpdateAsync(Machinery entity)
        {
            entity.Transaccion = "MACHINERY_UPDATE";
            return await ExecuteNonQueryAsync(entity, NameStoreProcedure.SET_FLORES_SP, "Maquinaria actualizada correctamente.");
        }

        public async Task<ApiResult> DeleteAsync(int id)
        {
            var entity = new Machinery
            {
                Id = id,
                Transaccion = "MACHINERY_DELETE"
            };

            return await ExecuteNonQueryAsync(entity, NameStoreProcedure.GET_FLORES_SP, "Maquinaria eliminada exitosamente.");
        }

        public async Task<ApiResult<Machinery?>> GetByIdAsync(int id)
        {
            var entity = new Machinery
            {
                Id = id,
                Transaccion = "MACHINERY_GET_BY_ID"
            };

            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                var result = await DBXmlMethods.EjecutaBase(NameStoreProcedure.GET_FLORES_SP, _connectionString, entity.Transaccion, xml.ToString());

                if (result.Tables.Count > 0 && result.Tables[0].Rows.Count > 0)
                {
                    var machinery = MapFromRow(result.Tables[0].Rows[0]);
                    return new ApiResult<Machinery?>(200, machinery, "Maquinaria encontrada.");
                }

                return new ApiResult<Machinery?>(404, null, "No se encontró la maquinaria.");
            }
            catch (Exception ex)
            {
                return new ApiResult<Machinery?>(500, null, $"Ocurrió un error: {ex.Message}");
            }
        }

        public async Task<ApiResult<IEnumerable<Machinery>>> GetAllAsync()
        {
            var entity = new Machinery { Transaccion = "MACHINERY_GET_ALL" };

            try
            {
                var xml = DBXmlMethods.GetXml(entity)!;
                var result = await DBXmlMethods.EjecutaBase(NameStoreProcedure.GET_FLORES_SP, _connectionString, entity.Transaccion, xml.ToString());

                var list = new List<Machinery>();

                if (result.Tables.Count > 0)
                {
                    foreach (DataRow row in result.Tables[0].Rows)
                    {
                        list.Add(MapFromRow(row));
                    }
                }

                return new ApiResult<IEnumerable<Machinery>>(200, list, "Listado de maquinarias obtenido correctamente.");
            }
            catch (Exception ex)
            {
                return new ApiResult<IEnumerable<Machinery>>(500, Enumerable.Empty<Machinery>(), $"Ocurrió un error: {ex.Message}");
            }
        }

        private async Task<ApiResult> ExecuteNonQueryAsync(Machinery entity, string storedProcedure, string mensajeExito)
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

        private Machinery MapFromRow(DataRow row)
        {
            return new Machinery
            {
                Id = Convert.ToInt32(row["id"]),
                Name = row["name"]?.ToString(),
                Type = row["type"]?.ToString(),
                Brand = row["brand"]?.ToString(),
                Model = row["model"]?.ToString(),
                OriginCountry = row["originCountry"]?.ToString(),
                ImageUrl = row["imageUrl"]?.ToString()
            };
        }
    }
}
