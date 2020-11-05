const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/:id', async(req, res) => {
    let today = new Date();
    let TglWaktuStamp = ''+today.getFullYear()+(today.getMonth()+1)+today.getDate()+today.getHours()+today.getMinutes()+today.getSeconds();
    console.log(`parameter id dari url req.params.id => `, req.params.id);

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewport({width: 1280, height: 720});
    await page.goto('http://local.ct', {waitUntil: 'networkidle0'});

    //Proses login
    await page.type('#username', process.env.USERLOGIN);
    await page.type('#password', process.env.USERPASS);
    await Promise.all([
        page.click('#btnSubmit'),
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
    ]);

    //Print Profiles
    await page.goto('http://local.ct/api/index.php/farmer/cetak_beneficiary_profiles/CpgID/0/FarmerID/530702996', {waitUntil: 'networkidle0'});

    const pdfprint = await page.pdf({
        path: 'files/'+TglWaktuStamp+'-contoh.pdf',
        format: "A4",
        printBackground: true
    });

    await browser.close();

    if(pdfprint)
        res.status(200).send('PDF tergenerate, file bisa didownload di http://localhost:1200/'+TglWaktuStamp+'-contoh.pdf');
    else
        res.status(500).send('Generate PDF nya gagal bro/sis');
});

module.exports = router;