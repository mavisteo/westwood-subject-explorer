from pathlib import Path
import zipfile
p=Path(__file__).parent; dist=p/'dist'; gas=p/'google-apps-script'
html=(dist/'index.html').read_text().replace('<link rel="stylesheet" href="style.css">','<style><?!= HtmlService.createHtmlOutputFromFile("Styles").getContent(); ?></style>').replace('<script src="app.js"></script>','<script>window.BOOTSTRAP=<?!= bootstrap ?>; window.STAFF_URL=<?!= JSON.stringify(staffUrl) ?>;</script><script>'+ (dist/'app.js').read_text().replace('</script','<\\/script')+'</script>')
html=html.replace('<script src="eae.js"></script>', '<script>'+(dist/'eae.js').read_text().replace('</script','<\\/script')+'</script>')
html=html.replace('src="assets/westwood-official-logo.jpg"', 'src="https://isomer-user-content.by.gov.sg/818/724d0658-c745-412b-a084-fa98e9996bfc/logo13000.jpg"')
html=html.replace('src="assets/', 'src="https://westwood-subject-explorer-2027.apicalmavistem.chatgpt.site/assets/')
(gas/'Student.html').write_text(html)
(gas/'Styles.html').write_text((dist/'style.css').read_text())
(gas/'Seed.html').write_text((dist/'data.json').read_text())
(gas/'Setup.html').write_text((dist/'setup.html').read_text())
with zipfile.ZipFile(dist/'google-sites-setup.zip','w',zipfile.ZIP_DEFLATED) as z:
 for f in gas.iterdir():z.write(f,f.name)
