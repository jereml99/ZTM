using Microsoft.EntityFrameworkCore;
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

app.MapPost("/login", async (User user, ZTMDb db) =>
{
    try
    {
        var userFromDb = await db.Users.FirstAsync(u => u.Login == user.Login && u.Password == user.Password);

        if (userFromDb != null)
        {
            return Results.Ok(userFromDb.Id);
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

app.MapGet("/stopInfo/{stopId}", (int stopId) =>
    fetchDataFromUri($"http://ckan2.multimediagdansk.pl/delays?stopId={stopId}"));

app.MapGet("/busstops", () =>
    fetchDataFromUri("https://ckan.multimediagdansk.pl/dataset/c24aa637-3619-4dc2-a171-a23eec8f2172/resource/4c4025f0-01bf-41f7-a39f-d156d201b82b/download/stops.json")).CacheOutput();

async Task<IResult> fetchDataFromUri(string uri)
{
    var requestContent = (await client.GetAsync(uri)).Content;
    var jsonContent = await requestContent.ReadAsStringAsync();

    return Results.Content(jsonContent);
}

app.MapPost("/adduser", async (User user, ZTMDb db) =>
{
    db.Users.Add(user);
    await db.SaveChangesAsync();

    return Results.Created($"/adduser/{user.Login}", user);
});

// from query
app.MapPost("/addbusstops", async (int userId, string busStops,  ZTMDb db) =>
{
    try
    {
        var user = await db.Users.FirstAsync(u => u.Id == userId);

        user.BusStops ??= "";

        user.BusStops += " " + busStops;
        await db.SaveChangesAsync();

        return Results.Ok(busStops);
    }
    catch (Exception)
    {
        // or internalServerError
        return Results.BadRequest();
    }
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

app.MapGet("/", () => "Hello World!");

app.Run();
