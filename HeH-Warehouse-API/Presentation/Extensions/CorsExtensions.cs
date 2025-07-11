namespace Presentation.Extensions
{
    public static class CorsExtensions
    {
        public static void AddCustomCors(this IServiceCollection services)
        {
            services.AddCors(options =>
            {
                options.AddPolicy("AllowWebapp", builder =>
                {
                    builder.AllowAnyOrigin() 
                           .AllowAnyHeader()
                           .AllowAnyMethod();
                });
            });
        }
    }
}
