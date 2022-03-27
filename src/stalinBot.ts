import * as puppeteer from "puppeteer";

export class StalinBot {
  private data: string[] = [];

  async query(search: string) {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    });
    const page = await browser.newPage();

    search = "stackoverflow " + search;
    search.replace(" ", "+");

    await page.goto("https://google.com/?q=" + search);

    await page.waitFor(100);

    await page.evaluate(() => {
      let form = document.querySelector<HTMLFormElement>("form");
      form?.submit();
    });

    await page.waitForSelector("div.yuRUbf", {
      visible: true,
    });

    await page.waitFor(3000);

    const content = await page.evaluate(() => {
      const links = document.querySelectorAll("a");
      const urls = Array.from(links).map((v) => v.href);

      return urls;
    });

    let i: number = 0;
    let found = false;
    while (i < content.length && !found) {
      if (
        content[i] !== undefined &&
        content[i] !== null &&
        content[i] !== ""
      ) {
        if (content[i].includes("stackoverflow.com")) {
          found = true;
          await page.goto(content[i]);
        }
      }
      i++;
    }

    this.data = await page.evaluate(() => {
      const parents = document.querySelectorAll("code");
      /*let elements: Element[] = [];
      for (let i = 0; i < parents.length; i++) {
        let elem = parents[i].querySelectorAll(":scope > code");
        if (elem) {
          if (elem.length === 1) {
            elements.push(elem[0]);
          } else {
            let final: string = "";
            for (let j = 0; j < elem.length; i++) {
              final += elem[j].innerHTML;
            }
          }
        }
      }*/
      const codes = Array.from(parents).map((v) => v.innerText);

      return codes;
    });

    await browser.close();
  }

  get getData(): string[] {
    return this.data;
  }
}
