// =========================================================================
// 1. CONFIGURACIÓN DE ENLACES Y CONEXIONES (REEMPLAZÁ ACÁ)
// =========================================================================
const html5QrCode = new Html5Qrcode("reader");

const API_BASE_URL = window.location.hostname.endsWith('github.io')
    ? 'https://visitas-qru-api.onrender.com'
    : window.location.hostname === 'appassets.androidplatform.net'
        ? 'https://visitas-qru-api.onrender.com'
    : '';
const URL_API_GOOGLE = `${API_BASE_URL}/api/registro`;

// Dejamos esta constante vieja acá arriba por si tu HTML o algún script la requiere, no molesta.
const URL_API_SHEETDB = 'https://sheetdb.io/api/v1/no_se_usa_pero_queda_guardada';

const maestroSectores = {
    "Mostrador": [{ nombre: "Atención Mostrador", contacto: "N/A" }],
    "PLANTA LOGISTICA": [{ nombre: "MUGNECO ADRIAN", contacto: "5492615320950" },
                         {nombre:"Carbajo Rodrigo",contacto: "5492615320950"},
                         {nombre:"Di Lorenzo Diego",contacto: "5492615320950"}],
    "CAPITAL HUMANO": [
        { nombre: "Fernández Rubén", contacto: "5492615320950" },
        { nombre: "Pablo Iacobucci", contacto: "5492614168508" },
        { nombre: "Tissera Mariana", contacto: "5492615320950" },
    
    ],
    "Administracion": [
        { nombre: "Martin Marcelo", contacto: "5492615320950" },
        { nombre: "Bustos Marcos", contacto: "5492615320950" },
        { nombre: "Videla Javier", contacto: "5492615320950" },
        { nombre: "Agüero Antonio", contacto: "5492615320950" },
        { nombre: "Velez Daniel", contacto: "N/A" }
    ],
    "Consejo": [{ nombre: "Ganem Victoria", contacto: "5492615513444" }],
    "Funsad": [{ nombre: "Ganem Victoria", contacto: "549261551344" }],
    "Lobby": [{ nombre: "Sanchez Alejandro", contacto: "5492615158389" },
              { nombre: "Ganem Victoria", contacto: "549261551344" },
              { nombre: "Escudero Carina", contacto: "5492615320950" }],
    "Operador Logistico nave 2": [
        { nombre: "Constantino Adriana", contacto: "5492615320950" },
        { nombre: "Valdez Liliana", contacto: "5492616757808" }
    ],
    "Comercial": [
        { nombre: "Molina Andres", contacto: "5492615320950" },
        { nombre: "Tescari Maria Jose", contacto: "5492615320950" },
        { nombre: "Reina Julia", contacto: "5492615320950" },
        { nombre: "Sepulveda Marcela", contacto: "5492615320950" },
        { nombre: "Sanabria Juan", contacto: "5492615320950" },
        { nombre: "Perez Agustin", contacto: "5492615320950"}
    ],
    "Cajas": [
        { nombre: "Arce José", contacto: "5492615320950" },
        { nombre: "Ponce Matias", contacto: "5492615320950" }
       
    ],
    "Administración osep": [
        { nombre: "Pelayes Sergio", contacto: "5492615320950" },
        { nombre: "Oropel Walter", contacto: "55492615320950" },
        { nombre: "Garay Diego", contacto: "5492615320950" },
        { nombre: "Fernandez Jose Luis", contacto: "5492615320950" },
        { nombre: "Dominguez Diego", contacto: "5492615320950" },
        { nombre: "Peroso Vanesa", contacto: "5492615320950" }
    ],
    "Recepción Nave 1": [
        { nombre: "Paris Sebastian", contacto: "5492615320950" },
        { nombre: "Guerra Emanuel", contacto: "N/A" },
        { nombre: "Pubill Franco", contacto: "N/A" },
        { nombre: "Fernandez Leonardo", contacto: "N/A" },
        { nombre: "Marzonetto Emiliano", contacto: "N/A" }
    ],
    "Recepción Nave 2": [
        { nombre: "Moran Federico", contacto: "N/A" },
        { nombre: "Montenegro Victor", contacto: "N/A" },
        {nombre: "Herrera Luis" , contacto: "N/A" }],
        "Créditos": [
        { nombre: "Rovatti Dario", contacto: "5492615320950" },
        { nombre: "Agüero Rocio", contacto: "N/A" },
        {nombre: "Andreoni Anabela" , contacto: "N/A" }],
    "Sistemas": [
        { nombre: "Lujan Omar", contacto: "5492615320950" },
        { nombre: "Puebla Adrian", contacto: "5492615320950" },
        {nombre: "Placci Martin" , contacto: "5492615320950" }],
      "Devolución a Proveedor y/o donaciones": [
        { nombre: "Alvarez Cecilia", contacto: "5492615320950" }],
    "Evento": [{ nombre: "Evento", contacto: "N/A" }],
    "Recepcion Técnica": [
        { nombre: "Daniel Ríos", contacto: "5492615320950" },
        { nombre: "Cecilia Nadal", contacto: "5492615320950" },
        { nombre: "Carina Escudero", contacto: "5492615320950" },
        { nombre: "Natalia Bustos", contacto: "5492612128450" },
        { nombre: "Jennifer Agüero", contacto: "5492615320950" }
    ],
    "Mantenimiento": [{ nombre: "Marsollier Ivan", contacto: "5492615320950" },
                      { nombre: "Brizuela Tomas", contacto:"5492615320950"}],
    "Guardia": [{ nombre: "Puesto 1", contacto: "5492615320950" }],
    "EVENTO": [{ nombre: "EVENTO", contacto: "N/A" }]
};

