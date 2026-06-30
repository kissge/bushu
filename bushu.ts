import Database from 'better-sqlite3';

const db = new Database('node_modules/@mandel59/mojidata/dist/moji.db', { readonly: true });

function getRadical(char: string): string | null {
  const result = db.prepare(`select 対応するUCS as k, 部首漢字 as rad
    from mji
    join mji_rsindex on mji.MJ文字図形名 = mji_rsindex.MJ文字図形名
    join radicals on mji_rsindex.部首 = radicals.部首
    where k = ?`).all(char) as { k: string; rad: string }[];

  return result.length > 0 ? result[0].rad : null;
}

function checkCommonRadical(text: string) {
  const radicals = new Set<string>();
  for (const char of text) {
    const radical = getRadical(char);
    if (radical) {
      radicals.add(radical);
    }
  }

  if (radicals.size === 1) {
    return radicals.values().next().value;
  }
}

function iterateAllSubmatch(text: string) {
  for (let len = text.length; len > 1; --len) {
    for (let start = 0; start + len <= text.length; ++start) {
      const submatch = text.substring(start, start + len);
      const commonRadical = checkCommonRadical(submatch);
      if (commonRadical) {
        return { submatch, commonRadical };
      }
    }
  }
}

export function* listCommonRadicals(text: string) {
  const kanji = text.matchAll(/\p{Script=Han}+/gu);
  for (const match of kanji) {
    const common = iterateAllSubmatch(match[0]);
    if (common) {
      yield common;
    }
  }
}
