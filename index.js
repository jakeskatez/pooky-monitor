const puppeteer = require("puppeteer");
const webhook = require("webhook-discord");
var pookyWebhook = new webhook.Webhook("https://discordapp.com/api/webhooks/568253383568261141/8QgdvuiuVCHRBQwRy75NuF2Wk89eFqMlrTUaW2kNTbwAGGreotKEgpe6PbdcU7VnHtYF");

(async() =>
{
	var browser = await puppeteer.launch();
	page = (await browser.pages())[0];

	getPooky();
})();

async function getPooky()
{
	await page.goto("https://www.supremenewyork.com/shop/");
	console.log("Fetching Pooky");

	var pooky = await page.evaluate(() =>
	{
		var found = false;
		var href, region, tohru;

		$("script").filter(function()
		{
			var src = $(this).attr("src");

			if (src != undefined && src.includes("pooky"))
			{
				found = true;
				href = src.charAt(0) == "/" ? "https:" + src : src;
				region = document.body.classList.contains("eu") ? "EU" : "US"
				tohru = window.supremetohru;
			}
		});

		return {found: found, region: region, href: href, tohru: tohru};
	});

	if (pooky.found)
	{
		var message = new webhook.MessageBuilder()
			.setName("Pooky")
			.setColor("#00c800")
			.addField("New Pooky script", "Region: " + (pooky.region == "EU" ? "🇪🇺" : "🇺🇸"))
			.addField("URL", pooky.href)
			.addField("Tohru", pooky.tohru)
			.setTime();

		pookyWebhook.send(message);
	}
	else
		setTimeout(() => getPooky(), 2000);
}