const escaneoRawInput = document.getElementById('escaneoRaw');
const dniSugerencias = document.getElementById('dniSugerencias');
const btnBuscarDni = document.getElementById('btnBuscarDni');
const dniBusquedaAyuda = document.getElementById('dniBusquedaAyuda');
const datosPersonalesInput = document.getElementById('datosPersonales');
const empresaInput = document.getElementById('empresa');
const groupCodigoFarmacia = document.getElementById('groupCodigoFarmacia');
const codigoFarmaciaInput = document.getElementById('codigoFarmacia');
const sectorSelect = document.getElementById('sector');
const anfitrionSelect = document.getElementById('anfitrion');
const modoEventoCheck = document.getElementById('modoEvento');
const modoMercadoLibreCheck = document.getElementById('modoMercadoLibre');
const groupEmpresa = document.getElementById('groupEmpresa');
const groupCantidadBultos = document.getElementById('groupCantidadBultos');
const cantidadBultosInput = document.getElementById('cantidadBultos');
const btnRegistrar = document.getElementById('btnRegistrar');
const btnLimpiar = document.getElementById('btnLimpiar');
const formProcessing = document.getElementById('formProcessing');
const formProcessingMessage = document.getElementById('formProcessingMessage');
const whatsappContactPanel = document.getElementById('whatsappContactPanel');
const whatsappContactSearch = document.getElementById('whatsappContactSearch');
const whatsappContactSuggestions = document.getElementById('whatsappContactSuggestions');
const whatsappContactSelection = document.getElementById('whatsappContactSelection');
const btnAbrirWhatsApp = document.getElementById('btnAbrirWhatsApp');

let timeoutAutoGuardar = null;
let timeoutSugerenciasDni = null;
let datosUltimoRegistroWhatsapp = null;
let contactoWhatsappSeleccionado = null;
let contactosWhatsappPlanilla = [];
let estadoCargaContactosWhatsapp = 'cargando';
let errorCargaContactosWhatsapp = '';
let visitanteDniSeleccionado = false;
let dniVisitanteSeleccionado = '';

// Foco automático para disparar con la pistola de hardware
document.addEventListener('click', (evento) => {
    const camposPermitidos = ['escaneoRaw', 'sector', 'anfitrion', 'observaciones', 'empresa', 'codigoFarmacia', 'modoEvento'];
    if (camposPermitidos.includes(evento.target.id) || evento.target.tagName === 'OPTION'
        || evento.target.closest('#dniSugerencias, #whatsappContactPanel')) {
        return; 
    }
    if (escaneoRawInput) escaneoRawInput.focus();
});

function esMostrador() {
    return sectorSelect.value.trim().toLocaleLowerCase('es') === 'mostrador'
        || anfitrionSelect.value.toLocaleLowerCase('es').includes('mostrador');
}

function obtenerDniIngresado() {
    const valor = escaneoRawInput?.value.trim() || '';
    return /^[\d.\s-]+$/.test(valor) ? valor.replace(/\D/g, '') : '';
}

function actualizarCamposMostrador() {
    const mostrar = esMostrador();
    if (groupCodigoFarmacia) groupCodigoFarmacia.hidden = !mostrar;
    const mostrarBultos = Boolean(modoMercadoLibreCheck?.checked);
    if (groupCantidadBultos) groupCantidadBultos.hidden = !mostrarBultos;
    if (!mostrarBultos && cantidadBultosInput) cantidadBultosInput.value = '';
    if (codigoFarmaciaInput) {
        codigoFarmaciaInput.required = mostrar;
        if (!mostrar) codigoFarmaciaInput.value = '';
    }
    if (escaneoRawInput) {
        escaneoRawInput.placeholder = modoMercadoLibreCheck?.checked
            ? 'Escanee el código de Mercado Libre...'
            : 'Escanee DNI o QR, o escriba el DNI para buscar...';
    }
    if (btnBuscarDni) btnBuscarDni.hidden = false;
    if (dniBusquedaAyuda) {
        dniBusquedaAyuda.hidden = false;
        dniBusquedaAyuda.textContent = 'La búsqueda por DNI está disponible en cualquier sector.';
    }
    const dniActual = obtenerDniIngresado();
    if (dniActual && !(visitanteDniSeleccionado && dniActual === dniVisitanteSeleccionado)) {
        actualizarSugerenciasDni();
    } else {
        if (timeoutSugerenciasDni) clearTimeout(timeoutSugerenciasDni);
        consultaDniActual++;
        ocultarSugerenciasDni();
    }
}

