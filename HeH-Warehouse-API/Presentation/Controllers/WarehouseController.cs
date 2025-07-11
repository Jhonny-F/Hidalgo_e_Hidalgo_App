using Microsoft.AspNetCore.Mvc;
using Domain.Models;
using Domain.Repositories;
using Presentation.ModelResponse;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehouseController : ControllerBase
    {
        private readonly IWarehouseRepository _warehouseRepository;

        public WarehouseController(IWarehouseRepository warehouseRepository)
        {
            _warehouseRepository = warehouseRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResult<IEnumerable<Warehouse>>>> GetAll()
        {
            var result = await _warehouseRepository.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResult<Warehouse?>>> GetById(int id)
        {
            var result = await _warehouseRepository.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResult>> Add([FromBody] Warehouse warehouse)
        {
            var result = await _warehouseRepository.AddAsync(warehouse);
            return Ok(result);
        }

        [HttpPut]
        public async Task<ActionResult<ApiResult>> Update([FromBody] Warehouse warehouse)
        {
            var result = await _warehouseRepository.UpdateAsync(warehouse);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResult>> Delete(int id)
        {
            var result = await _warehouseRepository.DeleteAsync(id);
            return Ok(result);
        }
    }
}
