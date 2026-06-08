"""
Generate the static Open Graph share card for the Hall of Fame.

Output: assets/og-hall.png (1200x630) — referenced as og:image on every page so
shared links render a branded card on X / Telegram instead of a blank box.

Brand: black canvas, single green accent (#38FF93), Inter-ish (Arial) headings,
Consolas for mono labels. Run: `python generate-og-card.py`

This is the GENERIC card (same for every share). Per-member cards (handle + tier +
rep) are a follow-on that needs a real data source — see the v2 design doc.
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (56, 255, 147)        # #38FF93
GREY = (255, 255, 255, 110)
PAD = 80

# Windows system fonts (script runs on ChiChi's machine to regenerate the asset).
F_BOLD = "C:/Windows/Fonts/arialbd.ttf"
F_REG = "C:/Windows/Fonts/arial.ttf"
F_MONO = "C:/Windows/Fonts/consola.ttf"


def font(path, size):
    return ImageFont.truetype(path, size)


def draw_tracked(draw, xy, text, fnt, fill, tracking=6):
    """Draw uppercase mono labels with manual letter-spacing (Pillow has none)."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + tracking
    return x


def wrap(draw, text, fnt, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=fnt) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img, "RGBA")

# faint inset border for a framed, premium feel
d.rectangle([18, 18, W - 18, H - 18], outline=(56, 255, 147, 40), width=1)

# soft green glow, top-right (stacked translucent ellipses)
for r, a in [(420, 10), (320, 12), (220, 16), (130, 20)]:
    d.ellipse([W - r + 120, -r + 120, W + r - 120 + 240, r - 120 + 240], fill=(56, 255, 147, a))

# eyebrow: green tick + label
d.line([PAD, 92, PAD + 26, 92], fill=GREEN, width=2)
draw_tracked(d, (PAD + 40, 80), "THE HALL OF FAME", font(F_MONO, 22), GREEN, tracking=5)

# headline
head_font = font(F_BOLD, 88)
lines = wrap(d, "Reputation is the only flex.", head_font, W - 2 * PAD)
y = 200
for ln in lines:
    d.text((PAD, y), ln, font=head_font, fill=WHITE)
    y += 96

# accent line (green)
y += 14
d.text((PAD, y), "Ranked by rep. Proven on-chain.", font=font(F_BOLD, 40), fill=GREEN)

# footer brand, bottom-left: "altcoinist." with green dot
fb = font(F_BOLD, 34)
bx = PAD
d.text((bx, H - 96), "altcoinist", font=fb, fill=WHITE)
bx += d.textlength("altcoinist", font=fb)
d.text((bx, H - 96), ".", font=fb, fill=GREEN)
bx += d.textlength(".", font=fb) + 16
d.text((bx, H - 90), " the inner circle", font=font(F_REG, 26), fill=(255, 255, 255, 130))

# footer right: "exclusive" pill
pill = "EXCLUSIVE"
pf = font(F_MONO, 20)
pw = sum(d.textlength(c, font=pf) + 5 for c in pill)
px1 = W - PAD - pw - 36
d.rounded_rectangle([px1, H - 100, W - PAD, H - 60], radius=20,
                    outline=(255, 255, 255, 90), width=1)
draw_tracked(d, (px1 + 18, H - 92), pill, pf, (255, 255, 255, 150), tracking=5)

img.save("assets/og-hall.png", "PNG")
print("wrote assets/og-hall.png", img.size)
