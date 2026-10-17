const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const app = express();

const DATA_FILE = path.join(__dirname, 'data', 'visitas.json');
let visitasCache = [];

function ensureDataFile() {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, '[]', 'utf8');
    }
}

function cargarVisitasDesdeDisco() {
    try {
        ensureDataFile();
        const contenido = fs.readFileSync(DATA_FILE, 'utf8');
        const datos = JSON.parse(contenido);
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.warn('No se pudo leer el archivo de visitas, se usará un estado vacío.', error);
        return [];
    }
}

function guardarVisitasEnDisco() {
    try {
        ensureDataFile();
        fs.writeFileSync(DATA_FILE, JSON.stringify(visitasCache, null, 2), 'utf8');
    } catch (error) {
        console.warn('No se pudo persistir la lista de visitas.', error);
    }
}

visitasCache = cargarVisitasDesdeDisco();

// Configuración del Puerto
const PORT = process.env.PORT || 3000;

// URL del Apps Script publicado; se puede reemplazar por la generada al publicar el script.
const GOOGLE_SHEETS_URL = process.env.GOOGLE_APPS_SCRIPT_URL || "https://script.google.com/macros/s/AKfycbw-kgQZNcY6IDxGpu-HAAp61YuPpnu1pGI_iyVFLYjcq6CMhh6Bnepp8dGrSjlcoLyU/exec";
const ANFITRIONES_SHEET_ID = '1jSwHR5eaN7NP29-4JJSNTC2owf_ufrcB47jLMzUsNLk';
const ANFITRIONES_SHEET_GID = '535293227';

function normalizarVisitaDesdeGoogle(item) {
    const fechaTexto = item.Timestamp || item.timestamp || item['FECHA Y HORA'] || item.fecha || '';
    let fecha = new Date(fechaTexto);
    if (Number.isNaN(fecha.getTime())) {
        const partesFecha = String(fechaTexto).match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
        if (partesFecha) {
            fecha = new Date(
                Number(partesFecha[3]),
                Number(partesFecha[2]) - 1,
                Number(partesFecha[1]),
                Number(partesFecha[4] || 0),
                Number(partesFecha[5] || 0),
                Number(partesFecha[6] || 0)
            );
        }
    }
    if (Number.isNaN(fecha.getTime())) {
        throw new Error(`Fecha de visita inválida recibida desde Google: ${fechaTexto}`);
    }
    const modo = item.Modo || item.MODO || item['TIPO DE VISITA'] || item['Modo Evento'] || '';
    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        fecha: fecha.toISOString(),
        fechaTexto: fecha.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }),
        datosPersonales: item['Datos Personales'] || item['DATOS PERSONALES'] || item.datosPersonales || '',
        empresa: item.Empresa || item.EMPRESA || item['EMPRESA O FARMACIA'] || item.empresa || '',
        codigoFarmacia: item['Código de Farmacia'] || item['CODIGO DE FARMACIA'] || item.codigoFarmacia || '',
        sector: item.Sector || item.SECTOR || item['SECTOR A VISITAR'] || item.sector || '',
        anfitrion: item['Anfitrión'] || item.ANFITRION || item.anfitrion || '',
        observaciones: item.Observaciones || item.OBSERVACIONES || item.observaciones || 'SIN OBSERVACIONES',
        modo,
        modoEvento: ['SI', 'TRUE'].includes(String(item['Modo Evento'] || item.modoEvento || '').toUpperCase())
            || String(modo).toUpperCase().includes('EVENTO'),
        modoMercadoLibre: String(item.modoMercadoLibre || modo).toLowerCase().includes('mercado'),
        bultos: item.Bultos || item.BULTOS || item.bultos || ''
    };
}

async function cargarVisitasDesdeGoogle() {
    try {
        if (!GOOGLE_SHEETS_URL || GOOGLE_SHEETS_URL.includes('YOUR_DEPLOYMENT_ID')) {
            return [];
        }
        const response = await axios.get(GOOGLE_SHEETS_URL, {
            params: { hoja: 'MOVIMIENTOS' },
            timeout: 8000
        });
        const data = response.data;
        const lista = Array.isArray(data) ? data : [];
        return lista.map(normalizarVisitaDesdeGoogle).filter((visita) => visita.datosPersonales || visita.empresa || visita.sector);
    } catch (error) {
        console.warn('No se pudieron leer las visitas desde Google Apps Script.', error.message);
        return [];
    }
}

