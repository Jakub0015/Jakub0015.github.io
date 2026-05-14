type Styl = {
    nazwa: string;
    plik: string;
};

const style: Styl[] = [
    { nazwa: "Styl 1", plik: "style-1.css" },
    { nazwa: "Styl 2", plik: "style-2.css" },
    { nazwa: "Styl 3", plik: "style-3.css" }
];

let aktualnyStyl: Styl = style[0];
let aktualnyLink: HTMLLinkElement | null = null;

function podlaczStyl(styl: Styl): void {
    if (aktualnyLink !== null) {
        aktualnyLink.remove();
    }

    const link: HTMLLinkElement = document.createElement("link");
    link.rel = "stylesheet";
    link.href = styl.plik;
    link.id = "aktywny-styl";

    document.head.appendChild(link);
    aktualnyLink = link;
    aktualnyStyl = styl;
}

function utworzMenuStyli(): void {
    const panel: HTMLElement = document.createElement("section");
    panel.id = "zmiana-stylu";

    const tytul: HTMLHeadingElement = document.createElement("h3");
    tytul.textContent = "Zmień styl strony";
    panel.appendChild(tytul);

    for (const styl of style) {
        const przycisk: HTMLButtonElement = document.createElement("button");
        przycisk.textContent = styl.nazwa;

        przycisk.addEventListener("click", function (): void {
            podlaczStyl(styl);
        });

        panel.appendChild(przycisk);
    }

    document.body.insertBefore(panel, document.body.firstChild);
}

podlaczStyl(aktualnyStyl);
utworzMenuStyli();
