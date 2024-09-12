import axios from "axios";
import { fetch, file } from "bun";
import { parseHTML } from "linkedom";
import fs, { WriteStream } from "fs"
import path from "path";



async function sigStickCrawler(packID: string) {
    const url = `https://www.sigstick.com/pack/${packID}`
    const content = await fetch(url);

    const html = await content.text();


    const { document } = parseHTML(html);
    let destination = ""
    const img = document.querySelectorAll("img.Pack_stickerThumb__2_rFc");
    let packName = document.querySelector("div.Pack_title__uBz2J");
    if (packName) {
        destination = `/out/${(packName.textContent as string).replaceAll(" ", "_")}`;
    }

    img.forEach(async function (e) {
        const urlimage = e.getAttribute("src") as string;
        let filename: any = urlimage.split("/")
        filename = filename[filename.length - 1];
        try {
            await download(urlimage, `/${destination}/${filename}`);
            console.info(`${filename}: success`);
        } catch (error) {
            console.error(`${filename}: Gagal`);

        }
    })

}

async function download(file: string, destination: string) {
    try {
        const response = await fetch(file);
        if (response.ok) {
            await Bun.write(path.join(__dirname, `/downloaded/${destination}`), await response.blob() as any)
        }
    } catch (error) {
        throw error;
    }

}

const data = prompt("Masukan Pack name:")
if(data) {sigStickCrawler(data)}