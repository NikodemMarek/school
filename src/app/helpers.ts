import { HttpClient } from '@angular/common/http';
import * as xml2js from 'xml2js';

const DATA_URL = '/assets/czasopisma.xml';

const MAGAZINE_ASSETS_URL = 'http://atarionline.pl/biblioteka/czasopisma/img/'
const PUBLICATION_ASSETS_URL = 'http://atarionline.pl/biblioteka/czasopisma/'

const MagazineDB = {
    loaded: false,
    magazines: [] as Magazine[],

    get: function () {
        return this.magazines;
    },
    getMagazine: function (name: string): Magazine | undefined {
        return this.magazines
            .find(magazine => magazine.name === name);
    },

    init: async function (http: HttpClient) {
        return new Promise((resolve, reject) => {
            this.load(http);

            setInterval(() => {
                if (this.loaded)
                    return resolve(true);
            }, 10)
        })
    },
    load: function (http: HttpClient) {
        if (this.loaded)
            return;

        http.get(DATA_URL, { responseType: 'text' })
            .subscribe(data => {
                const rawMagazines = this.convertToJSON(data).czasopisma

                this.magazines = Object.entries(rawMagazines).reduce((acc, [name, value]) => {
                    if (name === 'zmienne' || name === 'lata')
                        return acc;

                    const publications = Object.values(value as any[])
                        .map(publication => new Publication(
                            publication.nazwa,
                            publication.numer,
                            parseInt(publication.stron),

                            PUBLICATION_ASSETS_URL + '/' + name + '/' + publication.miniaturka,
                            publication.format,
                            publication.plik,

                            publication.podeslal,
                            publication.przetworzenie,
                            publication.skan,
                            publication.wydawca,
                        ));
                    const czasopismo = new Magazine(
                        name,
                        MAGAZINE_ASSETS_URL + rawMagazines.zmienne[name].src,
                        rawMagazines.lata[name].split(',')
                            .map((year: string) => new Year(
                                year,
                                publications.filter(publication =>
                                    publication?.number?.startsWith(year)
                                    || year === 'nr specjalne' && publication?.number?.includes('nn')
                                    // TODO: add other special cases here
                                )
                            )),
                    )

                    acc.push(czasopismo);
                    return acc;
                }, [] as Magazine[])

                this.loaded = true;
            })
    },
    convertToJSON: function (xml: string) {
        let res: any = null

        const parser = new xml2js.Parser({explicitArray: false});
        parser.parseString(xml, (err, result) => res = result);

        return res;
    }
}

export default MagazineDB;

// class MagazinesDB {
//     public czasopisma: Magazine[] = [];
//
//     public get = () => this.czasopisma;
//     public getNames = () => this.czasopisma
//         .map(czasopismo => czasopismo.name);
//     public getMagazine = (name: string) => this.czasopisma
//         .find(czasopismo => czasopismo.name === name);
//
// 	constructor(private http: HttpClient) {
//         this.load();
//     }
//
//     private load = () =>
//         this.http.get(DATA_URL, { responseType: 'text' })
//             .subscribe(data => {
//                 const rawMagazines = this.convertToJSON(data).czasopisma
//
//                 this.czasopisma = Object.entries(rawMagazines).reduce((acc, [name, value]) => {
//                     if (name === 'zmienne' || name === 'lata')
//                         return acc;
//
//
//                     const publications = Object.values(value as any[])
//                         .map(publication => new Publication(
//                             publication.nazwa,
//                             publication.numer,
//                             parseInt(publication.stron),
//
//                             PUBLICATION_ASSETS_URL + '/' + name + '/' + publication.miniaturka,
//                             publication.format,
//                             publication.plik,
//
//                             publication.podeslal,
//                             publication.przetworzenie,
//                             publication.skan,
//                             publication.wydawca,
//                         ));
//                     const czasopismo = new Magazine(
//                         name,
//                         MAGAZINE_ASSETS_URL + rawMagazines.zmienne[name].src,
//                         rawMagazines.lata[name].split(',')
//                             .map((year: string) => new Year(
//                                 year,
//                                 publications.filter(publication =>
//                                     publication?.number?.startsWith(year)
//                                     || year === 'nr specjalne' && publication?.number?.includes('nn')
//                                     // TODO: add other special cases here
//                                 )
//                             )),
//                     )
//
//                     acc.push(czasopismo);
//                     return acc;
//                 }, [] as Magazine[])
//             });
//
//     private convertToJSON = (xml: string) => {
//         let res: any = null
//
//         const parser = new xml2js.Parser({explicitArray: false});
//         parser.parseString(xml, (err, result) => res = result);
//
//         return res;
//     }
// }

class Magazine {
    constructor(
        public name: string,
        public thumbnail: string,
        public years: Year[],
    ) {}

    public getYears = () => this.years;
    public getYear = (year: string): Year | undefined => this.years
        .find(y => y.year === year);
}

class Year {
    constructor(
        public year: string,
        public publications: Publication[],
    ) {}

    public getPublications = () => this.publications;
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

export { Magazine, Year, Publication };
