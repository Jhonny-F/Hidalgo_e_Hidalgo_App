using Presentation.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationModules();
builder.Services.AddCustomCors();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddConstructionMaterialServices();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowWebapp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

