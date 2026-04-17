using Microsoft.EntityFrameworkCore;

using ApiFaculdade.Controllers; //enxergar controllers
using ApiFaculdade.Models;
using ApiFaculdade.Data;
using ApiFaculdade.Repository; // enxergar repository


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers(); // add os controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=app.db"));

//escopos de IRepositorys

builder.Services.AddScoped<ICursoRepository, CursoRepository>();
builder.Services.AddScoped<IAlunoRepository, AlunoRepository>();
var app = builder.Build();

app.MapControllers();
//mapear controllers no app


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();


app.Run();

