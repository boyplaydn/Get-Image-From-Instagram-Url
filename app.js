const puppeteer = require('puppeteer')
const fs = require('fs')
const downloader = require('image-downloader')
const instaUrl = 'INSTAGRAM URL'

function GetLargestImageFromSrcSet(srcSet) {
    const splitedSrcs = srcSet.split(',')
    const imgSrc = splitedSrcs[splitedSrcs.length - 1].split(' ')[0]

    return imgSrc
}

async function GetImageUrlsFromPage(url) {
    const browser = await puppeteer.launch()
    const page =  await browser.newPage()
    await page.goto(url)

    const imageSrcSet = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('article img'))
        const srcSetAttribute = imgs.map( i => i.getAttribute('srcset'))

        return srcSetAttribute
    })

    const imgUrls = imageSrcSet.map(srcSet => GetLargestImageFromSrcSet(srcSet))
    await browser.close()
    
    return imgUrls
}

async function main () {
    const resultFolder = './result'

    if (!fs.existsSync(resultFolder)) {
        fs.mkdirSync(resultFolder)
    }

    const images = await GetImageUrlsFromPage(instaUrl)
        
    images.forEach(image => {
        downloader({
            url: image,
            dest: resultFolder
        })
    })

}

main()

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

// app.listen(8000, () => {
//   console.log('Example app listening on port 8000!')
// });