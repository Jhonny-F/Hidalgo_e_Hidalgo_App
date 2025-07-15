namespace Heli.WarehouseAPI.Domain.Models;

public class ConstructionMaterial
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string MaterialType { get; set; } = "General";
    public string UnitOfMeasure { get; set; } = "UN";
    public decimal UnitPrice { get; set; }
    public int Stock { get; set; }
    public int MinStock { get; set; }
    public int MaxStock { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public string? Transaccion { get; set; }

}