// Loaders dinámicos de selectores
function cargarSectores() {
    if (!sectorSelect) return;
    sectorSelect.innerHTML = '<option value="">Seleccione un sector...</option>';
    Object.keys(maestroSectores).forEach(sector => {
        if (sector !== "EVENTO" || modoEventoCheck.checked) {
            let option = document.createElement('option');
            option.value = sector;
            option.textContent = sector;
            sectorSelect.appendChild(option);
        }
    });
}

if (sectorSelect) {
    sectorSelect.addEventListener('change', (e) => {
        const sectorSeleccionado = e.target.value;
        anfitrionSelect.innerHTML = '<option value="">Seleccione anfitrión...</option>';
        
        if (sectorSeleccionado && maestroSectores[sectorSeleccionado]) {
            maestroSectores[sectorSeleccionado].forEach(anf => {
                let option = document.createElement('option');
                option.value = anf.nombre;
                option.textContent = anf.nombre;
                option.dataset.contacto = anf.contacto; 
                anfitrionSelect.appendChild(option);
            });
            if(maestroSectores[sectorSeleccionado].length === 1) {
                anfitrionSelect.selectedIndex = 1; 
            }
        }
        actualizarCamposMostrador();
    });
}

if (anfitrionSelect) {
    anfitrionSelect.addEventListener('change', actualizarCamposMostrador);
}

function extraerDni(datosPersonales) {
    const coincidencia = String(datosPersonales || '').match(/\bDNI\s*:\s*(\d{6,9})\b/i);
    return coincidencia ? coincidencia[1] : '';
}

let consultaDniActual = 0;

function ocultarSugerenciasDni() {
    if (!dniSugerencias) return;
    dniSugerencias.replaceChildren();
    dniSugerencias.hidden = true;
    escaneoRawInput?.setAttribute('aria-expanded', 'false');
}

