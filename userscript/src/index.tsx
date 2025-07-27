import { createRoot } from "react-dom/client";
import indexCss from "./index.css?inline";
import appCss from "./App.css?inline";
import App from "./App";
import { awaitElement, log, addLocationChangeCallback } from "./utils";

log("React script has successfully started");

// Do required initial work. Gets called every time the URL changes,
// so that elements can be re-inserted as a user navigates a page with
// different routes.
async function main() {
  // 1. Cria/obtém referência ao <tbody> da charMainToolbox
  const toolboxBody = (await awaitElement(
    ".charMainToolbox table tbody"
  )) as HTMLTableSectionElement;

  // Evita duplicar link se o script for executado em trocas de rota
  if (!toolboxBody.querySelector("#smartphone-tool-row")) {
    const row = document.createElement("tr");
    row.id = "smartphone-tool-row";
    row.innerHTML = `
      <td class="middle" style="width: 13px;"><img title="Smartphone" src="/Static/Icons/TinyIcon_Phone.png" alt="Smartphone" style="border-width:0px;"></td>
      <td><a href="#" id="smartphone-link">Smartphone</a></td>
    `;
    toolboxBody.appendChild(row);
  }

  const link = toolboxBody.querySelector<HTMLAnchorElement>("#smartphone-link")!;

  // 2. Cria o iframe inicialmente escondido
  const iframeId = "popgram-smartphone-iframe";
  let iframe = document.getElementById(iframeId) as HTMLIFrameElement | null;
  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = iframeId;
    iframe.style.border = "none";
    iframe.style.width = "450px";
    iframe.style.height = "850px";
    iframe.style.position = "fixed";
    iframe.style.top = "10px";
    iframe.style.left = "10px";
    iframe.style.zIndex = "2147483647";
    iframe.style.display = "none";
    iframe.style.background = "transparent";
    // Permissões suficientes para que formulários, pop-ups e scripts funcionem sem afetar o DOM pai
    iframe.setAttribute("sandbox", "allow-forms allow-modals allow-popups allow-scripts allow-same-origin");
    document.body.appendChild(iframe);

    // Usa srcdoc para garantir carregamento inicial do documento do iframe
    iframe.srcdoc = `<!DOCTYPE html>
<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\">\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n    <title>Popgram</title>\n    <style>${indexCss}\n${appCss}</style>\n  </head>\n  <body style=\"background: transparent; margin: 0; padding: 0;\">\n    <div id=\"popgram-wrapper\" style=\"background: transparent;\"></div>\n  </body>\n</html>`;

    // Renderiza React dentro do iframe após ele carregar
    iframe.addEventListener("load", () => {
      const iframeDoc = iframe!.contentDocument || iframe!.contentWindow!.document;
      const reactContainer = iframeDoc.querySelector<HTMLDivElement>("#popgram-wrapper")!;
      const root = createRoot(reactContainer);
      root.render(<App />);
    });

    // Escuta mensagens para fechar
    window.addEventListener("message", (e) => {
      if (e.data === "closeSmartphone") {
        iframe!.style.display = "none";
      }
    });
  }

  // 3. Toggle ao clicar no novo link
  link.onclick = (ev) => {
    ev.preventDefault();
    iframe!.style.display = iframe!.style.display === "none" ? "block" : "none";
  };

  // nada mais a fazer dentro de main após configuração inicial.
}

// Call `main()` every time the URL changes, incluindo o primeiro carregamento.
addLocationChangeCallback(() => {
  main().catch((e) => {
    log(e);
  });
});
