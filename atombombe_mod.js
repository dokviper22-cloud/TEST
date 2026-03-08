elements.atombombe = {
    color: "#4a4a4a",
    colorOn: "#ff4400",
    behavior: [
        "XX|XX|XX",
        "XX|XX|XX",
        "M2|M1|M2",
    ],
    conduct: 1,
    category: "Weapons",
    state: "solid",
    density: 500,
    excludeRandom: true,
    cooldown: defaultCooldown,
    tick: function(pixel) {
        if (!pixel.powered) return;

        let x = pixel.x;
        let y = pixel.y;
        let radius = 35;

        deletePixel(pixel);

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                let dist = Math.sqrt(dx*dx + dy*dy);
                if (dist > radius) continue;

                let nx = x + dx;
                let ny = y + dy;

                if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;

                let target = pixelMap[nx] && pixelMap[nx][ny];

                // Innerer Kern: Plasma
                if (dist < radius * 0.25) {
                    if (target) changePixel(target, "plasma");
                    else createPixel("plasma", nx, ny);
                }
                // Mittlere Zone: Feuer
                else if (dist < radius * 0.55) {
                    if (Math.random() < 0.85) {
                        if (target && target.element !== "wall") changePixel(target, "fire");
                        else if (!target && Math.random() < 0.4) createPixel("fire", nx, ny);
                    }
                }
                // Äußere Zone: Radiation + Smoke
                else if (dist < radius * 0.85) {
                    if (Math.random() < 0.4) {
                        if (target && target.element !== "wall") {
                            changePixel(target, Math.random() < 0.5 ? "radiation" : "smoke");
                        } else if (!target && Math.random() < 0.3) {
                            createPixel(Math.random() < 0.5 ? "radiation" : "smoke", nx, ny);
                        }
                    }
                }
                // Randzone: Radiation
                else {
                    if (Math.random() < 0.15) {
                        if (target && target.element !== "wall") changePixel(target, "radiation");
                        else if (!target && Math.random() < 0.1) createPixel("radiation", nx, ny);
                    }
                }
            }
        }

        // Pilzwolken-Säule nach oben
        for (let i = 1; i <= 60; i++) {
            let ny = y - i;
            if (ny < 0) break;
            let nx = x + Math.floor((Math.random() - 0.5) * Math.min(i * 0.6, 18));
            if (nx >= 0 && nx < width) {
                let t = pixelMap[nx] && pixelMap[nx][ny];
                if (t && t.element !== "wall") {
                    changePixel(t, i < 20 ? "plasma" : "radiation");
                } else if (!t) {
                    createPixel(i < 20 ? "fire" : "radiation", nx, ny);
                }
            }
        }
    }
};