function actualizarSugerenciasDni(inmediato = false) {
    if (!escaneoRawInput || !dniSugerencias) return;
    const consulta = obtenerDniIngresado();
    if (visitanteDniSeleccionado && consulta === dniVisitanteSeleccionado) {
        ocultarSugerenciasDni();
        return;
    }
    datosPersonalesInput.value = '';
    const idConsulta = ++consultaDniActual;
    if (timeoutSugerenciasDni) clearTimeout(timeoutSugerenciasDni);
    dniSugerencias.replaceChildren();

    if (consulta.length < 3) {
        ocultarSugerenciasDni();
        return;
    }

    if (consulta.length > 9) {
        const mensaje = document.createElement('div');
        mensaje.className = 'dni-suggestion-empty';
        mensaje.textContent = 'El DNI debe tener hasta 9 dígitos.';
        dniSugerencias.appendChild(mensaje);
        dniSugerencias.hidden = false;
        escaneoRawInput.setAttribute('aria-expanded', 'true');
        return;
    }

    const estado = document.createElement('div');
    estado.className = 'dni-suggestion-empty';
    estado.textContent = 'Buscando en MOVIMIENTOS…';
    dniSugerencias.appendChild(estado);
    dniSugerencias.hidden = false;
    escaneoRawInput.setAttribute('aria-expanded', 'true');

    timeoutSugerenciasDni = setTimeout(async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/visitantes?dni=${encodeURIComponent(consulta)}`);
            const visitantes = await response.json();
            if (idConsulta !== consultaDniActual) return;
            if (!response.ok || !Array.isArray(visitantes)) {
                throw new Error(visitantes.message || 'No se pudo consultar la hoja MOVIMIENTOS.');
            }

            const coincidenciasPorDni = new Map();
            visitantes.forEach((visitante) => {
                const datosPersonales = visitante.datosPersonales || visitante['DATOS PERSONALES'] || '';
                const dni = String(visitante.dni || extraerDni(datosPersonales)).replace(/\D/g, '');
                if (datosPersonales && dni.includes(consulta) && !coincidenciasPorDni.has(dni)) {
                    coincidenciasPorDni.set(dni, { datosPersonales, dni });
                }
            });

            dniSugerencias.replaceChildren();
            if (!coincidenciasPorDni.size) {
                estado.textContent = 'No hay visitantes registrados con ese DNI en MOVIMIENTOS.';
                dniSugerencias.appendChild(estado);
                return;
            }

            coincidenciasPorDni.forEach((visitante) => {
                const opcion = document.createElement('button');
                opcion.type = 'button';
                opcion.className = 'dni-suggestion-option';
                opcion.setAttribute('role', 'option');
                opcion.textContent = `${visitante.datosPersonales} (DNI: ${visitante.dni})`;
                opcion.addEventListener('click', (evento) => {
                    evento.stopPropagation();
                    datosPersonalesInput.value = visitante.datosPersonales;
                    escaneoRawInput.value = visitante.dni;
                    visitanteDniSeleccionado = true;
                    dniVisitanteSeleccionado = visitante.dni;
                    ocultarSugerenciasDni();
                    const estadoEscaner = document.getElementById('scannerStatus');
                    if (estadoEscaner) estadoEscaner.textContent = 'Visitante encontrado en MOVIMIENTOS.';
                    empresaInput.focus();
                });
                dniSugerencias.appendChild(opcion);
            });
        } catch (error) {
            if (idConsulta !== consultaDniActual) return;
            console.error('Error al buscar visitantes por DNI en MOVIMIENTOS:', error);
            dniSugerencias.replaceChildren();
            estado.textContent = error.message || 'No se pudo buscar en MOVIMIENTOS.';
            dniSugerencias.appendChild(estado);
        }
    }, inmediato ? 0 : 180);
}

if (btnBuscarDni) {
    btnBuscarDni.addEventListener('click', () => {
        if (!obtenerDniIngresado()) {
            dniSugerencias.replaceChildren();
            const mensaje = document.createElement('div');
            mensaje.className = 'dni-suggestion-empty';
            mensaje.textContent = 'Ingrese un DNI usando números antes de buscar.';
            dniSugerencias.appendChild(mensaje);
            dniSugerencias.hidden = false;
            escaneoRawInput?.setAttribute('aria-expanded', 'true');
            escaneoRawInput?.focus();
            return;
        }
        actualizarSugerenciasDni(true);
    });
}

if (escaneoRawInput) {
    escaneoRawInput.addEventListener('keydown', (evento) => {
        if (evento.key === 'Escape') {
            ocultarSugerenciasDni();
            return;
        }
        if (!dniSugerencias || dniSugerencias.hidden) return;
        if (evento.key === 'ArrowDown') {
            evento.preventDefault();
            dniSugerencias.querySelector('[role="option"]')?.focus();
        } else if (evento.key === 'Enter') {
            const primeraOpcion = dniSugerencias.querySelector('[role="option"]');
            if (primeraOpcion) {
                evento.preventDefault();
                primeraOpcion.click();
            }
        }
    });
}

function obtenerContactosWhatsapp() {
    const contactos = new Map();
    contactosWhatsappPlanilla.forEach(({ nombre, telefono, interno }) => {
        const clave = `${nombre.toLocaleLowerCase('es')}|${telefono}`;
        if (!contactos.has(clave)) contactos.set(clave, { nombre, telefono, interno });
    });
    return [...contactos.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
}

async function cargarContactosWhatsapp() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/anfitriones`, { cache: 'no-store' });
        const resultado = await response.json();
        if (!response.ok || !Array.isArray(resultado)) {
            throw new Error(resultado.message || 'No se pudieron cargar los contactos de ANFITRIONES.');
        }
        contactosWhatsappPlanilla = resultado
            .map((contacto) => ({
                nombre: String(contacto.nombre || '').trim(),
                telefono: String(contacto.telefono || '').replace(/\D/g, ''),
                interno: String(contacto.interno || '').trim()
            }))
            .filter((contacto) => contacto.nombre && contacto.telefono.length >= 8);
        estadoCargaContactosWhatsapp = 'cargados';
        errorCargaContactosWhatsapp = '';
    } catch (error) {
        estadoCargaContactosWhatsapp = 'error';
        errorCargaContactosWhatsapp = error.message || 'No se pudieron cargar los contactos de ANFITRIONES.';
        console.error('Error al cargar contactos desde la pestaña ANFITRIONES:', error);
    }
    if (whatsappContactSearch?.value.trim()) mostrarSugerenciasContactosWhatsapp();
}

