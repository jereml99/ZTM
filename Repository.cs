using ZTMApp.Models;

namespace ZTMApp
{
    public class Repository
    {
        public static List<int> getBusStops(User user)
        {
            List<int> busStops = new();

            if (user.BusStops == null || user.BusStops.Length == 0) return busStops;

            if (user.BusStops.Contains(' '))
            {
                busStops = user.BusStops.Split(' ').Select(int.Parse).ToList();  // extract to method
            }
            else
            {
                busStops.Add(int.Parse(user.BusStops));
            }

            return busStops;
        }

        public static async void addBusStop(User user, int busStopId, ZTMDb db)
        {
            user.BusStops ??= "";

            var busStops = getBusStops(user);

            if (!busStops.Contains(busStopId))
            {
                if (busStops.Count > 0)
                {
                    user.BusStops += " ";
                }
                user.BusStops += busStopId;
                await db.SaveChangesAsync();
            }
        }


        public static async void deleteBusStop(User user, int busStopId, ZTMDb db)
        {
            user.BusStops ??= "";

            List<int> busStops = new();

            busStops = Repository.getBusStops(user);

            if (busStops.Contains(busStopId))
            {
                busStops = busStops.Where(u => u != busStopId).ToList();

                var busStopsString = "";
                foreach (var busStop in busStops)
                {
                    busStopsString += busStop.ToString() + " ";
                }

                if (busStopsString.Length > 0)
                {
                    busStopsString = busStopsString.Remove(busStopsString.Length - 1);
                }

                user.BusStops = busStopsString;
                await db.SaveChangesAsync();
            }
        }
    }
}
