namespace ZTMApp.Models;

public class BusStop
{
    public int stopId { get; set; }
    public string stopCode { get; set; }
    public string stopName { get; set; }
    public string stopShortName { get; set; }
    public string stopDesc { get; set; }
    public string subName { get; set; }
    public string date { get; set; }
    public int? zoneId { get; set; }
    public string zoneName { get; set; }
    public int? @virtual { get; set; }
    public int? nonpassenger { get; set; }
    public int? depot { get; set; }
    public int? ticketZoneBorder { get; set; }
    public int? onDemand { get; set; }
    public string activationDate { get; set; }
    public double stopLat { get; set; }
    public double stopLon { get; set; }
    public string stopUrl { get; set; }
    public object locationType { get; set; }
    public object parentStation { get; set; }
    public string stopTimezone { get; set; }
    public object wheelchairBoarding { get; set; }
}
