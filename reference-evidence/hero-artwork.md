# Обновление hero · 6 октября 2026

Рекламные иллюстрации обложки восстановлены встроенным imagegen по изображениям тех же скинов. Это не фотографии конкретных продаваемых предметов; каталог и quick view сохраняют исходные изображения и данные. Итоговые файлы: `public/hero/ak-asiimov.webp`, `public/hero/glock-gamma-phase3.webp`, `public/hero/m9-tiger-tooth.webp` — 1536×1024, alpha, WebP quality 94 / alpha quality 100, суммарно около 503 KiB.

Исходник AK — существующий `public/catalog/2d6422a8b66d4b9c88de.avif` (1920×1080, с заметно увеличенными пикселями). Glock Phase 3 и M9 Tiger Tooth — официальные превью Steam, найденные по name/phase в https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en/skins.json (512×384).

## Промт
Один вызов на каждый предмет: AK-47 Asiimov; Glock-18 Gamma Doppler Phase 3; M9 Bayonet Tiger Tooth. `transparent_background: true`, один reference image.

> Use case: precise-object-edit. Edit target: the attached [SKIN] Counter-Strike skin render. Create a high resolution clean restoration for a large website hero, isolated on genuine transparent alpha. Preserve the EXACT weapon identity, silhouette, proportions, orientation, perspective, all skin color zones and markings from the input. Restore smooth crisp antialiased edges, sharp fine material detail, clean metal and polymer surfaces, gentle studio highlights. Remove blocky pixelation/compression. No invented attachments, no new decals, no changes to skin design, no text, no background, no ground plane, no vignette, no cast shadow. Full object completely in frame centered with 10% transparent breathing room. Maximum sharpness and high resolution, landscape 1536x1024. This is a faithful cleaned-up promotional illustration of the supplied object, not a different design.

## Движение
Фаза фонового canvas одновременно управляет позицией и наклоном отдельного слоя оружия. Кнопка и focus ring неподвижны. Скорость зависит от времени, а не частоты кадров. За пределами видимости и в скрытой вкладке RAF останавливается; reduced-motion отключает движение. `overflow: clip` предотвращает внутреннюю прокрутку hero при фокусировке селекторов.

## Проверка
Typecheck, lint и 28 тестов проходят. В браузере проверены изображения 1536 px, изменение transform без движения курсора, неподвижная область кнопки, переключение всех трёх скинов, правильный предмет в quick view и закрытие Escape. На 1440 и 390 px сцена не прокручивается внутри; на 390 px нет горизонтального переполнения страницы. Системная настройка reduced-motion в этой проверке не эмулировалась.
