const { Builder, By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");

describe("E2E Test", function () {
  this.timeout(30000);
  let driver;

  beforeEach(async function () {
    let options = new firefox.Options().addArguments("--headless");
    driver = new Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(options)
      .build();
    driver.manage().setTimeouts({ implicit: 10000 });
  });

  afterEach(async function () {
    await driver.quit();
  });

  it("Should add a task", async function () {
    await driver.get("http://localhost:3001/");
    await driver.manage().window().setRect({ width: 1510, height: 871 });

    await driver.wait(until.elementLocated(By.css("input")), 10000);
    const input = await driver.findElement(By.css("input"));
    await input.click();
    await input.sendKeys("this is a task");

    const addButton = await driver.findElement(By.css("button:nth-child(2)"));
    await addButton.click();
  });
});
