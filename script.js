const carpetas = [
    "cuando-te-conoci",
    "primera-foto",
    "primera-salida"
];

const timeline = document.getElementById("timeline");

const galerias = [];

/* =========================
   CONTADOR DE TIEMPO JUNTOS
========================= */

function actualizarContador() {

    const inicio = new Date("2023-05-03");
    const hoy = new Date();

    let años = hoy.getFullYear() - inicio.getFullYear();

    let meses = hoy.getMonth() - inicio.getMonth();

    let dias = hoy.getDate() - inicio.getDate();

    if (dias < 0) {
        meses--;
        const ultimoMes = new Date(
            hoy.getFullYear(),
            hoy.getMonth(),
            0
        ).getDate();

        dias += ultimoMes;
    }

    if (meses < 0) {
        años--;
        meses += 12;
    }

    document.getElementById("contador").innerHTML =
        `❤️ ${años} años, ${meses} meses y ${dias} días juntos ❤️`;
}

actualizarContador();

/* =========================
   ANIMACION SCROLL
========================= */

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        }
    });
}, { threshold: 0.2 });

/* =========================
   CARGAR MOMENTOS
========================= */

async function cargarMomentos() {
    for (const [i, c] of carpetas.entries()) {
        try {
            const response = await fetch(`momentos/${c}/info.json`);
            const data = await response.json();

            galerias.push(
                data.imagenes.map(
                    img => ({
                        img: `momentos/${c}/${img.archivo}`,
                        texto: img.texto
                    })
                )
            );

            crearMomento(data, c, i);

        } catch (error) {
            console.error(`Error cargando ${c}:`, error);
        }
    }
}

function crearMomento(data, carpeta, indice) {
    const momento = document.createElement("div");
    momento.className = "momento";

    momento.innerHTML = `
        <div class="contenido">

            <div class="fecha">
                ${data.fecha}
            </div>

            <h2>
                ${data.titulo}
            </h2>

            <p>
                ${data.descripcion}
            </p>

            <img
                src="momentos/${carpeta}/portada.jpg"
                alt="${data.titulo}"
                onclick="abrirGaleria(${indice})">

        </div>
    `;

    timeline.appendChild(
        momento
    );

    observer.observe(
        momento
    );
}

cargarMomentos();

/* =========================
   MODAL
========================= */

let galeriaActual = 0;
let imagenActual = 0;

const modal =
    document.createElement("div");

modal.className = "modal";

modal.innerHTML = `

    <span
        class="cerrar"
        onclick="cerrarGaleria()">
        &times;
    </span>

    <div class="modal-contenido">

        <span
            class="prev"
            onclick="anteriorImagen()">
            &#10094;
        </span>

        <img
            id="imagenModal">

        <span
            class="next"
            onclick="siguienteImagen()">
            &#10095;
        </span>

        <div
            class="descripcion"
            id="textoModal">
        </div>

        <div
            class="indicador"
            id="indicador">
        </div>

    </div>

`;

document.body.appendChild(
    modal
);

/* =========================
   ABRIR GALERIA
========================= */

function abrirGaleria(
    indice
) {

    galeriaActual =
        indice;

    imagenActual =
        0;

    mostrarImagen();

    modal.style.display =
        "flex";
}

/* =========================
   MOSTRAR IMAGEN
========================= */

function mostrarImagen() {

    const imagen =
        galerias[
        galeriaActual
        ][
        imagenActual
        ];

    document.getElementById(
        "imagenModal"
    ).src =
        imagen.img;

    document.getElementById(
        "textoModal"
    ).textContent =
        imagen.texto;

    document.getElementById(
        "indicador"
    ).textContent =
        `Foto ${imagenActual + 1
        } de ${galerias[
            galeriaActual
        ].length
        }`;
}

/* =========================
   SIGUIENTE
========================= */

function siguienteImagen() {

    const total =
        galerias[
            galeriaActual
        ].length;

    imagenActual =
        (
            imagenActual + 1
        ) % total;

    mostrarImagen();
}

/* =========================
   ANTERIOR
========================= */

function anteriorImagen() {

    const total =
        galerias[
            galeriaActual
        ].length;

    imagenActual =
        (
            imagenActual - 1 + total
        ) % total;

    mostrarImagen();
}

/* =========================
   CERRAR
========================= */

function cerrarGaleria() {

    modal.style.display =
        "none";
}

/* =========================
   TECLADO
========================= */

document.addEventListener(
    "keydown",
    (e) => {

        if (
            modal.style.display !==
            "flex"
        ) {
            return;
        }

        if (
            e.key ===
            "Escape"
        ) {
            cerrarGaleria();
        }

        if (
            e.key ===
            "ArrowRight"
        ) {
            siguienteImagen();
        }

        if (
            e.key ===
            "ArrowLeft"
        ) {
            anteriorImagen();
        }

    }
);

/* =========================
   CLIC FUERA DEL MODAL
========================= */

modal.addEventListener(
    "click",
    (e) => {

        if (
            e.target === modal
        ) {
            cerrarGaleria();
        }

    }
);

/* =========================
   SWIPE MOVIL
========================= */

let inicioX = 0;

modal.addEventListener(
    "touchstart",
    (e) => {

        inicioX =
            e.touches[0]
                .clientX;

    }
);

modal.addEventListener(
    "touchend",
    (e) => {

        const finX =
            e.changedTouches[0]
                .clientX;

        const diferencia =
            inicioX - finX;

        if (
            diferencia > 50
        ) {
            siguienteImagen();
        }

        if (
            diferencia < -50
        ) {
            anteriorImagen();
        }

    }
);