/* Real-browser responsive QA for the GitHub Pages portfolio.
   Uses the runner's installed Google Chrome and lightweight Playwright Core.
   The checks never submit real contact or subscription data. */
const fs=require("node:fs");
const path=require("node:path");
const cp=require("node:child_process");
const {chromium}=require("playwright-core");

const root="https://arqadriantaberna-a11y.github.io/arq-adrian-taberna/";
const output=process.env.AUDIT_OUTPUT||path.resolve("responsive-audit");
const cases=[
 ["portada",""],
 ["casa-patio","proyectos/casa-patio/"],
 ["centro-ambulatorio","proyectos/centro-ambulatorio/"],
 ["torre-residencial","proyectos/torre-residencial/"],
 ["habitar-el-umbral","proyectos/habitar-el-umbral/"],
 ["habitar-el-vacio","proyectos/habitar-el-vacio/"],
 ["catalogo-mobiliario","diseno/"],
 ["ficha-mobiliario","diseno/comoda-blanca-paraiso/"],
 ["archivo-caligo","revista/caligo/"],
 ["caligo-001","revista/caligo/n001/"],
 ["caligo-002","revista/caligo/n002/"]
];
const widths=[
 {name:"movil",width:390,height:844},
 {name:"tablet",width:768,height:1024},
 {name:"escritorio",width:1440,height:900}
];
function chromePath(){
 if(process.env.CHROME_BIN&&fs.existsSync(process.env.CHROME_BIN))return process.env.CHROME_BIN;
 const commands=["google-chrome-stable","google-chrome","chromium","chromium-browser"];
 for(const bin of commands){
  try{const found=cp.execFileSync("which",[bin],{encoding:"utf8"}).trim();if(found)return found;}catch{}
 }
 throw Error("No hay navegador Chromium o Chrome disponible en el entorno de QA");
}
const sleep=n=>new Promise(r=>setTimeout(r,n));
async function main(){
 fs.mkdirSync(output,{recursive:true});
 const browser=await chromium.launch({
  executablePath:chromePath(),headless:true,
  args:["--no-sandbox","--disable-dev-shm-usage","--disable-background-networking","--disable-gpu"]
 });
 const rows=[],issues=[];
 try{
  for(const view of widths){
   const context=await browser.newContext({
    viewport:{width:view.width,height:view.height},deviceScaleFactor:1,
    isMobile:view.width<600,hasTouch:view.width<600,
    reducedMotion:"reduce",locale:"es-AR"
   });
   const page=await context.newPage();
   for(const [id,slug]of cases){
    const url=root+slug;
    const exceptions=[];
    const onPageError=err=>exceptions.push(err.message.slice(0,250));
    page.on("pageerror",onPageError);
    let result={viewport:view.name,width:view.width,page:id,url};
    try{
     const response=await page.goto(url,{waitUntil:"domcontentloaded",timeout:45000});
     await page.waitForTimeout(260);
     const geometry=await page.evaluate(()=>{
      const html=document.documentElement,body=document.body;
      const overflow=Math.max(html.scrollWidth,body?.scrollWidth||0)-window.innerWidth;
      let offenders=[];
      if(overflow>2){
       offenders=Array.from(document.querySelectorAll("body *")).filter(el=>{
        const style=getComputedStyle(el),r=el.getBoundingClientRect();
        if(style.display==="none"||style.visibility==="hidden")return false;
        if(r.width<4||r.height<4)return false;
        return r.right>window.innerWidth+3||r.left< -3;
       }).slice(0,10).map(el=>({
        tag:el.tagName.toLowerCase(),class:String(el.className||"").slice(0,90),
        right:Math.round(el.getBoundingClientRect().right),left:Math.round(el.getBoundingClientRect().left)
       }));
      }
      return {
       contentWidth:html.clientWidth,scrollWidth:Math.max(html.scrollWidth,body?.scrollWidth||0),
       overflow:Math.round(overflow),offenders,
       mainLandmarks:document.querySelectorAll("main").length,
       hasH1:!!document.querySelector("h1"),
       bodyFont:getComputedStyle(document.body).fontFamily,
       forms:document.querySelectorAll("form").length,
       figCount:document.querySelectorAll("figure").length
      };
     });
     result={...result,status:response?.status()||0,...geometry,jsErrors:exceptions};
     if(result.status!==200)issues.push(id+" ["+view.width+"] HTTP "+result.status);
     if(result.overflow>2)issues.push(id+" ["+view.width+"] scroll horizontal "+result.overflow+"px");
     if(!result.hasH1)issues.push(id+" ["+view.width+"] sin H1");
     if(id==="portada"){
      const menu=page.locator(".mobile-menu > summary");
      if(view.width<900&&await menu.count()){
       await menu.click({timeout:5000});
       result.mobileMenuOpened=await page.locator(".mobile-menu").evaluate(el=>el.open);
       if(!result.mobileMenuOpened)issues.push("Menú móvil no abrió a "+view.width);
       await menu.click({timeout:5000});
      }
      const trigger=page.locator(".ed-search-trigger");
      if(await trigger.count()){
       await trigger.click({timeout:5000});
       result.searchDialog=await page.locator(".ed-search-overlay").evaluate(el=>el.open);
       await page.locator("#ed-search-input").fill("Casa Patio");
       result.searchResultCount=await page.locator(".ed-search-result").count();
       if(!result.searchDialog||!result.searchResultCount)issues.push("Buscador no respondió a "+view.width);
       await page.locator(".ed-search-close").click({timeout:5000});
      }else issues.push("Falta buscador a "+view.width);
      result.newsletterForm=await page.locator("form.subscribe-form").count();
      result.contactForm=await page.locator("form.contact-form").count();
      result.caligoForm=await page.locator("form[data-caligo-subscribe]").count();
      if(result.newsletterForm!==1||result.contactForm!==1||result.caligoForm!==1)issues.push("Formularios faltantes a "+view.width);
      // The original hero carousel and furniture gallery must survive extraction
      // of large base64 files from the inline JavaScript controller.
      result.legacyScriptExternal=await page.locator('script[src="./editorial/legacy-home.js"]').count()===1;
      if(!result.legacyScriptExternal)issues.push("Falta controlador de galerías optimizado a "+view.width);
      await page.locator(".hero-arrow-next").click({timeout:5000});
      try{
       await page.waitForFunction(()=>document.querySelector(".hero-copy h1")?.textContent?.trim()==="Centro Ambulatorio",null,{timeout:2500});
       result.carouselTitle=(await page.locator(".hero-copy h1").textContent()).trim();
      }catch{
       result.carouselTitle=(await page.locator(".hero-copy h1").textContent()).trim();
       issues.push("Carrusel principal no avanzó a "+view.width+": "+result.carouselTitle);
      }
      if(view.width===390||view.width===1440){
       for(const [gallery,expected] of [["mesa-paraiso",6],["comoda-blanca-paraiso",6],["mesa-paraiso-blanca",6],["cama-plataforma-biblioteca",6]]){
        const card=page.locator('.design-card[data-gallery="'+gallery+'"]');
        if(!await card.count()){issues.push("No existe tarjeta de galería "+gallery);continue;}
        await card.click({timeout:10000});
        const modal=page.locator("#furniture-dialog");
        const open=await modal.evaluate(el=>el.open);
        const initialDots=await modal.locator(".furniture-dialog-dot").count();
        const picture=modal.locator("img").first();
        const initialSrc=await picture.getAttribute("src");
        if(!open||initialDots!==expected||!initialSrc){
         issues.push("Galería "+gallery+" no abrió correctamente a "+view.width);
        }else{
         await modal.locator(".furniture-dialog-arrow-next").click({timeout:5000});
         const nextSrc=await picture.getAttribute("src");
         if(!nextSrc||nextSrc===initialSrc)issues.push("Galería "+gallery+" no cambió de imagen a "+view.width);
         else {
          try{
           await page.waitForFunction(()=>{const im=document.querySelector('#furniture-dialog img');return !!im&&im.complete&&im.naturalWidth>0;},{},{timeout:10000});
          }catch{issues.push("No se cargó la imagen original de "+gallery+" a "+view.width);}
         }
        }
        await modal.locator(".furniture-dialog-close").click({timeout:5000});
       }
      }
     }
     if(id.startsWith("caligo-0")){
      const next=page.locator("#next");
      if(await next.count()){
       await next.click({timeout:5000});
       result.readerAdvanced=(await page.locator("#num").innerText({timeout:5000})).trim();
      }else issues.push("No se encontró el botón de página siguiente en "+id);
     }
     if(id==="portada"||id==="casa-patio"&&view.width===390||id==="catalogo-mobiliario"&&view.width===390||id==="caligo-002"&&view.width===390){
      try{await page.screenshot({path:path.join(output,view.name+"-"+id+".png"),animations:"disabled",timeout:15000});}
      catch(e){result.screenshotError=String(e.message).slice(0,160);}
     }
    }catch(err){
     result.error=String(err.message).slice(0,380);
     issues.push(id+" ["+view.width+"] "+result.error);
    }
    rows.push(result);
    console.log("RESPONSIVE "+JSON.stringify(result));
    page.off("pageerror",onPageError);
   }
   await page.close();await context.close();
  }
 }finally{await browser.close();}
 const report={site:root,checkedAt:new Date().toISOString(),cases:rows.length,issues,rows};
 fs.writeFileSync(path.join(output,"report.json"),JSON.stringify(report,null,2));
 console.log("QA_RESULT "+JSON.stringify({checked:rows.length,issues:issues.length,items:issues.slice(0,20)}));
 if(issues.length)process.exitCode=1;
}
main().catch(e=>{console.error("QA_FATAL",e);process.exitCode=1;});
