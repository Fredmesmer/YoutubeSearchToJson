var fs = require('fs')
const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');
    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 1,
    });
    await page.goto('https://www.youtube.com/results?search_query='+process.argv[2]);
    const [button] = await page.$x('/html/body/ytd-app/ytd-consent-bump-v2-lightbox/tp-yt-paper-dialog/div[2]/div[2]/div[5]/div[2]/ytd-button-renderer[2]/a/tp-yt-paper-button/yt-formatted-string');
    if (button) {
        await button.click();
    }


    const links = await page.$$('a');
    let lien;
    let title;
    let artists;
    let imglien;
    let i;
    let selected;

    selected = false
    for(i = 0;i<links.length;i++){
      await links[i].getProperty('href').then(data => {lien = data['_remoteObject']['value'];});
      if(lien.startsWith("https://www.youtube.com/watch") && selected === false){
        var index = i;
        selected = true
      }
    }
    await links[index].getProperty('href').then(data => {lien = data['_remoteObject']['value'];});
    

    selected = false
    for(let i = 0;i<links.length;i++){
      await links[i].getProperty('innerText').then(data => {title = data['_remoteObject']['value'];});
      if(title==="4:38\nNOW PLAYING" && selected === false){
        index = i;
        selected = true
      }
    }
    await links[index+1].getProperty('innerText').then(data => {title = data['_remoteObject']['value'];});
    await links[index+2].getProperty('innerText').then(data => {artists = data['_remoteObject']['value'];});
    


    let imaj = await page.$$('img');
    await imaj[2].getProperty('src').then(data => {imglien = data['_remoteObject']['value'];});

    console.log(lien);
    console.log(title);
    console.log(artists);
    console.log(imglien);


    let file = { "lien" : lien, "titre" : title, "artiste" : artists,"image" : imglien}
    var json = JSON.stringify(file);
    fs.writeFile('output.json',json,(err)=> {if(err){console.log(err);}else{console.log('Outputedd');}});
    await browser.close();
  })();
