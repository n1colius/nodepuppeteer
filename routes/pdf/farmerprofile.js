const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/:id', async(req, res) => {
    let today = new Date();
    let TglWaktuStamp = ''+today.getFullYear()+(today.getMonth()+1)+today.getDate()+today.getHours()+today.getMinutes()+today.getSeconds();
    console.log(`parameter id dari url req.params.id => `, req.params.id);

    try {
        
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setViewport({width: 1280, height: 720});
        await page.goto('http://local.web', {waitUntil: 'networkidle0'});

        //Proses login
        await page.type('#username', process.env.USERLOGIN);
        await page.type('#password', process.env.USERPASS);
        await Promise.all([
            page.click('#btnSubmit'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);

        //akses ke halaman yg mau diprint
        await page.goto('http://local.web/url_print_pdf_format_htmlnya', {waitUntil: 'networkidle0'});

        const pdfprint = await page.pdf({
            path: 'files/'+TglWaktuStamp+'-contoh.pdf',
            format: "A4",
            printBackground: true
        });

        await browser.close();

        if(pdfprint)
            res.status(200).send({success:true, message:'PDF tergenerate, file bisa didownload di http://localhost:1200/'+TglWaktuStamp+'-contoh.pdf'});
        else
            res.status(500).send({success:false, message:'Generate PDF nya gagal bro/sis'});

    } catch (err) {
        console.error(err.message);
        return res.status(500).json({success: 'failed'});
    }

});

module.exports = router;