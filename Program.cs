using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using ZTMApp;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ZTMDb>(opt => opt.UseSqlite());

var app = builder.Build();

app.MapGet("/login", async (ZTMDb db) =>
    await db.Users.ToListAsync());

app.MapGet("/busstops", fetchBusStops);

static async Task<IResult> fetchBusStops()
{
    var client = new HttpClient();
    var requestContent = (await client.GetAsync("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json")).Content;
    var jsonContent = await requestContent.ReadAsStringAsync();
    //var stopsJson = JsonConvert.DeserializeObject(jsonContent);

    return Results.Content(jsonContent);
}

app.MapPost("/adduser", async (User user, ZTMDb db) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Created($"/adduser/{user.Name}", user);
});

app.MapGet("/", () => "Hello World!");

app.Run();