// Middlewares
app.use(express.json());
const allowedOrigins = (process.env.CORS_ORIGIN
    || 'https://porteriacooperativa2017-afk.github.io,http://localhost:3000,http://localhost:3218,http://localhost:3219')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    if (req.method === 'OPTIONS') {
        return origin && !allowedOrigins.includes(origin)
            ? res.status(403).end()
            : res.status(204).end();
    }
    next();
});
app.use(express.static(path.join(__dirname)));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'visitas-qru-api' });
});

// --- RUTA PRINCIPAL DE REGISTRO ---
app.post('/api/registro', async (req, res) => {
    const datos = req.body;

    try {
        if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
            return res.status(400).json({ success: false, message: 'Los datos del registro no son válidos.' });
        }

        const payload = {
            datosPersonales: datos.datosPersonales || '',
            empresa: datos.empresa || '',
            codigoFarmacia: datos.codigoFarmacia || '',
            sector: datos.sector || '',
            anfitrion: datos.anfitrion || '',
            observaciones: datos.observaciones || 'SIN OBSERVACIONES',
            modoEvento: Boolean(datos.modoEvento),
            modoMercadoLibre: Boolean(datos.modoMercadoLibre),
            modo: datos.modoMercadoLibre ? 'Modo Mercado Libre' : (datos.modoEvento ? 'Modo Evento' : 'Modo Normal'),
            bultos: datos.modoMercadoLibre ? datos.bultos || '1' : '-'
        };

        const respuestaGoogle = await axios.post(GOOGLE_SHEETS_URL, JSON.stringify(payload), {
            headers: { 'Content-Type': 'application/json' },
            maxRedirects: 5,
            timeout: 15000
        });
        let resultadoGoogle = respuestaGoogle.data;
        if (typeof resultadoGoogle === 'string') {
            try {
                resultadoGoogle = JSON.parse(resultadoGoogle);
            } catch (error) {
                throw new Error('Google Apps Script devolvió una respuesta que no es JSON válido.');
            }
        }
        if (!respuestaGoogle.status || respuestaGoogle.status < 200 || respuestaGoogle.status >= 300) {
            throw new Error(`Google Apps Script respondió con estado HTTP ${respuestaGoogle.status}.`);
        }
        if (!resultadoGoogle || resultadoGoogle.success === false || resultadoGoogle.status === 'error') {
            throw new Error(resultadoGoogle && resultadoGoogle.message
                ? resultadoGoogle.message
                : 'Google Apps Script no confirmó el registro.');
        }
        console.log('Registro enviado al endpoint de Google Sheets.');

        const visita = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            fecha: new Date().toISOString(),
            fechaTexto: new Date().toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }),
            datosPersonales: payload.datosPersonales,
            empresa: payload.empresa,
            codigoFarmacia: payload.codigoFarmacia,
            sector: payload.sector,
            anfitrion: payload.anfitrion,
            observaciones: payload.observaciones,
            modoEvento: payload.modoEvento,
            modoMercadoLibre: payload.modoMercadoLibre,
            modo: payload.modo,
            bultos: payload.bultos
        };

        visitasCache.unshift(visita);
        guardarVisitasEnDisco();

        res.status(200).json({ success: true, message: "OK", visita });

    } catch (error) {
        const detalle = error.response && error.response.data
            ? (typeof error.response.data === 'string'
                ? error.response.data.slice(0, 500)
                : error.response.data.message || JSON.stringify(error.response.data))
            : error.message;
        console.error('No se pudo guardar el registro en Google Sheets:', detalle);
        res.status(502).json({
            success: false,
            message: `No se pudo guardar en la hoja de cálculo: ${detalle || 'Error de conexión con Google Apps Script.'}`
        });
    }
});

app.get('/api/visitas', async (req, res) => {
    try {
        const visitasDesdeGoogle = await cargarVisitasDesdeGoogle();
        if (visitasDesdeGoogle.length) {
            visitasCache = visitasDesdeGoogle;
            guardarVisitasEnDisco();
        }
    } catch (error) {
        console.warn('No se pudo sincronizar desde Google.', error.message);
    }
    res.json(visitasCache);
});