function mostrarSugerenciasContactosWhatsapp() {
    if (!whatsappContactSearch || !whatsappContactSuggestions) return;
    const consulta = normalizarTexto(whatsappContactSearch.value.trim());
    whatsappContactSuggestions.replaceChildren();
    contactoWhatsappSeleccionado = null;
    if (btnAbrirWhatsApp) btnAbrirWhatsApp.disabled = true;
    if (whatsappContactSelection) whatsappContactSelection.textContent = 'Seleccione un contacto para preparar el mensaje.';

    if (consulta.length < 2) {
        whatsappContactSuggestions.hidden = true;
        return;
    }

    if (estadoCargaContactosWhatsapp === 'cargando') {
        mostrarMensajeContactosWhatsapp('Cargando contactos desde ANFITRIONES…');
        return;
    }
    if (estadoCargaContactosWhatsapp === 'error') {
        mostrarMensajeContactosWhatsapp(`No se pudieron cargar los contactos: ${errorCargaContactosWhatsapp}`);
        return;
    }

    const terminosConsulta = consulta.split(/\s+/).filter(Boolean);
    const coincidencias = obtenerContactosWhatsapp()
        .filter((contacto) => {
            const datosContacto = normalizarTexto(
                `${contacto.nombre} ${contacto.telefono} ${contacto.interno}`
            );
            return terminosConsulta.every((termino) => datosContacto.includes(termino));
        })
        .slice(0, 20);
    if (!coincidencias.length) {
        mostrarMensajeContactosWhatsapp('No se encontraron contactos por nombre, celular o interno en ANFITRIONES.');
        return;
    }

    coincidencias.forEach((contacto) => {
        const opcion = document.createElement('button');
        opcion.type = 'button';
        opcion.className = 'dni-suggestion-option';
        opcion.textContent = `${contacto.nombre} — ${contacto.telefono}${contacto.interno ? ` — Int. ${contacto.interno}` : ''}`;
        opcion.addEventListener('click', () => {
            contactoWhatsappSeleccionado = contacto;
            whatsappContactSearch.value = contacto.nombre;
            whatsappContactSuggestions.hidden = true;
            whatsappContactSelection.textContent = `Contacto elegido: ${contacto.nombre} (${contacto.telefono})`;
            btnAbrirWhatsApp.disabled = !datosUltimoRegistroWhatsapp;
        });
        whatsappContactSuggestions.appendChild(opcion);
    });
    whatsappContactSuggestions.hidden = false;
}

function mostrarMensajeContactosWhatsapp(texto) {
    const mensaje = document.createElement('div');
    mensaje.className = 'dni-suggestion-empty';
    mensaje.textContent = texto;
    whatsappContactSuggestions.appendChild(mensaje);
    whatsappContactSuggestions.hidden = false;
}

if (whatsappContactSearch) {
    whatsappContactSearch.addEventListener('input', mostrarSugerenciasContactosWhatsapp);
}

if (btnAbrirWhatsApp) {
    btnAbrirWhatsApp.addEventListener('click', () => {
        if (!contactoWhatsappSeleccionado || !datosUltimoRegistroWhatsapp) return;
        const { nombre, telefono } = contactoWhatsappSeleccionado;
        const visita = datosUltimoRegistroWhatsapp;
        const mensaje = visita.modoMercadoLibre
            ? [
                `📦 *Estimado/a:*`,
                '',
                `🔔 Tiene un envío de la empresa *${visita.empresa || 'MERCADO LIBRE'}* para ser retirado en la guardia.`,
                '',
                `📦 *Cantidad de bultos:* ${visita.bultos || 1}`,
                '📍 *Lugar de retiro:* Guardia',
                '',
                '_Atentamente,_',
                '_*Control de Accesos COFARMEN*_'
            ].join('\n')
            : [
                '📢 *Aviso de Ingreso*',
                '',
                `Hola Sr/a *${nombre}*, le informamos que se registró una nueva visita en portería:`,
                '',
                `👤 *Visitante:* ${visita.datosPersonales}`,
                `📍 *Sector:* ${visita.sector}`,
                `📝 *Observaciones:* ${visita.observaciones || 'Ninguna'}`
            ].join('\n');
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.location.assign(url);
    });
}

