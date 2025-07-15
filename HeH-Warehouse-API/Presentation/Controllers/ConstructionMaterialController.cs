using Domain.Models;
using Domain.Repositories;
using Heli.WarehouseAPI.Domain.Models;
using Heli.WarehouseAPI.Domain.Repositories;
using Microsoft.AspNetCore.Mvc;
using Presentation.ModelResponse;

namespace Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConstructionMaterialController : ControllerBase
    {
        private readonly IConstructionMaterialRepository _constructionMaterialRepository;

        public ConstructionMaterialController(IConstructionMaterialRepository constructionMaterialRepository)
        {
            _constructionMaterialRepository = constructionMaterialRepository;
        }

        [HttpGet]
        public async Task<ActionResult<ApiResult<IEnumerable<ConstructionMaterial>>>> GetAll()
        {
            var result = await _constructionMaterialRepository.GetAllAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResult<ConstructionMaterial?>>> GetById(int id)
        {
            var result = await _constructionMaterialRepository.GetByIdAsync(id);
            return Ok(result);
        }

        [HttpPost]
        
        /*Error Pendiente
        public async Task<ActionResult<ApiResult>> Add([FromBody] ConstructionMaterial constructionMaterial)
        {
            var result = await _constructionMaterialRepository.AddAsync(constructionMaterial);
            return Ok(result);
        }*/

        [HttpPut]
        public async Task<ActionResult<ApiResult>> Update([FromBody] ConstructionMaterial constructionMaterial)
        {
            var result = await _constructionMaterialRepository.UpdateAsync(constructionMaterial);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ApiResult>> Delete(int id)
        {
            var result = await _constructionMaterialRepository.DeleteAsync(id);
            return Ok(result);
        }
    }
}