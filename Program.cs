using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using ZTMApp;
using ZTMApp.Models;

var builder = WebApplication.CreateBuilder(args);
var client = new HttpClient();
builder.Services.AddDbContext<ZTMDb>(opt => opt.UseSqlite());
builder.Services.AddMemoryCache();

var app = builder.Build();
var memoryCache = app.Services.GetService<IMemoryCache>();

app.MapPost("/adduser", async (User user, ZTMDb db) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Created($"/adduser/{user.Login}", user);
});

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


app.MapGet("/listusers", async (ZTMDb db) =>
    await db.Users.ToListAsync());

app.MapGet("/listuserbusstops/{userId}", async (int userId, ZTMDb db) =>
{
    var user = await db.Users.FirstAsync(u => u.Id == userId);
    var busStopsId = Repository.getBusStops(user);

    var arrayWraps = new List<ArrayWrap>(); 

    foreach (var stopId in busStopsId ?? new List<int>())
    {
        var jsonResponse = await fetchDataFromUri($"http://ckan2.multimediagdansk.pl/delays?stopId={stopId}");
        var infoArray = JsonConvert.DeserializeObject<RootDelayArray>(jsonResponse ?? "")?.delay;

        var arrayWrap = new ArrayWrap()
        {
            Delays = infoArray!,
            StopId = stopId
        };

        if (infoArray != null)
        {
            arrayWraps.Add(arrayWrap);
        }
    }

    return System.Text.Json.JsonSerializer.Serialize(arrayWraps);
});

app.MapGet("/stopinfo/{stopId}", async (int stopId) => 
    Results.Content(await fetchDataFromUri($"http://ckan2.multimediagdansk.pl/delays?stopId={stopId}")));

app.MapGet("/busstops", async () =>

    await memoryCache!.GetOrCreateAsync("stopinfo", async entry =>
    {
        return await fetchDataFromUri("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json");
    })
);

// from query
app.MapPost("/addbusstop", async (int userId, int busStopId,  ZTMDb db) =>
{
    try
    {
        var user = await db.Users.FirstAsync(u => u.Id == userId);

        Repository.addBusStop(user, busStopId, db);

        return Results.Ok();
    }
    catch (Exception)
    {
        // or internalServerError
        return Results.BadRequest();
    }
});

async Task<string?> fetchDataFromUri(string uri)
{
    var requestContent = (await client.GetAsync(uri)).Content;
    var jsonContent = await requestContent.ReadAsStringAsync();

    return jsonContent;
}

app.MapDelete("/deletebusstop", async (int userId, int busStopId, ZTMDb db) =>
{
    try
    {
        var user = await db.Users.FirstAsync(u => u.Id == userId);

        Repository.deleteBusStop(user, busStopId, db);

        return Results.Ok();
    }
    catch (Exception)
    {
        // or internalServerError
        return Results.BadRequest();
    }
});

app.MapGet("/", () => "Hello World!");

app.Run();