// =========================================================================
// 4. SISTEMA DE LIMPIEZA Y DESARMADO DE DNI (@ / QR)
// =========================================================================
if (escaneoRawInput) {
    escaneoRawInput.addEventListener('input', () => {
        const rawText = escaneoRawInput.value.trim();
        if (timeoutAutoGuardar) clearTimeout(timeoutAutoGuardar);
        if (visitanteDniSeleccionado) {
            datosPersonalesInput.value = '';
            visitanteDniSeleccionado = false;
            dniVisitanteSeleccionado = '';
        }
        if (!rawText) {
            if (timeoutSugerenciasDni) clearTimeout(timeoutSugerenciasDni);
            consultaDniActual++;
            ocultarSugerenciasDni();
            return;
        }

        if (obtenerDniIngresado()) {
            datosPersonalesInput.value = '';
            actualizarSugerenciasDni();
            return;
        }

        consultaDniActual++;
        if (timeoutSugerenciasDni) clearTimeout(timeoutSugerenciasDni);
        ocultarSugerenciasDni();

        // Desarmado de DNI tarjeta de formato argentino
        if (rawText.includes('@')) {
            const partes = rawText.split('@');
            if (partes.length >= 5) {
                const apellido = partes[1].toUpperCase();
                const nombre = partes[2].toUpperCase();
                const dni = partes[4];
                datosPersonalesInput.value = `${apellido}, ${nombre} - DNI: ${dni}`;
            } else {
                datosPersonalesInput.value = "FORMATO DNI NO RECONOCIDO";
            }
            if (!modoEventoCheck.checked) {
                groupEmpresa.style.display = 'flex';
                empresaInput.value = '';
                empresaInput.focus();
            }
        } else {
            // Desarmado de códigos QR con estructura predeterminada
            const partes = rawText.split(' - ');
            if (partes.length >= 3) {
                datosPersonalesInput.value = partes[0].toUpperCase(); 
                empresaInput.value = partes[2].toUpperCase();         
                groupEmpresa.style.display = 'none';    
            } else {
                datosPersonalesInput.value = rawText.toUpperCase(); 
            }
        }

        // Auto-guardado instantáneo en Modo Evento Masivo
        if (modoEventoCheck.checked && datosPersonalesInput.value && !datosPersonalesInput.value.includes("NO RECONOCIDO")) {
            timeoutAutoGuardar = setTimeout(() => {
                if (btnRegistrar) btnRegistrar.click(); 
            }, 200); 
        }
    });
}

if (modoEventoCheck) {
    modoEventoCheck.addEventListener('change', () => {
        if (modoEventoCheck.checked) {
            // Hacer exclusivo: desactivar MercadoLibre
            if (modoMercadoLibreCheck) {
                modoMercadoLibreCheck.checked = false;
                modoMercadoLibreCheck.disabled = true;
            }
            document.body.classList.remove('modo-mercadolibre');
            document.body.style.setProperty('--accent-blue', 'var(--accent-event)');
            groupEmpresa.style.display = 'none';
            empresaInput.value = "EVENTO";
            cargarSectores();
            sectorSelect.value = "EVENTO";
            sectorSelect.dispatchEvent(new Event('change'));
        } else {
            if (modoMercadoLibreCheck) modoMercadoLibreCheck.disabled = false;
            document.body.style.setProperty('--accent-blue', '#0052cc');
            groupEmpresa.style.display = 'flex';
            limpiarFormulario();
        }
        if (escaneoRawInput) escaneoRawInput.focus();
    });
}

if (modoMercadoLibreCheck) {
    modoMercadoLibreCheck.addEventListener('change', () => {
        if (modoMercadoLibreCheck.checked) {
            // Hacer exclusivo: desactivar Modo Evento
            if (modoEventoCheck) {
                modoEventoCheck.checked = false;
                modoEventoCheck.disabled = true;
            }
            document.body.classList.add('modo-mercadolibre');
            document.body.style.setProperty('--accent-blue', 'var(--accent-mercadolibre)');
            groupEmpresa.style.display = 'none';
            empresaInput.value = "MERCADO LIBRE";
            cargarSectores();
            // Preferir Guardia, si existe, sino Lobby
            const opts = Array.from(sectorSelect.options).map(o => o.value);
            if (opts.includes('Guardia')) {
                sectorSelect.value = 'Guardia';
            } else if (opts.includes('Lobby')) {
                sectorSelect.value = 'Lobby';
            }
            sectorSelect.dispatchEvent(new Event('change'));
        } else {
            if (modoEventoCheck) modoEventoCheck.disabled = false;
            document.body.classList.remove('modo-mercadolibre');
            document.body.style.setProperty('--accent-blue', '#0052cc');
            groupEmpresa.style.display = 'flex';
            limpiarFormulario();
        }
        if (escaneoRawInput) escaneoRawInput.focus();
    });
}

function limpiarFormulario() {
    if (escaneoRawInput) escaneoRawInput.value = '';
    if (datosPersonalesInput) datosPersonalesInput.value = '';
    visitanteDniSeleccionado = false;
    dniVisitanteSeleccionado = '';
    if (codigoFarmaciaInput) codigoFarmaciaInput.value = '';
    if (timeoutSugerenciasDni) clearTimeout(timeoutSugerenciasDni);
    consultaDniActual++;
    ocultarSugerenciasDni();
    if (!modoEventoCheck.checked) {
        if (empresaInput) empresaInput.value = '';
        if (sectorSelect) sectorSelect.value = '';
        if (anfitrionSelect) anfitrionSelect.innerHTML = '<option value="">Seleccione anfitrión...</option>';
    }
    const obsField = document.getElementById('observaciones');
    if (obsField) obsField.value = '';
    actualizarCamposMostrador();
    if (escaneoRawInput) escaneoRawInput.focus();
}

