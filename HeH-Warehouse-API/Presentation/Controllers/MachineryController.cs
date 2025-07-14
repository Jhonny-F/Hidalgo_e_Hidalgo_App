using Domain.Models;
using Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using Presentation.ModelResponse;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MachineryController : ControllerBase
    {
        private readonly IMachineryRepository _machineryRepository;

        public MachineryController(IMachineryRepository machineryRepository)
        {
            _machineryRepository = machineryRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResult<IEnumerable<Machinery>>>> GetAll()
        {
            var result = await _machineryRepository.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResult<Machinery?>>> GetById(int id)
        {
            var result = await _machineryRepository.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ApiResult>> Add([FromBody] Machinery machinery)
        {
            var result = await _machineryRepository.AddAsync(machinery);
            return Ok(result);
        }

        [HttpPut]
        public async Task<ActionResult<ApiResult>> Update([FromBody] Machinery machinery)
        {
            var result = await _machineryRepository.UpdateAsync(machinery);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResult>> Delete(int id)
        {
            var result = await _machineryRepository.DeleteAsync(id);
            return Ok(result);
        }
    }
}
