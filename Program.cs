using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Text.Json;
using ZTMApp;
using ZTMApp.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddResponseCaching();
var client = new HttpClient();
builder.Services.AddDbContext<ZTMDb>(opt => opt.UseSqlite());

var app = builder.Build();

app.UseMiddleware<AddCacheHeadersMiddleware>();

app.UseResponseCaching();

app.MapGet("/listusers", async (ZTMDb db) =>
    await db.Users.ToListAsync());

app.MapGet("/listuserbusstops/{userId}", async (int userId, ZTMDb db) =>
{
    var user = await db.Users.FirstAsync(u => u.Id == userId);
    var busStopsId = user.BusStops?.Split(' ').Select(int.Parse);

    var infoArrays = new List<List<Delay>>();

    foreach (var stopId in busStopsId ?? new List<int>())
    {
        var jsonResponse = await fetchDataFromUri($"http://ckan2.multimediagdansk.pl/delays?stopId={stopId}");
        var infoArray = JsonConvert.DeserializeObject<RootDelayArray>(jsonResponse ?? "")?.delay;

        if(infoArray != null)
        {
           infoArrays.Add(infoArray);
        }
    }

    return System.Text.Json.JsonSerializer.Serialize(infoArrays);
});


app.MapPost("/login", async (User user, ZTMDb db) =>
{
    try
    {
        var userFromDb = await db.Users.FirstAsync(u => u.Login == user.Login && u.Password == user.Password);

        if (userFromDb != null)
        {
            var data = new { id = userFromDb.Id };
            return Results.Ok(data);
        }
        else
        {
            return Results.NotFound();
        }
    }
    catch (Exception)
    {
        return Results.NotFound();
    }
});

app.MapGet("/stopinfo/{stopId}", async (int stopId) =>
    Results.Content(await fetchDataFromUri($"http://ckan2.multimediagdansk.pl/delays?stopId={stopId}")));

app.MapGet("/busstops", () =>
    fetchDataFromUri("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json")).CacheOutput();

async Task<string?> fetchDataFromUri(string uri)
{
    var requestContent = (await client.GetAsync(uri)).Content;
    var jsonContent = await requestContent.ReadAsStringAsync();

    return jsonContent;
}

app.MapPost("/adduser", async (User user, ZTMDb db) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Created($"/adduser/{user.Login}", user);
});

// from query
app.MapPost("/addbusstop", async (int userId, int busStopId,  ZTMDb db) =>
{
    try
    {
        var user = await db.Users.FirstAsync(u => u.Id == userId);

        addBusStop(user, busStopId, db);

        return Results.Ok();
    }
    catch (Exception)
    {
        // or internalServerError
        return Results.BadRequest();
    }
});

async void addBusStop(User user, int busStopId, ZTMDb db)
{
    user.BusStops ??= "";

    var busStops = user.BusStops.Split(' ').Select(int.Parse);  // extract to method
    if (!busStops.Contains(busStopId))
    {
        user.BusStops += " " + busStopId;
        await db.SaveChangesAsync();
    }
}

app.MapDelete("/users/{id}", async (int id, ZTMDb db) =>
{
    if (await db.Users.FindAsync(id) is User user)
    {
        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return Results.Ok(user);
    }

    return Results.NotFound();
});

app.MapGet("/", () => "Hello World!");

app.Run();
