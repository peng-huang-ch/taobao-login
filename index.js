const path = require('path');
const config = require('config');
const puppeteer = require('puppeteer');

const {
  js1,
  // js2,
  js3,
  js4,
  js5
} = require('./exec')

const TAOBAO_URI = 'https://login.taobao.com/member/login.jhtml?from=taobaoindex&f=top&style=&sub=true&redirect_url=https%3A%2F%2Fi.taobao.com%2Fmy_taobao.htm%3Fspm%3Da21bo.2017.1997525045.1.5af911d9wsVzdw'
const login = async (browser, username, password) => {
  const page = await browser.newPage();

  page.setViewport({
    width: 1376,
    height: 1376
  });

  await page.goto(TAOBAO_URI, {
    waitUntil: 'networkidle2'
  });

  await page.evaluate(js1)
  await page.waitFor(1000 + Math.floor(Math.random() * 1000));
  await page.evaluate(js3)
  
  await page.waitFor(1000 + Math.floor(Math.random() * 1000));
  
  await page.evaluate(js4)
  await page.waitFor(1000 + Math.floor(Math.random() * 1000));
  
  await page.evaluate(js5)
  await page.waitFor(1000 + Math.floor(Math.random() * 1000));

  await page.click('#J_Quick2Static');

  await page.waitFor(Math.floor(Math.random() * 500) * Math.floor(Math.random() * 10));
  const opts = {
    delay: 2 + Math.floor(Math.random() * 2), //每个字母之间输入的间隔
  }
  await page.tap('#TPL_username_1');
  await page.type('#TPL_username_1', username, opts);

  await page.waitFor(3000);

  await page.tap('#TPL_password_1');
  await page.type('#TPL_password_1', password, opts);

  await page.screenshot({
    'path': path.join(__dirname, 'screenshots', 'login.png')
  })

  const slider = await page.$eval('#nocaptcha', node => node.style);
  if (slider && Object.keys(slider).length) {
    await page.screenshot({
      'path': path.join(__dirname, 'screenshots', 'login-slide.png')
    })

    await mouseSlide(page)
  }

  await page.waitFor(1000 + Math.floor(Math.random() * 2000));
  // await page.tap('##nc_1_n1z');
  let loginBtn = await page.$('#J_SubmitStatic')
  await loginBtn.click({
    delay: 20
  })

  await page.waitFor(20)
  await page.waitForNavigation()
  const error = await page.$eval('.error', node => node.textContent)
  if (error) {
    console.log('确保账户安全重新入输入');
    process.exit(1)
  }
  return true;
}

const startServer = async () => {
  try {
    const pathToExtension = path.join(__dirname, 'chrome-mac/Chromium.app/Contents/MacOS/Chromium');
    const width = 1376;
    const height = 1376;
    const browser = await puppeteer.launch({
      headless: false,
      args: [
        `--window-size=${ width },${ height }`,
        // '--no-sandbox'
      ],
      // executablePath: pathToExtension
    });
    browser.userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299');
    const {
      username,
      password
    } = config.taobao;
    await login(browser, username, password)
    // browser.close()
  } catch (error) {
    console.error('error', error)
  }
}

const mouseSlide = async (page) => {
  let bl = false
  while (!bl) {
    try {
      await page.hover('#nc_1_n1z')
      await page.mouse.down()
      await page.mouse.move(2000, 0, {
        'delay': 1000 + Math.floor(Math.random() * 1000)
      })
      await page.mouse.up()

      slider_again = await page.$eval('.nc-lang-cnt', node => node.textContent)
      console.log('slider_again', slider_again)
      if (slider_again != '验证通过') {
        bl = false;
        await page.waitFor(1000 + Math.floor(Math.random() * 1000));
        break;
      }
      await page.screenshot({
        'path': path.join(__dirname, 'screenshots', 'result.png')
      })
      console.log('验证通过')
      return 1
    } catch (e) {
      console.log('error :slide login False', e)
      bl = false;
      break;
    }
  }
}


startServer()