const { Builder, By, until } = require("selenium-webdriver");
const firefox = require("selenium-webdriver/firefox");
const net = require("net");

async function waitForPort(port, host, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout waiting for port ${port} on host ${host}`));
    }, timeout);

    const client = net.createConnection(port, host, () => {
      clearTimeout(timer);
      client.end();
      resolve();
    });

    client.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

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
    // Attendre que le port soit disponible
    await waitForPort(3000, "frontend");

    await driver.get("http://frontend:3000/");
    await driver.manage().window().setRect({ width: 1510, height: 871 });

    // Attendre que l'input soit présent
    await driver.wait(until.elementLocated(By.css("input")), 10000);
    const input = await driver.findElement(By.css("input"));
    await input.click();
    await input.sendKeys("this is a task");

    const addButton = await driver.findElement(By.css("button:nth-child(2)"));
    await addButton.click();
  });
});
