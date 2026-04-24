using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Data;
using ApiFaculdade.Repository; // enxergar repository
using ApiFaculdade.Repository.interfaces;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers(); // add os controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=app.db"));

//escopos de IRepositorys

builder.Services.AddScoped<ICursoRepository, CursoRepository>();
builder.Services.AddScoped<IAlunoRepository, AlunoRepository>();
builder.Services.AddScoped<IFuncionarioRepository, FuncionarioRepository>();
builder.Services.AddScoped<ITurmaRepository, TurmaRepository>();


var app = builder.Build();

app.MapControllers();
//mapear controllers no app


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.Run();

