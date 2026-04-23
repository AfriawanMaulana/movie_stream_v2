// interface DramaItem {
//   dcup?: string;
//   svari?: string;
//   spai?: string;
//   rbatt?: string;
//   lweek?: string;
//   spsy?: string;
//   sstra?: string[];
//   nseri?: string;
//   ewood?: string;
//   dwill?: string;
//   pday?: string;
//   csme?: string;
//   eaccou?: string;
//   funi: [
//     {
//       Fwea?: string;
//       Famo?: string;
//       Ctan?: string;
//       Dbag?: string;
//       Mopp?: string;
//       Bcold?: string;
//       Bnati?: number;
//       Wroll?: number;
//       Hdet?: number;
//       Prise?: string;
//       Dissue?: number;
//       Ehope?: number;
//     }
//   ];
// }

// interface DramaType {
//   squa: number;
//   dgiv: {
//     lint: DramaItem[];
//     torga: number;
//     tpen: number;
//     pglas: number;
//     pdirec: number;
//   };
// }

// interface DramaDetailType {
//   squa: number;
//   mcase: number;
//   dgiv: {
//     bswitc: {
//       dcup?: string;
//       svari?: string;
//       spai?: string;
//       rbatt?: string;
//       lweek?: string;
//       spsy?: string;
//       sstra?: string[];
//       nseri?: string;
//       ewood?: string;
//       dwill?: string;
//       pday?: string;
//       csme?: string;
//       eaccou?: string;
//       ehope?: string;
//     };
//     ebeer: [
//       {
//         dcup?: string;
//         vcity?: string;
//         eholi?: string;
//         ewheel?: number;
//         pphys: [
//           {
//             Fwea?: string;
//             Famo?: string;
//             Ctan?: string;
//             Dbag?: string;
//             Mopp?: string;
//             Bcold?: string;
//             Bnati?: number;
//             Wroll?: number;
//             Hdet?: number;
//             Prise?: string;
//             Dissue?: number;
//             Ehope?: number;
//           }
//         ];
//       }
//     ];
//   };
// }
// export type { DramaItem, DramaType, DramaDetailType };

interface MovieItem {
  id: number;
  title?: string;
  original_title?: string;
  name?: string;
  poster_path: string;
  release_date?: string;
  vote_average?: number;
  first_air_date?: string;
  original_language?: string;
}

interface DataType {
  results: MovieItem[];
  total_pages: number;
}

interface Logoprops {
  aspect_ratio: number;
  file_path: string;
  height: number;
  iso_639_1: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export type { MovieItem, DataType, Logoprops };
