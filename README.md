# TOKEN RIOT — sitio y juego web

Código del sitio https://www.token-riot.com/: presentación, juego web en `/play/`
y descarga directa de Android. El juego completo y su proyecto Android viven en
https://github.com/marianocarreira/tokenriot.

## Ejecutar y verificar

Requiere Node.js 22 o posterior.

```sh
npm ci
npm run build
npm run check
npm test
npm start
```

Abrí http://127.0.0.1:4174/. El servidor de vista previa sirve solo `dist/`.
`game-src/` contiene el código del juego usado por el bundle web. `dist/` conserva
el HTML, CSS y los medios del sitio como fuentes mantenidas; no debe borrarse
como si todo su contenido fuera un caché regenerable. La descarga del APK verifica
el tamaño y SHA-256 de cada parte; las pruebas verifican también el archivo total.

El sitio no necesita claves de API para jugar. El formulario opcional de comunidad
envía los datos elegidos por el visitante a contact@token-riot.com mediante
FormSubmit; no crea una cuenta de jugador. La tienda es independiente, privada
y propietaria. `/store/` contiene solamente un enlace a https://www.token-riot.store/.
La configuración interna de hosting no se incluye en este repositorio público.

## Licencia y colaboración

Copyright (C) 2026 Mariano Carreira.
Código original: **GNU GPL versión 3 exclusivamente (GPL-3.0-only)**.
Véanse LICENSE, COPYING, COPYRIGHT.md y LICENSE-SCOPE.md. La licencia no transfiere
el copyright. Los recursos no software y los componentes de terceros conservan
sus derechos; no se declara que todas las imágenes y música sean contenido libre.

El historial público comienza con una publicación saneada. No incluye el código
de la store, sus fuentes ni datos privados. Consultá CONTRIBUTING.md, CLA.md y
SECURITY.md. Único contacto: **contact@token-riot.com**.
