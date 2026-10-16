// =========================================================================
// 1. CONFIGURACIÓN DE ENLACES Y CONEXIONES (REEMPLAZÁ ACÁ)
// =========================================================================
const html5QrCode = new Html5Qrcode("reader");

const API_BASE_URL = window.location.hostname.endsWith('github.io')
    ? 'https://visitas-qru-api.onrender.com'
    : '';
const URL_API_GOOGLE = `${API_BASE_URL}/api/registro`;
const URL_API_VISITAS = `${API_BASE_URL}/api/visitas`;

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
const groupDniBusqueda = document.getElementById('groupDniBusqueda');
const dniBusquedaInput = document.getElementById('dniBusqueda');
const dniSugerencias = document.getElementById('dniSugerencias');
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
const btnExportarPdf = document.getElementById('btnExportarPdf');
const btnEnviarCorreo = document.getElementById('btnEnviarCorreo');
const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
const btnUltimos15 = document.getElementById('btnUltimos15');
const btnActualizarDatos = document.getElementById('btnActualizarDatos');
const tablaVisitasBody = document.getElementById('tablaVisitasBody');
const reportSummary = document.getElementById('reportSummary');
const resultCounter = document.getElementById('resultCounter');
const filtroTexto = document.getElementById('filtroTexto');
const filtroSector = document.getElementById('filtroSector');
const filtroAnfitrion = document.getElementById('filtroAnfitrion');
const filtroEmpresa = document.getElementById('filtroEmpresa');
const filtroDesde = document.getElementById('filtroDesde');
const filtroHasta = document.getElementById('filtroHasta');
const filtroModoEvento = document.getElementById('filtroModoEvento');
const correoDestino = document.getElementById('correoDestino');
const viewTabs = document.querySelectorAll('.view-tab');
const viewPanels = document.querySelectorAll('.view-panel');

let timeoutAutoGuardar = null;
let visitasRegistradas = [];
let datosUltimoRegistroWhatsapp = null;
let contactoWhatsappSeleccionado = null;

// Foco automático para disparar con la pistola de hardware
document.addEventListener('click', (evento) => {
    const camposPermitidos = ['escaneoRaw', 'sector', 'anfitrion', 'observaciones', 'empresa', 'codigoFarmacia', 'dniBusqueda', 'modoEvento'];
    if (camposPermitidos.includes(evento.target.id) || evento.target.tagName === 'OPTION'
        || evento.target.closest('#dniSugerencias, #whatsappContactPanel')) {
        return; 
    }
    if (esMostrador()) {
        if (dniBusquedaInput) dniBusquedaInput.focus();
    } else if (escaneoRawInput) {
        escaneoRawInput.focus();
    }
});

function esMostrador() {
    return sectorSelect.value.trim().toLocaleLowerCase('es') === 'mostrador'
        || anfitrionSelect.value.toLocaleLowerCase('es').includes('mostrador');
}

