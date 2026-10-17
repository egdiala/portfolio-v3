// The site's monogram: the "d" of diala in Asimovian, paper on ink. It's the
// letter that stays in both names the nav morphs between, and its stem stays
// sharp at 16px where the others blur. Plain JS, so scripts/favicon.mjs can
// render the same thing outside Next for app/favicon.ico.
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { createElement } from "react"

const INK = "#0a0a0a"
const PAPER = "#fafafa"

// Literal path, so output file tracing ships the font with the icon routes.
const font = readFile(join(process.cwd(), "lib/og/fonts/Asimovian-Regular.ttf"))

/**
 * The monogram as an ImageResponse element and its options.
 * At 0.78 of the tile, the stem lands on whole pixels at 16 and 32px.
 *
 * @param {number} size Width and height in px.
 * @param {{ rounded?: boolean }} [shape] Rounded for tabs. Square for Apple, whose OS masks its own corners.
 */
export async function monogram(size, { rounded = true } = {}) {
  const element = createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: INK,
        borderRadius: rounded ? size * 0.22 : 0,
        color: PAPER,
        fontFamily: "Asimovian",
        fontSize: size * 0.78,
        lineHeight: 1,
      },
    },
    // Lifted a little: the glyph's ink sits low in its line box.
    createElement("span", { style: { display: "flex", transform: `translateY(${-0.04 * size}px)` } }, "d"),
  )

  return {
    element,
    options: {
      width: size,
      height: size,
      fonts: [{ name: "Asimovian", data: await font, weight: /** @type {const} */ (400), style: /** @type {const} */ ("normal") }],
    },
  }
}
