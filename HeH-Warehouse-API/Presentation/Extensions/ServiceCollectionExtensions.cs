using Domain.Repositories;
using Infrastructure.Implementation;

namespace Presentation.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static void AddApplicationModules(this IServiceCollection services)
        {
            services.AddScoped<IWarehouseRepository, WarehouseRepository>();
            services.AddScoped<IMachineryRepository, MachineryRepository>();
        }
    }
}