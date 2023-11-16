const puppeteer = require("puppeteer");
const fs = require("fs");

const run = async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto("https://www.wired.com/");

  // Extract headlines
  const headlinesWithLinks = await page.evaluate(() => {
    const headlineElements = document.querySelectorAll(
      "h2.SummaryItemHedBase-hiFYpQ.hkKqem.summary-item__hed"
    );

    const links = document.querySelectorAll(
      ".SummaryItemHedLink-civMjp.ejgyuy.summary-item-tracking__hed-link.summary-item__hed-link"
    );

    const headlinesWithLinks = [];

    for (let i = 0; i < headlineElements.length; i++) {
      const headlineText = headlineElements[i].textContent.trim();
      const link = links[i].getAttribute("href");

      headlinesWithLinks.push({
        headline: headlineText,
        link: link,
      });
    }

    return headlinesWithLinks;
  });
  fs.writeFileSync("data.json", JSON.stringify(headlinesWithLinks, null, 2));

  // Display headlines with hyperlinks
  headlinesWithLinks.forEach(({ headline, link }) => {
    console.log(`Headline: ${headline}`);
    console.log(`Link: https://www.wired.com${link}\n`);
  });

  await browser.close();
};
run();
