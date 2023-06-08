import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import * as xml2js from 'xml2js';

const DATA_URL = '/assets/czasopisma.xml';

@Injectable({
    providedIn: 'root',
})
export class MagazinesService {
    public magazines: Magazine[] = [];
    public getMagazine = (name: string): Magazine | undefined => 
        this.magazines
            .find(magazine => magazine.name === name);

    constructor(private http: HttpClient) { }

    public init = () => new Promise<void>((resolve) => {
        this.http
            .get(DATA_URL, { responseType: 'text' })
            .subscribe((data) => {
                this.magazines = MagazinesParser.parse(data);
                resolve();
            })
    })
}

const MAGAZINE_ASSETS_URL = 'http://atarionline.pl/biblioteka/czasopisma/img/'
const PUBLICATION_ASSETS_URL = 'http://atarionline.pl/biblioteka/czasopisma/'

class MagazinesParser {
    public static parse = (xml: string) =>
        this.jsonToMagazines(
            this.xmlToJson(xml).czasopisma);

    private static xmlToJson = (xml: string) => {
        let res: any = null

        const parser = new xml2js.Parser({explicitArray: false});
        parser.parseString(xml, (_, result) => res = result);

        return res;
    }

    private static jsonToMagazines = (raw: any) =>
        Object.entries(raw).reduce((acc, [name, value]) => {
            if (name === 'zmienne' || name === 'lata')
                return acc;

            acc.push(
                new Magazine(
                    name,
                    MAGAZINE_ASSETS_URL + raw.zmienne[name].src,
                    this.toYears(
                        name,
                        raw.lata[name].split(','),
                        this.toPublications(name, value),
                    ),
                )
            );
            return acc;
        }, [] as Magazine[])

    private static toPublications = (name: string, raw: any) =>
        Object.values(raw as any[])
            .map(publication => this.toPublication(name, publication));
    private static toPublication = (name: string, publication: any) =>
        new Publication(
            publication.nazwa,
            publication.numer,
            parseInt(publication.stron),

            PUBLICATION_ASSETS_URL + name + '/' + publication.miniaturka,
            publication.format,
            publication.plik,

            publication.podeslal,
            publication.przetworzenie,
            publication.skan,
            publication.wydawca,
        );

    private static toYears = (name: string, years: string[], publications: Publication[]) =>
        years.map((year: string) => this.toYear(name, year, publications));
    private static toYear = (name: string, year: string, publications: Publication[]) =>
        new Year(
            year,
            publications.filter(publication =>
                publication?.number?.startsWith(year)
                || name === 'Bajtek' && year === 'nr specjalne' && publication?.number?.match(/^[0-9]{4}$|^nn$/)
                || name === 'Komputer' && year === 'nr specjalny' && publication?.number === '1988/7' && publication?.pages === 48
                || name === 'IKS' && year === 'nr specjalne' && publication?.name === 'IKS Zeszyty Programów Komputerowych'
            )
        );
}

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
