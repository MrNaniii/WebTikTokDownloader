using Microsoft.AspNetCore.Mvc;
using TikTokDownloaderLib;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.IO;

[ApiController]
[Route("api/[controller]")]
public class TikTokController : ControllerBase
{
    private readonly TikTokDownloader _downloader = new TikTokDownloader();

    private readonly HttpClient client;

    public TikTokController()
    {
        var cookies = new CookieContainer();

        var handler = new HttpClientHandler
        {
            UseCookies = true,
            CookieContainer = cookies,
            AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate,
            AllowAutoRedirect = true
        };

        client = new HttpClient(handler);

        client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
        client.DefaultRequestHeaders.Add("Accept-Language", "en-US,en;q=0.9");
    }

    [HttpPost("detect")]
    public async Task<IActionResult> DetectType([FromBody] UrlRequest request)
    {
        if (string.IsNullOrEmpty(request.Url))
            return BadRequest("Url is required.");

        try
        {
            var type = await GetTikTokTypeAsync(request.Url);
            return Ok(new { type });
        }
        catch
        {
            return BadRequest("Failed to detect content type.");
        }
    }

    [HttpPost("download/video")]
    public async Task<IActionResult> DownloadVideo([FromBody] UrlRequest request)
    {
        if (string.IsNullOrEmpty(request.Url))
            return BadRequest("Url is required.");

        string tempFolder = Path.Combine(Path.GetTempPath(), "TikTokDownloads");
        Directory.CreateDirectory(tempFolder);

        string fileName = Path.GetRandomFileName() + ".mp4";
        string filePath = Path.Combine(tempFolder, fileName);

        try
        {
            await _downloader.DownloadVideoAsync(request.Url, tempFolder, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("Video not found.");

            byte[] bytes = await System.IO.File.ReadAllBytesAsync(filePath);
            System.IO.File.Delete(filePath);

            return File(bytes, "video/mp4", "video.mp4");
        }
        catch
        {
            return StatusCode(500, "Failed to download video.");
        }
    }

    [HttpPost("download/music")]
    public async Task<IActionResult> DownloadMusic([FromBody] UrlRequest request)
    {
        if (string.IsNullOrEmpty(request.Url))
            return BadRequest("Url is required.");

        string tempFolder = Path.Combine(Path.GetTempPath(), "TikTokDownloads");
        Directory.CreateDirectory(tempFolder);

        string fileName = Path.GetRandomFileName() + ".mp3";
        string filePath = Path.Combine(tempFolder, fileName);

        try
        {
            await _downloader.DownloadMusicAsync(request.Url, tempFolder, fileName);

            if (!System.IO.File.Exists(filePath))
                return NotFound("Music not found.");

            byte[] bytes = await System.IO.File.ReadAllBytesAsync(filePath);
            System.IO.File.Delete(filePath);

            return File(bytes, "audio/mpeg", "music.mp3");
        }
        catch
        {
            return StatusCode(500, "Failed to download music.");
        }
    }

    [HttpPost("download/photo")]
    public async Task<IActionResult> DownloadPhoto([FromBody] UrlRequest request)
    {
        if (string.IsNullOrEmpty(request.Url))
            return BadRequest("Url is required.");

        string photoFolder = Path.Combine(Path.GetTempPath(), "TikTokDownloads", "photos_" + Path.GetRandomFileName());
        Directory.CreateDirectory(photoFolder);

        try
        {
            await _downloader.DownloadImageAsync(request.Url, photoFolder, "photo.jpg");

            var files = Directory.GetFiles(photoFolder, "*.jpg");

            if (files.Length == 0)
                return NotFound("No photos downloaded.");

            string zipPath = Path.Combine(Path.GetTempPath(), Path.GetRandomFileName() + ".zip");
            System.IO.Compression.ZipFile.CreateFromDirectory(photoFolder, zipPath);

            byte[] zipBytes = await System.IO.File.ReadAllBytesAsync(zipPath);

            Directory.Delete(photoFolder, true);
            System.IO.File.Delete(zipPath);

            return File(zipBytes, "application/zip", "photos.zip");
        }
        catch
        {
            return StatusCode(500, "Failed to download photos.");
        }
    }

    private async Task<string> GetTikTokTypeAsync(string tiktokUrl)
    {
        var response = await client.GetAsync(tiktokUrl);
        Uri fullUrl = response.RequestMessage.RequestUri;

        var match = Regex.Match(fullUrl.ToString(), @"tiktok\.com/@[^/]+/(?<type>photo|video)/\d+");
        if (!match.Success)
            throw new InvalidOperationException("Cannot determine TikTok content type.");

        string type = match.Groups["type"].Value;
        Console.WriteLine(type);
        return type;
    }
}

public class UrlRequest
{
    public string Url { get; set; }
}
