#!/usr/bin/env python3
"""Compose Play Store marketing screenshots: dark bg + headline + phone frame.
Drop real captures in store-assets/screenshots/screen1.png .. screen4.png
(portrait, ~1080x2340). Re-run: python3 store-assets/make-banners.py"""
import os
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(__file__)
SHOTS = os.path.join(HERE, 'screenshots')

W, H = 1080, 1920
BG = (10, 22, 18)          # #0A1612
GOLD = (212, 175, 55)
WHITE = (245, 245, 240)
GREEN = (27, 94, 32)
GREEN_DARK = (0, 51, 0)

# (headline lines, screenshot filename)
BANNERS = [
    (["Votre compagnon", "musulman au quotidien"], "screen0.png"),
    (["Vos prières,", "à l'heure, partout"],        "screen1.png"),
    (["Le Coran,", "lecture & écoute"],              "screen2.png"),
    (["Le calendrier", "hijri complet"],             "screen3.png"),
    (["Dhikr, hadiths", "& bien plus"],              "screen4.png"),
    (["Qibla, Douas,", "guides & 99 Noms"],          "screen-more.png"),
]

def font(sz, bold=True):
    for p in (('/System/Library/Fonts/Supplemental/Arial Bold.ttf' if bold
               else '/System/Library/Fonts/Supplemental/Arial.ttf'),
              '/System/Library/Fonts/Helvetica.ttc'):
        try: return ImageFont.truetype(p, sz)
        except Exception: pass
    return ImageFont.load_default()

def rounded_mask(size, radius):
    m = Image.new('L', size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, size[0]-1, size[1]-1], radius, fill=255)
    return m

def placeholder(size):
    """Fallback screen when no real capture is provided yet."""
    w, h = size
    im = Image.new('RGB', size, GREEN)
    px = im.load()
    for y in range(h):
        k = y / h
        c = tuple(int(GREEN_DARK[i] + (GREEN[i]-GREEN_DARK[i])*k) for i in range(3))
        for x in range(w):
            px[x, y] = c
    d = ImageDraw.Draw(im)
    f = font(int(w*0.06), False)
    t = "Capture d'écran ici"
    tb = d.textbbox((0, 0), t, font=f)
    d.text(((w-(tb[2]-tb[0]))//2, h//2), t, font=f, fill=WHITE)
    return im

def make(headline, shot_path, out_path):
    canvas = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(canvas)

    # Headline (up to 2 lines, centered)
    hf = font(76, True)
    y = 120
    for line in headline:
        tb = d.textbbox((0, 0), line, font=hf)
        d.text(((W-(tb[2]-tb[0]))//2, y), line, font=hf, fill=WHITE)
        y += 96

    # ---- iPhone-style frame ----
    PW, PH = 760, 1540
    px0, py0 = (W-PW)//2, 380
    bezel = 16          # thin uniform bezel like modern iPhones
    radius = 130        # large corner radius

    # Metallic outer edge (drawn slightly larger, behind the black body)
    edge = 6
    ering = Image.new('RGBA', (PW+2*edge, PH+2*edge), (0, 0, 0, 0))
    ImageDraw.Draw(ering).rounded_rectangle(
        [0, 0, PW+2*edge-1, PH+2*edge-1], radius+edge, fill=(70, 74, 78, 255))
    canvas.paste(ering, (px0-edge, py0-edge), ering)

    # Black body
    body = Image.new('RGBA', (PW, PH), (0, 0, 0, 0))
    ImageDraw.Draw(body).rounded_rectangle(
        [0, 0, PW-1, PH-1], radius, fill=(8, 8, 10, 255))
    canvas.paste(body, (px0, py0), body)

    # Side buttons (subtle)
    d.rounded_rectangle([px0-edge-5, py0+300, px0-edge-1, py0+420], 4, fill=(55, 58, 62))   # volume up
    d.rounded_rectangle([px0-edge-5, py0+450, px0-edge-1, py0+560], 4, fill=(55, 58, 62))   # volume down
    d.rounded_rectangle([px0+PW+edge, py0+360, px0+PW+edge+4, py0+520], 4, fill=(55, 58, 62)) # power

    # Screen content — reserve a blank status-bar strip up top so the Dynamic
    # Island floats over empty space instead of the app's own header text
    # (our captures have no real iOS status bar to align it with).
    sw, sh = PW-2*bezel, PH-2*bezel
    status_h = 96
    if os.path.exists(shot_path):
        shot = Image.open(shot_path).convert('RGB')
        content_h = sh - status_h
        r = max(sw/shot.width, content_h/shot.height)   # cover-fit
        shot = shot.resize((int(shot.width*r), int(shot.height*r)), Image.LANCZOS)
        left = (shot.width-sw)//2; top = 0
        shot = shot.crop((left, top, left+sw, top+content_h))
        status_bg = shot.getpixel((sw//2, 2))
    else:
        shot = placeholder((sw, sh-status_h))
        status_bg = BG

    screen = Image.new('RGB', (sw, sh), status_bg)
    screen.paste(shot, (0, status_h))
    smask = rounded_mask((sw, sh), radius-bezel)
    canvas.paste(screen, (px0+bezel, py0+bezel), smask)

    # Dynamic Island (black pill, centred in the reserved status strip)
    iw, ih = 190, 52
    ix = px0 + (PW-iw)//2
    iy = py0 + bezel + (status_h-ih)//2
    d.rounded_rectangle([ix, iy, ix+iw, iy+ih], ih//2, fill=(0, 0, 0))

    canvas.save(out_path)
    print('->', os.path.basename(out_path), '(shot found)' if os.path.exists(shot_path) else '(placeholder)')

for i, (headline, shot) in enumerate(BANNERS, 1):
    make(headline, os.path.join(SHOTS, shot), os.path.join(HERE, f'banner-{i}.png'))
