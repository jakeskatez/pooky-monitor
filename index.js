const request = require("request");
const cheerio = require("cheerio");
const webhook = require("webhook-discord");

var pookyWebhoook = new webhook.Webhook("");
var proxy = ""; // ip:port OR user:pass@ip:port (optional)

var flags = {
	EU: "🇪🇺",
	US: "🇺🇸",
	JP: "🇯🇵"
};

(function getPooky()
{
	request({
		url: "https://www.supremenewyork.com/mobile/",
		proxy: (proxy.length > 0 ? "http://" + proxy : null)
	}, (error, meta, response) =>
	{
		var $ = cheerio.load(response);
		var found, href, tohru;

		var region = $("body").hasClass("eu") ? "EU" : ($("body").hasClass("us") ? "US" : "JP");
		console.log(`Waiting For Pooky (${region} ${meta.statusCode})`);

		$("script").filter(function()
		{
			var script = $(this).html();
			var src = $(this).attr("src");

			if (script.includes("supremetohru"))
				tohru = script.split("=")[1].replace(/[\s=";]/g, "");

			if (src != undefined && src.includes("pooky"))
			{
				var src = (src.charAt(0) == "/" ? "https:" + src : src);

				var message = new webhook.MessageBuilder()
					.setName("Pooky")
					.setColor("#00c800")
					.addField("New Pooky Version", "Region: " + flags[region])
					.addField("URL", src)
					.addField("Tohru", tohru)
					.setTime();

				console.log("New Pooky Version Detected");
				found = true;
				pookyWebhoook.send(message);
			}
		});

		if (!found)
			setTimeout(() => getPooky(), 1000);
	});
})();