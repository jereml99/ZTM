namespace ZTMApp.Models;
public class Delay
{
    public string id { get; set; }
    public int delayInSeconds { get; set; }
    public string estimatedTime { get; set; }
    public string headsign { get; set; }
    public int routeId { get; set; }
    public int tripId { get; set; }
    public string status { get; set; }
    public string theoreticalTime { get; set; }
    public string timestamp { get; set; }
    public int trip { get; set; }
    public int vehicleCode { get; set; }
    public int vehicleId { get; set; }
}
