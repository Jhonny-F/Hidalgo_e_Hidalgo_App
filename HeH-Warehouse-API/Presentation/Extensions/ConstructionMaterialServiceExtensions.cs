using Heli.WarehouseAPI.Domain.Repositories;
using Infrastructure.Implementation;

namespace Microsoft.Extensions.DependencyInjection;

public static class ConstructionMaterialServiceExtensions
{
    public static IServiceCollection AddConstructionMaterialServices(this IServiceCollection services)
    {
        services.AddScoped<IConstructionMaterialRepository, ConstructionMaterialRepository>();
        return services;
    }
}