if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarFormulario);

// Escaneo por medio de la lente de la cámara del celular
async function iniciarEscaneo() {
    if (html5QrCode.isScanning) return;
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        const mensaje = 'Este entorno no permite acceder a la cámara. Actualice Android System WebView o abra QR-U desde HTTPS.';
        const estado = document.getElementById('scannerStatus');
        if (estado) estado.textContent = mensaje;
        alert(mensaje);
        return;
    }

    const lector = document.getElementById('reader');
    if (lector) lector.hidden = false;
    const estado = document.getElementById('scannerStatus');
    if (estado) estado.textContent = 'Solicitando permiso para usar la cámara…';
    try {
        if (window.QRUAndroid?.requestCameraPermission) {
            const permisoConcedido = await new Promise((resolve) => {
                window.onNativeCameraPermissionResult = (concedido) => {
                    window.onNativeCameraPermissionResult = null;
                    resolve(Boolean(concedido));
                };
                window.QRUAndroid.requestCameraPermission();
            });
            if (!permisoConcedido) {
                const errorPermiso = new Error('Active el permiso Cámara para QR-U Visitas en los ajustes de Android.');
                errorPermiso.name = 'NotAllowedError';
                throw errorPermiso;
            }
        }

        const camaras = await Html5Qrcode.getCameras();
        if (!camaras.length) {
            throw new Error('No se encontró una cámara disponible en este dispositivo.');
        }
        const camaraTrasera = camaras.find(({ label }) => /back|rear|environment|trasera|posterior/i.test(label));
        const camaraElegida = camaraTrasera || camaras[0];

        await html5QrCode.start(
            camaraElegida.id,
            {
                fps: 10,
                qrbox: { width: 240, height: 240 }
            },
            (decodedText) => {
                if (escaneoRawInput) {
                    escaneoRawInput.value = decodedText;
                    escaneoRawInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (estado) estado.textContent = 'Código leído correctamente.';
                html5QrCode.stop().catch((error) => {
                    console.error('No se pudo detener la cámara después del escaneo.', error);
                }).finally(() => {
                    if (lector) lector.hidden = true;
                });
            },
            (errorMessage) => {
                // Dejar vacío para que los reniegos internos de la cámara no molesten en la pantalla
            }
        );

        if (estado) estado.textContent = `Cámara activa (${camaraElegida.label || 'trasera'}). Centre el código dentro del recuadro.`;
    } catch (err) {
        if (lector) lector.hidden = true;
        console.error('No se pudo iniciar la cámara para escanear.', err);
        let mensaje = err.message || 'No se pudo iniciar la cámara.';
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            mensaje = 'Permiso de cámara denegado. Habilite Cámara en Ajustes > Aplicaciones > QR-U Visitas > Permisos y revise que el acceso general a la cámara de Android esté activado.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            mensaje = 'No se encontró una cámara disponible en este dispositivo.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            mensaje = 'La cámara está siendo usada por otra aplicación. Ciérrela y vuelva a intentar.';
        } else if (err.name === 'OverconstrainedError') {
            mensaje = 'Android no pudo iniciar esa cámara. Cierre otras aplicaciones que la usen y vuelva a intentar.';
        }
        if (estado) estado.textContent = mensaje;
        alert(mensaje);
    }
}

