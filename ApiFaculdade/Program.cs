using Microsoft.EntityFrameworkCore;
using ApiFaculdade.Controllers; //enxergar controllers
using ApiFaculdade.Models;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers(); // add os controllers
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

