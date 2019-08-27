const request = require("request");
const cheerio = require("cheerio");
const webhook = require("webhook-discord");

var pookyWebhook = new webhook.Webhook("URL");
var proxy = ""; // ip:port OR user:pass@ip:port (optional)

(function getPooky()
{
	console.log("Waiting for Pooky");

	request(
	{
		url: "https://www.supremenewyork.com/mobile/",
		proxy: (proxy.length > 0 ? "http://" + proxy : null)
	}, (error, meta, response) =>
	{
		var $ = cheerio.load(response);
		var found, href, tohru, region;
		
		$("script").filter(function()
		{
			var script = $(this).html();
			var src = $(this).attr("src");
			
			if (script.includes("supremetohru"))
				tohru = script.split("=")[1].replace(/[\s=";]/g, "");

			if (src != undefined && src.includes("pooky"))
			{
				var message = new webhook.MessageBuilder()
					.setName("Pooky")
					.setColor("#00c800")
					.addField("New Pooky Version", "Region: " + ($("body").hasClass("eu") ? "🇪🇺" : "🇺🇸"))
					.addField("URL", src.charAt(0) == "/" ? "https:" + src : src)
					.addField("Tohru", tohru)
					.setTime();

				console.log("New Pooky script detected");
				found = true;
				pookyWebhook.send(message);
			}
		});

		if (!found)
			setTimeout(() => getPooky(), 1000);
	});
})();