// =========================================================================
// 5. EVENTO REGISTRAR - ENVÍO SEGURO DIRECTO A GOOGLE SCRIPT (NO-CORS)
// =========================================================================
if (btnRegistrar) {
    btnRegistrar.addEventListener('click', async () => {
        if (btnRegistrar.disabled) return;
        const camposObligatoriosFaltantes = [];
        if (!datosPersonalesInput.value.trim()) camposObligatoriosFaltantes.push('Datos Personales');
        if (!sectorSelect.value.trim()) camposObligatoriosFaltantes.push('Sector a Visitar');
        if (!anfitrionSelect.value.trim()) camposObligatoriosFaltantes.push('Anfitrión / Quien Recibe');
        if (camposObligatoriosFaltantes.length) {
            alert(`Complete los siguientes campos obligatorios: ${camposObligatoriosFaltantes.join(', ')}.`);
            if (!datosPersonalesInput.value.trim()) escaneoRawInput?.focus();
            else if (!sectorSelect.value.trim()) sectorSelect.focus();
            else anfitrionSelect.focus();
            return;
        }

        const selectedOption = anfitrionSelect.options[anfitrionSelect.selectedIndex];
        const nroContacto = selectedOption ? selectedOption.dataset.contacto : '5492615320950';
        const obsElement = document.getElementById('observaciones');
        const observacionesTexto = obsElement && obsElement.value ? obsElement.value.toUpperCase() : 'SIN OBSERVACIONES';
        const cantidadBultosInput = document.getElementById('cantidadBultos');
        const cantidadBultos = modoMercadoLibreCheck.checked && cantidadBultosInput
            ? Number(cantidadBultosInput.value) || 0
            : 0;
        const anfitrionVal = anfitrionSelect.value ? anfitrionSelect.value.toUpperCase() : '';
        const pertenece = anfitrionVal === 'PERTENECIENTE';
        const codigoFarmacia = (codigoFarmaciaInput?.value || '').trim();

        if (esMostrador() && !codigoFarmacia) {
            alert('Por favor, ingrese el código de farmacia para los ingresos por Mostrador.');
            codigoFarmaciaInput?.focus();
            return;
        }
        if (esMostrador() && !datosPersonalesInput.value) {
            alert('Busque y seleccione al visitante por DNI para registrar un ingreso por Mostrador.');
            escaneoRawInput?.focus();
            return;
        }
        whatsappContactPanel.hidden = true;
        datosUltimoRegistroWhatsapp = null;
        contactoWhatsappSeleccionado = null;
        btnAbrirWhatsApp.disabled = true;

        // Empaquetamos para el script/hoja
        const datosObj = {
            "datosPersonales": datosPersonalesInput.value.toUpperCase(),
            "empresa": (empresaInput.value || "VISITA").toUpperCase(),
            "codigoFarmacia": codigoFarmacia,
            "sector": sectorSelect.value.toUpperCase(),
            "anfitrion": anfitrionVal,
            "observaciones": observacionesTexto,
            "modoEvento": modoEventoCheck.checked, // Envía true o false
            "modoMercadoLibre": modoMercadoLibreCheck.checked,
            "bultos": cantidadBultos,
            "perteneciente": pertenece
        };

        btnRegistrar.disabled = true;
        formProcessing.hidden = false;
        const faseProcesamiento = 'Guardando el ingreso en la hoja de cálculo';
        const inicioProcesamiento = Date.now();
        const controladorEnvio = new AbortController();
        const intervaloProcesamiento = setInterval(() => {
            const segundos = Math.floor((Date.now() - inicioProcesamiento) / 1000);
            formProcessingMessage.textContent = `${faseProcesamiento} (${segundos}s)…`;
        }, 1000);
        const tiempoLimiteEnvio = setTimeout(() => controladorEnvio.abort(), 30000);

        try {
            const respuesta = await fetch(URL_API_GOOGLE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosObj),
                signal: controladorEnvio.signal
            });

            const textoRespuesta = await respuesta.text();
            let resultado;
            try {
                resultado = textoRespuesta ? JSON.parse(textoRespuesta) : {};
            } catch (errorParseo) {
                const detalle = textoRespuesta.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180);
                throw new Error(`El servidor respondió con un formato inesperado (HTTP ${respuesta.status})${detalle ? `: ${detalle}` : '.'}`);
            }
            if (!respuesta.ok || resultado.success === false || resultado.status === 'error') {
                throw new Error(resultado.message || `El servidor rechazó el registro (HTTP ${respuesta.status}).`);
            }

            alert("✅ Registro enviado a la hoja de cálculo con éxito.");

            limpiarFormulario();
            datosUltimoRegistroWhatsapp = datosObj;
            whatsappContactSearch.value = '';
            whatsappContactSuggestions.replaceChildren();
            whatsappContactSuggestions.hidden = true;
            whatsappContactSelection.textContent = estadoCargaContactosWhatsapp === 'error'
                ? `No se pudieron cargar los contactos de ANFITRIONES: ${errorCargaContactosWhatsapp}`
                : estadoCargaContactosWhatsapp === 'cargando'
                    ? 'Cargando contactos desde ANFITRIONES…'
                    : 'Busque y seleccione un contacto de ANFITRIONES.';
            whatsappContactPanel.hidden = false;

        } catch (error) {
            console.error("Error crítico de red:", error);
            if (error.name === 'AbortError') {
                alert('❌ La operación tardó más de 30 segundos y se canceló la espera. Verifique si el ingreso quedó guardado antes de volver a registrarlo.');
            } else {
                alert(`❌ No se pudo completar el registro: ${error.message || 'Error de conexión.'}`);
            }
        } finally {
            clearInterval(intervaloProcesamiento);
            clearTimeout(tiempoLimiteEnvio);
            formProcessing.hidden = true;
            btnRegistrar.disabled = false;
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    cargarSectores();
    actualizarCamposMostrador();
    cargarContactosWhatsapp();
    if (escaneoRawInput) escaneoRawInput.focus();
});
