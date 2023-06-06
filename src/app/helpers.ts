import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

const DATA_URL = '/assets/czasopisma.xml';

class MagazinesDB {
    public czasopisma: Magazie[] = [];

    public getNames = () => this.czasopisma
        .map(czasopismo => czasopismo.name);
    public getMagazine = (name: string) => this.czasopisma
        .find(czasopismo => czasopismo.name === name);

	constructor(private http: HttpClient) {
        this.load();
    }

    private load = () =>
        this.http.get(DATA_URL, { responseType: 'text' })
            .subscribe(data => {
                const rawCzasopisma = this.convertToJSON(data).czasopisma

                this.czasopisma = Object.entries(rawCzasopisma).reduce((acc, [name, value]) => {
                    if (name === 'zmienne' || name === 'lata')
                        return acc;

                    const publications = Object.values(value as any[])
                        .map(publication => new Publication(
                            publication.nazwa,
                            publication.numer,
                            parseInt(publication.stron),

                            publication.miniaturka,
                            publication.format,
                            publication.plik,

                            publication.podeslal,
                            publication.przetworzenie,
                            publication.skan,
                            publication.wydawca,
                        ));
                    const czasopismo = new Magazie(
                        name,
                        rawCzasopisma.zmienne[name].src,
                        rawCzasopisma.lata[name].split(',')
                            .map((year: string) => parseInt(year.trim())),
                        publications
                    )

                    acc.push(czasopismo);
                    return acc;
                }, [] as Magazie[])
            });

    private convertToJSON = (xml: string) => {
        let res: any = null

        const parser = new xml2js.Parser({explicitArray: false});
        parser.parseString(xml, (err, result) => res = result);

        return res;
    }
}

class Magazie {
    constructor(
        public name: string,
        public thumbnail: string,
        public years: string[] = [],
        public publications: Publication[]
    ) {}
}

class Publication {
    constructor(
        public name: string,
        public number: string,
        public pages: number,

        public thumbnail: string,
        public format: string,
        public file: string,

        public uploader: string,
        public editor: string,
        public scanner: string,
        public publisher: string,
    ) {}
}

export { MagazinesDB as Czasopisma };
