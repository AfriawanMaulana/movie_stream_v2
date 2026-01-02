// import { NextRequest, NextResponse } from "next/server";
// import puppeteer from "puppeteer";

// export async function GET(req: NextRequest) {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();

//   await page.goto('https://tv6.lk21official.cc/jurassic-world-rebirth-2025');
//   await page.waitForSelector('#loadPlayer iframe');

//   const pageTitle = await page.title();
//   const iframeSrc = await page.$eval('#loadPlayer iframe', el => el.src);

//   await browser.close();

//   return NextResponse.json({ title: pageTitle, iframeSrc: iframeSrc }, { status: 200 });
// }