function actualizarCamposMostrador() {
    const mostrar = esMostrador();
    if (groupDniBusqueda) groupDniBusqueda.hidden = !mostrar;
    if (groupCodigoFarmacia) groupCodigoFarmacia.hidden = !mostrar;
    const mostrarBultos = Boolean(modoMercadoLibreCheck?.checked);
    if (groupCantidadBultos) groupCantidadBultos.hidden = !mostrarBultos;
    if (!mostrarBultos && cantidadBultosInput) cantidadBultosInput.value = '';
    if (codigoFarmaciaInput) {
        codigoFarmaciaInput.required = mostrar;
        if (!mostrar) codigoFarmaciaInput.value = '';
    }
    if (!mostrar && dniBusquedaInput) dniBusquedaInput.value = '';
    if (!mostrar && dniSugerencias) {
        dniSugerencias.replaceChildren();
        dniSugerencias.hidden = true;
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

async function actualizarSugerenciasDni() {
    if (!dniBusquedaInput || !dniSugerencias) return;
    const consulta = dniBusquedaInput.value.replace(/\D/g, '').slice(0, 9);
    dniBusquedaInput.value = consulta;
    datosPersonalesInput.value = '';
    dniSugerencias.replaceChildren();
    const idConsulta = ++consultaDniActual;

    if (consulta.length < 3) {
        dniSugerencias.hidden = true;
        return;
    }

    const estado = document.createElement('div');
    estado.className = 'dni-suggestion-empty';
    estado.textContent = 'Buscando en MOVIMIENTOS…';
    dniSugerencias.appendChild(estado);
    dniSugerencias.hidden = false;

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
            opcion.textContent = `${visitante.datosPersonales} (DNI: ${visitante.dni})`;
            opcion.addEventListener('click', () => {
                datosPersonalesInput.value = visitante.datosPersonales;
                dniBusquedaInput.value = visitante.dni;
                dniSugerencias.hidden = true;
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
}

if (dniBusquedaInput) {
    dniBusquedaInput.addEventListener('input', actualizarSugerenciasDni);
}

function obtenerContactosWhatsapp() {
    const contactos = new Map();
    Object.entries(maestroSectores).forEach(([sector, anfitriones]) => {
        anfitriones.forEach(({ nombre, contacto }) => {
            const telefono = String(contacto || '').replace(/\D/g, '');
            if (!nombre || telefono.length < 10) return;
            const clave = `${nombre.trim().toLocaleLowerCase('es')}|${telefono}`;
            if (!contactos.has(clave)) contactos.set(clave, { nombre: nombre.trim(), telefono, sector });
        });
    });
    return [...contactos.values()].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
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

    const coincidencias = obtenerContactosWhatsapp()
        .filter((contacto) => normalizarTexto(contacto.nombre).includes(consulta))
        .slice(0, 20);
    if (!coincidencias.length) {
        const mensaje = document.createElement('div');
        mensaje.className = 'dni-suggestion-empty';
        mensaje.textContent = 'No se encontraron contactos con ese nombre.';
        whatsappContactSuggestions.appendChild(mensaje);
        whatsappContactSuggestions.hidden = false;
        return;
    }

    coincidencias.forEach((contacto) => {
        const opcion = document.createElement('button');
        opcion.type = 'button';
        opcion.className = 'dni-suggestion-option';
        opcion.textContent = `${contacto.nombre} — ${contacto.sector}`;
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
        window.open(url, '_blank', 'noopener,noreferrer');
    });
}

// =========================================================================
// 4. SISTEMA DE LIMPIEZA Y DESARMADO DE DNI (@ / QR)
// =========================================================================
if (escaneoRawInput) {
    escaneoRawInput.addEventListener('input', () => {
        const rawText = escaneoRawInput.value.trim();
        if (!rawText) return;

        if (timeoutAutoGuardar) clearTimeout(timeoutAutoGuardar);

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
    if (dniBusquedaInput) dniBusquedaInput.value = '';
    if (codigoFarmaciaInput) codigoFarmaciaInput.value = '';
    if (dniSugerencias) {
        dniSugerencias.replaceChildren();
        dniSugerencias.hidden = true;
    }
    if (!modoEventoCheck.checked) {
        if (empresaInput) empresaInput.value = '';
        if (sectorSelect) sectorSelect.value = '';
        if (anfitrionSelect) anfitrionSelect.innerHTML = '<option value="">Seleccione anfitrión...</option>';
    }
    const obsField = document.getElementById('observaciones');
    if (obsField) obsField.value = '';
    actualizarCamposMostrador();
    if (esMostrador() && dniBusquedaInput) dniBusquedaInput.focus();
    else if (escaneoRawInput) escaneoRawInput.focus();
}

if (btnLimpiar) btnLimpiar.addEventListener('click', limpiarFormulario);

function abrirVista(vista) {
    viewPanels.forEach((panel) => {
        panel.classList.toggle('hidden', panel.id !== (vista === 'reporte' ? 'seccionReporte' : 'seccionRegistro'));
    });
    viewTabs.forEach((tab) => {
        tab.classList.toggle('active', tab.dataset.view === vista);
    });
    // Aplicar clase de vista en el body para paleta de colores
    document.body.classList.remove('view-principal', 'view-registro');
    if (vista === 'reporte') {
        document.body.classList.add('view-principal');
        document.body.classList.remove('modo-mercadolibre');
    } else {
        document.body.classList.add('view-registro');
    }
}

viewTabs.forEach((tab) => {
    tab.addEventListener('click', () => abrirVista(tab.dataset.view));
});

function normalizarTexto(valor) {
    return String(valor || '').toString().toLowerCase().normalize('NFD').replace(/[^a-z0-9\s]/g, '');
}

function obtenerFechaLocal(dateValue) {
    const fecha = new Date(dateValue);
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
}

function obtenerFechaHoraLocal(dateValue) {
    const fecha = new Date(dateValue);
    return fecha.toLocaleString('es-AR', {
        dateStyle: 'short',
        timeStyle: 'short'
    });
}

function obtenerPeriodo(fecha, tipo) {
    const date = new Date(fecha);
    if (tipo === 'mes') {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    }
    if (tipo === 'semana') {
        const inicio = new Date(date);
        const dia = inicio.getDay();
        const diff = inicio.getDate() - dia + (dia === 0 ? -6 : 1);
        inicio.setDate(diff);
        return `${inicio.getFullYear()}-${String(inicio.getMonth() + 1).padStart(2, '0')}-${String(inicio.getDate()).padStart(2, '0')}`;
    }
    return `${date.getFullYear()}`;
}

function crearVisitaDesdeRegistro(datosObj) {
    const ahora = new Date();
    return {
        id: `${ahora.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
        fecha: ahora.toISOString(),
        fechaTexto: obtenerFechaHoraLocal(ahora),
        datosPersonales: datosObj.datosPersonales || '',
        empresa: datosObj.empresa || '',
        codigoFarmacia: datosObj.codigoFarmacia || '',
        sector: datosObj.sector || '',
        anfitrion: datosObj.anfitrion || '',
        observaciones: datosObj.observaciones || 'SIN OBSERVACIONES',
        modoEvento: Boolean(datosObj.modoEvento),
        bultos: Number(datosObj.bultos) || 0,
        perteneciente: Boolean(datosObj.perteneciente)
    };
}

function normalizarVisitaDesdeHoja(item) {
    const fechaRaw = item.fecha || item.Timestamp || item.timestamp || item['Fecha y hora'] || new Date().toISOString();
    return {
        id: item.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        fecha: new Date(fechaRaw).toISOString(),
        fechaTexto: item.fechaTexto || obtenerFechaHoraLocal(fechaRaw),
        datosPersonales: item.datosPersonales || item['Datos Personales'] || '',
        empresa: item.empresa || item.Empresa || '',
        codigoFarmacia: item.codigoFarmacia || item['Código de Farmacia'] || item['CODIGO DE FARMACIA'] || '',
        sector: item.sector || item.Sector || '',
        anfitrion: item.anfitrion || item['Anfitrión'] || '',
        observaciones: item.observaciones || item.Observaciones || 'SIN OBSERVACIONES',
        tipoVisita: item.tipoVisita || item['Tipo de visita'] || item['Tipo de Visita'] || (item.modoEvento ? 'Modo Evento' : 'Modo Normal'),
        modoEvento: Boolean(item.modoEvento || (item.tipoVisita && String(item.tipoVisita).toLowerCase().includes('evento')))
    };
}

function poblarFiltros() {
    if (!filtroSector || !filtroAnfitrion || !filtroEmpresa) return;

    const sectors = [...new Set(visitasRegistradas.map((visita) => visita.sector).filter(Boolean))].sort();
    const anfitriones = [...new Set(visitasRegistradas.map((visita) => visita.anfitrion).filter(Boolean))].sort();
    const empresas = [...new Set(visitasRegistradas.map((visita) => visita.empresa).filter(Boolean))].sort();

    filtroSector.innerHTML = '<option value="">Todos los sectores</option>' + sectors.map((value) => `<option value="${value}">${value}</option>`).join('');
    filtroAnfitrion.innerHTML = '<option value="">Todos los anfitriones</option>' + anfitriones.map((value) => `<option value="${value}">${value}</option>`).join('');
    filtroEmpresa.innerHTML = '<option value="">Todas las empresas</option>' + empresas.map((value) => `<option value="${value}">${value}</option>`).join('');
}

async function cargarVisitasDesdeServidor(mostrarMensaje = false) {
    try {
        const response = await fetch(URL_API_VISITAS, { method: 'GET' });
        const data = await response.json();
        const lista = Array.isArray(data) ? data : (Array.isArray(data.visitas) ? data.visitas : []);
        if (lista.length) {
            visitasRegistradas = lista.map(normalizarVisitaDesdeHoja);
            poblarFiltros();
            filtrarVisitas();
            if (mostrarMensaje && resultCounter) {
                resultCounter.textContent = `${visitasRegistradas.length} registros cargados desde la hoja`;
            }
        } else if (mostrarMensaje && resultCounter) {
            resultCounter.textContent = 'No se encontraron registros nuevos';
        }
    } catch (error) {
        console.warn('No se pudieron cargar las visitas desde el servidor, se usará el estado local.', error);
        if (mostrarMensaje && resultCounter) {
            resultCounter.textContent = 'No se pudo actualizar desde la hoja';
        }
    }
}

function filtrarVisitas() {
    const texto = normalizarTexto(filtroTexto?.value || '');
    const sector = (filtroSector?.value || '').trim().toUpperCase();
    const anfitrion = (filtroAnfitrion?.value || '').trim().toUpperCase();
    const empresa = (filtroEmpresa?.value || '').trim().toUpperCase();
    const desde = filtroDesde?.value || '';
    const hasta = filtroHasta?.value || '';
    const modo = (filtroModoEvento?.value || '').trim().toLowerCase();

    const filtradas = visitasRegistradas.filter((visita) => {
        const fechaVisita = visita.fecha ? visita.fecha.slice(0, 10) : '';
        const coincideTexto = !texto || [
            visita.datosPersonales,
            visita.empresa,
            visita.observaciones,
            visita.sector,
            visita.anfitrion,
            visita.tipoVisita
        ].some((campo) => normalizarTexto(campo).includes(texto));
        const coincideSector = !sector || (visita.sector || '').toUpperCase() === sector;
        const coincideAnfitrion = !anfitrion || (visita.anfitrion || '').toUpperCase() === anfitrion;
        const coincideEmpresa = !empresa || (visita.empresa || '').toUpperCase() === empresa;
        const coincideDesde = !desde || fechaVisita >= desde;
        const coincideHasta = !hasta || fechaVisita <= hasta;
        const coincideModo = !modo || (modo === 'evento' ? visita.modoEvento : !visita.modoEvento);
        return coincideTexto && coincideSector && coincideAnfitrion && coincideEmpresa && coincideDesde && coincideHasta && coincideModo;
    });

    renderizarReporte(filtradas);
}

function renderizarReporte(lista) {
    if (!tablaVisitasBody || !reportSummary || !resultCounter) return;

    const hoy = new Date();
    const mesActual = obtenerPeriodo(hoy, 'mes');
    const semanaActual = obtenerPeriodo(hoy, 'semana');
    const anioActual = obtenerPeriodo(hoy, 'anio');

    const total = lista.length;
    const mes = lista.filter((visita) => obtenerPeriodo(visita.fecha, 'mes') === mesActual).length;
    const semana = lista.filter((visita) => obtenerPeriodo(visita.fecha, 'semana') === semanaActual).length;
    const anio = lista.filter((visita) => obtenerPeriodo(visita.fecha, 'anio') === anioActual).length;
    const empresasFrecuentes = [...new Set(lista.map((visita) => visita.empresa).filter(Boolean))];
    const topEmpresa = empresasFrecuentes.length ? empresasFrecuentes[0] : 'Sin datos';
    const totalBultos = lista.reduce((acc, v) => acc + (Number(v.bultos) || 0), 0);

    reportSummary.innerHTML = `
        <div class="summary-card"><strong>${total}</strong><span>Total de visitas</span></div>
        <div class="summary-card"><strong>${mes}</strong><span>En el mes</span></div>
        <div class="summary-card"><strong>${semana}</strong><span>En la semana</span></div>
        <div class="summary-card"><strong>${anio}</strong><span>En el año</span></div>
        <div class="summary-card"><strong>${topEmpresa}</strong><span>Empresa más recurrente</span></div>
        <div class="summary-card"><strong>${totalBultos}</strong><span>Total bultos</span></div>
    `;

    resultCounter.textContent = `${total} registros filtrados`;

    if (!lista.length) {
        tablaVisitasBody.innerHTML = '<tr><td colspan="8" class="empty-state">No hay visitas para los filtros aplicados.</td></tr>';
        return;
    }

    tablaVisitasBody.innerHTML = lista.map((visita) => `
        <tr>
            <td>${visita.fechaTexto}</td>
            <td>${visita.datosPersonales}</td>
            <td>${visita.empresa || 'Sin empresa'}</td>
            <td>${visita.sector || 'Sin sector'}</td>
            <td>${visita.anfitrion || 'Sin anfitrión'}</td>
            <td>${visita.observaciones || 'Sin observaciones'}</td>
            <td>${visita.bultos || 0}</td>
            <td>${visita.tipoVisita || (visita.modoEvento ? 'Modo Evento' : 'Modo Normal')}</td>
        </tr>
    `).join('');
}

function limpiarFiltros() {
    if (filtroTexto) filtroTexto.value = '';
    if (filtroSector) filtroSector.value = '';
    if (filtroAnfitrion) filtroAnfitrion.value = '';
    if (filtroEmpresa) filtroEmpresa.value = '';
    if (filtroDesde) filtroDesde.value = '';
    if (filtroHasta) filtroHasta.value = '';
    if (filtroModoEvento) filtroModoEvento.value = '';
    filtrarVisitas();
}

function mostrarUltimos15() {
    abrirVista('reporte');
    const lista = Array.isArray(visitasRegistradas) && visitasRegistradas.length
        ? [...visitasRegistradas].sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0)).slice(0, 15)
        : [];
    renderizarReporte(lista);
    if (resultCounter) {
        resultCounter.textContent = `${lista.length} registros recientes`;
    }
    if (tablaVisitasBody) {
        tablaVisitasBody.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function generarContenidoCorreo() {
    const fecha = new Date().toLocaleDateString('es-AR', { dateStyle: 'long' });
    const total = visitasRegistradas.length;
    const filt = visitasRegistradas.filter((visita) => {
        const texto = normalizarTexto(filtroTexto?.value || '');
        const sector = (filtroSector?.value || '').trim().toUpperCase();
        const anfitrion = (filtroAnfitrion?.value || '').trim().toUpperCase();
        const empresa = (filtroEmpresa?.value || '').trim().toUpperCase();
        const desde = filtroDesde?.value || '';
        const hasta = filtroHasta?.value || '';
        const modo = (filtroModoEvento?.value || '').trim().toLowerCase();
        const fechaVisita = visita.fecha ? visita.fecha.slice(0, 10) : '';
        const coincideTexto = !texto || [visita.datosPersonales, visita.empresa, visita.observaciones, visita.sector, visita.anfitrion].some((campo) => normalizarTexto(campo).includes(texto));
        const coincideSector = !sector || visita.sector.toUpperCase() === sector;
        const coincideAnfitrion = !anfitrion || visita.anfitrion.toUpperCase() === anfitrion;
        const coincideEmpresa = !empresa || visita.empresa.toUpperCase() === empresa;
        const coincideDesde = !desde || fechaVisita >= desde;
        const coincideHasta = !hasta || fechaVisita <= hasta;
        const coincideModo = !modo || (modo === 'evento' ? visita.modoEvento : !visita.modoEvento);
        return coincideTexto && coincideSector && coincideAnfitrion && coincideEmpresa && coincideDesde && coincideHasta && coincideModo;
    });

    const resumen = `Reporte ejecutivo de visitas registradas\nFecha: ${fecha}\nTotal de registros: ${filt.length} de ${total}\nResumen: ${filt.length} visitas registradas con los filtros aplicados.`;
    const tabla = filt.slice(0, 10).map((visita) => `- ${visita.fechaTexto}: ${visita.datosPersonales} | ${visita.empresa || 'Sin empresa'} | ${visita.sector || 'Sin sector'}`).join('\n');
    return `${resumen}\n\nDetalle principal:\n${tabla}\n\nSaludos cordiales,\nEquipo de administración`;
}

function exportarPdf() {
    if (!visitasRegistradas.length) {
        alert('No hay visitas cargadas para exportar.');
        return;
    }
    window.print();
}

function enviarCorreo() {
    const destino = correoDestino?.value || 'gerencia@empresa.com';
    const asunto = encodeURIComponent('Reporte ejecutivo de visitas registradas');
    const cuerpo = encodeURIComponent(generarContenidoCorreo());
    window.location.href = `mailto:${destino}?subject=${asunto}&body=${cuerpo}`;
}

if (btnExportarPdf) btnExportarPdf.addEventListener('click', exportarPdf);
if (btnEnviarCorreo) btnEnviarCorreo.addEventListener('click', enviarCorreo);
if (btnLimpiarFiltros) btnLimpiarFiltros.addEventListener('click', limpiarFiltros);
if (btnUltimos15) btnUltimos15.addEventListener('click', mostrarUltimos15);
if (btnActualizarDatos) {
    btnActualizarDatos.addEventListener('click', async () => {
        await cargarVisitasDesdeServidor(true);
        abrirVista('reporte');
    });
}
[
    filtroTexto,
    filtroSector,
    filtroAnfitrion,
    filtroEmpresa,
    filtroDesde,
    filtroHasta,
    filtroModoEvento
].forEach((campo) => {
    if (campo) campo.addEventListener('input', filtrarVisitas);
    if (campo) campo.addEventListener('change', filtrarVisitas);
});

// Escaneo por medio de la lente de la cámara del celular
async function iniciarEscaneo() {
    if (html5QrCode.isScanning) return;
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        const mensaje = 'La cámara requiere HTTPS. Abra la aplicación desde su dirección segura (https://) y permita el acceso a la cámara.';
        const estado = document.getElementById('scannerStatus');
        if (estado) estado.textContent = mensaje;
        alert(mensaje);
        return;
    }

    const estado = document.getElementById('scannerStatus');
    if (estado) estado.textContent = 'Solicitando permiso para usar la cámara…';
    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            { 
                fps: 20, 
                // Subimos a 240 para que el DNI entre un poco más cómodo pero siga estando cerca
                qrbox: { width: 240, height: 240 }, 
                videoConstraints: {
                    facingMode: "environment",
                    // Dejamos un rango estándar para que no tire errores de hardware
                    width: { min: 640, ideal: 1280 },
                    height: { min: 480, ideal: 720 }
                }
            },
            (decodedText) => {
                if (escaneoRawInput) {
                    escaneoRawInput.value = decodedText;
                    escaneoRawInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                if (estado) estado.textContent = 'Código leído correctamente.';
                html5QrCode.stop().catch((error) => {
                    console.error('No se pudo detener la cámara después del escaneo.', error);
                });
            },
            (errorMessage) => {
                // Dejar vacío para que los reniegos internos de la cámara no molesten en la pantalla
            }
        );

        // Intenta aplicar el zoom si la cámara elegida lo soporta
        const videoTrack = html5QrCode.getRunningTrack();
        if (estado) estado.textContent = 'Cámara activa. Centre el código dentro del recuadro.';
        setTimeout(() => {
            if (videoTrack) {
                const capabilities = videoTrack.getCapabilities();
                if (capabilities.zoom) {
                    videoTrack.applyConstraints({
                        advanced: [{ zoom: 2.0 }] 
                    }).catch(err => console.log("Zoom no soportado en esta cámara de respaldo"));
                }
            }
        }, 650); 

    } catch (err) {
        console.error('No se pudo iniciar la cámara para escanear.', err);
        let mensaje = 'No se pudo iniciar la cámara.';
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            mensaje = 'Permiso de cámara denegado. Habilite el acceso a la cámara en los permisos del navegador o de la aplicación y vuelva a intentar.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
            mensaje = 'No se encontró una cámara disponible en este dispositivo.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            mensaje = 'La cámara está siendo usada por otra aplicación. Ciérrela y vuelva a intentar.';
        } else if (err.name === 'OverconstrainedError') {
            mensaje = 'No se pudo usar la cámara trasera. Revise los permisos o intente con otro navegador.';
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
            if (!datosPersonalesInput.value.trim() && esMostrador()) dniBusquedaInput?.focus();
            else if (!datosPersonalesInput.value.trim()) escaneoRawInput?.focus();
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
            dniBusquedaInput?.focus();
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
        let faseProcesamiento = 'Guardando el ingreso en la hoja de cálculo';
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

            const visitaCreada = crearVisitaDesdeRegistro(datosObj);
            visitasRegistradas.unshift(visitaCreada);
            poblarFiltros();
            filtrarVisitas();
            faseProcesamiento = 'Ingreso guardado. Actualizando los registros';
            formProcessingMessage.textContent = faseProcesamiento + '…';
            await cargarVisitasDesdeServidor();

            alert("✅ Registro enviado a la hoja de cálculo con éxito.");

            limpiarFormulario();
            abrirVista('registro');
            datosUltimoRegistroWhatsapp = datosObj;
            whatsappContactSearch.value = '';
            whatsappContactSuggestions.replaceChildren();
            whatsappContactSuggestions.hidden = true;
            whatsappContactSelection.textContent = 'Seleccione un contacto para preparar el mensaje.';
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
    visitasRegistradas = [
        {
            id: 'demo-1',
            fecha: new Date().toISOString(),
            fechaTexto: obtenerFechaHoraLocal(new Date()),
            datosPersonales: 'SILVA, JUAN - DNI: 12345678',
            empresa: 'COFARMEN',
            sector: 'Administracion',
            anfitrion: 'Martin Marcelo',
            observaciones: 'Visita de rutina',
            modoEvento: false,
            tipoVisita: 'Modo Normal'
        },
        {
            id: 'demo-2',
            fecha: new Date(Date.now() - 86400000).toISOString(),
            fechaTexto: obtenerFechaHoraLocal(new Date(Date.now() - 86400000)),
            datosPersonales: 'PEREZ, ANA - DNI: 87654321',
            empresa: 'MERCADO LIBRE',
            sector: 'Recepción Nave 1',
            anfitrion: 'Paris Sebastian',
            observaciones: 'Ingreso por coordinación',
            modoEvento: true,
            tipoVisita: 'Modo Evento'
        }
    ];
    poblarFiltros();
    filtrarVisitas();
    cargarVisitasDesdeServidor();
    abrirVista('registro');
    if (escaneoRawInput) escaneoRawInput.focus();
});