app.get('/api/visitantes', async (req, res) => {
    const dni = String(req.query.dni || '').replace(/\D/g, '').slice(0, 9);
    if (dni.length < 3) {
        return res.status(400).json({ success: false, message: 'Ingrese al menos 3 dígitos del DNI.' });
    }

    try {
        const response = await axios.get(GOOGLE_SHEETS_URL, {
            params: { tipo: 'visitantes_dni', dni },
            timeout: 8000
        });
        if (!Array.isArray(response.data)) {
            throw new Error(response.data && response.data.message
                ? response.data.message
                : 'Respuesta inválida al buscar visitantes en la hoja MOVIMIENTOS.');
        }
        res.json(response.data);
    } catch (error) {
        console.error('No se pudieron buscar visitantes por DNI en MOVIMIENTOS.', error.message);
        res.status(502).json({
            success: false,
            message: 'No se pudo consultar la columna DATOS PERSONALES de la hoja MOVIMIENTOS.'
        });
    }
});

function normalizarEncabezadoAnfitrion(encabezado) {
    return String(encabezado || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLocaleLowerCase('es')
        .replace(/[^a-z0-9]/g, '');
}

function parsearCsv(texto) {
    const filas = [];
    let fila = [];
    let campo = '';
    let entreComillas = false;

    for (let i = 0; i < texto.length; i += 1) {
        const caracter = texto[i];
        if (caracter === '"') {
            if (entreComillas && texto[i + 1] === '"') {
                campo += '"';
                i += 1;
            } else {
                entreComillas = !entreComillas;
            }
        } else if (caracter === ',' && !entreComillas) {
            fila.push(campo);
            campo = '';
        } else if ((caracter === '\n' || caracter === '\r') && !entreComillas) {
            if (caracter === '\r' && texto[i + 1] === '\n') i += 1;
            fila.push(campo);
            if (fila.some((valor) => valor.trim())) filas.push(fila);
            fila = [];
            campo = '';
        } else {
            campo += caracter;
        }
    }

    if (entreComillas) throw new Error('El CSV de la pestaña ANFITRIONES tiene comillas sin cerrar.');
    if (campo || fila.length) {
        fila.push(campo);
        if (fila.some((valor) => valor.trim())) filas.push(fila);
    }
    return filas;
}

app.get('/api/anfitriones', async (req, res) => {
    try {
        const response = await axios.get(
            `https://docs.google.com/spreadsheets/d/${ANFITRIONES_SHEET_ID}/export`,
            {
                params: { format: 'csv', gid: ANFITRIONES_SHEET_GID },
                responseType: 'text',
                transformResponse: [(data) => data],
                headers: { Accept: 'text/csv' },
            timeout: 20000
            }
        );
        const filas = parsearCsv(String(response.data || '').replace(/^\uFEFF/, ''));
        if (!filas.length) return res.json([]);

        const encabezados = filas[0];
        const columnaNombre = encabezados.findIndex((header) => {
            const clave = normalizarEncabezadoAnfitrion(header);
            return clave === 'nombredelanfitrion' || clave === 'nombredelanfitriona' || clave === 'anfitrion';
        });
        const columnaCelular = encabezados.findIndex((header) => {
            const clave = normalizarEncabezadoAnfitrion(header);
            return clave === 'numerodecelular' || clave === 'numerocelular' || clave === 'celular';
        });
        const columnaInterno = encabezados.findIndex((header) => normalizarEncabezadoAnfitrion(header).includes('interno'));
        if (columnaNombre === -1 || columnaCelular === -1) {
            throw new Error('La pestaña ANFITRIONES debe tener columnas Nombre del anfitrión y Número de celular.');
        }

        const contactos = filas.slice(1)
            .map((fila) => ({
                nombre: String(fila[columnaNombre] || '').trim(),
                telefono: String(fila[columnaCelular] || '').replace(/\D/g, ''),
                interno: columnaInterno === -1 ? '' : String(fila[columnaInterno] || '').trim()
            }))
            .filter((contacto) => contacto.nombre && contacto.telefono.length >= 8);

        res.json(contactos);
    } catch (error) {
        console.error('No se pudieron leer los contactos de la pestaña ANFITRIONES.', error.message);
        res.status(502).json({
            success: false,
            message: error.message || 'No se pudieron leer los contactos de la pestaña ANFITRIONES.'
        });
    }
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
});
