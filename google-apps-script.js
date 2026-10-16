const ID_SPREADSHEET = '1jSwHR5eaN7NP29-4JJSNTC2owf_ufrcB47jLMzUsNLk';

function obtenerHojaSegura(nombrePestana) {
  try {
    const ss = SpreadsheetApp.openById(ID_SPREADSHEET);
    const sheet = ss.getSheetByName(nombrePestana);
    if (!sheet) throw new Error('No existe la pestaña: ' + nombrePestana);
    return sheet;
  } catch (err) {
    throw new Error('Error al conectar con la hoja: ' + err.message);
  }
}

function responderJson(datos) {
  return ContentService
    .createTextOutput(JSON.stringify(datos))
    .setMimeType(ContentService.MimeType.JSON);
}

function obtenerFilasComoObjetos(nombreSolicitado) {
  const equivalencias = {
    'REGISTRO': 'MOVIMIENTOS',
    'MOVIMIENTOS': 'MOVIMIENTOS',
    'CRONOGRAMAS': 'CRONOGRAMAS',
    'VENCIMIENTO DE CREDENCIALES': 'VENCIMIENTO DE CREDENCIALES',
    'INTERNOS': 'INTERNOS',
    'VISITA DE TAREAS TÉCNICAS': 'VISITA DE TAREAS TÉCNICAS'
  };

  const clave = (nombreSolicitado || '').toString().trim().toUpperCase();
  const nombrePestana = equivalencias[clave];
  if (!nombrePestana) {
    throw new Error('Pestaña no autorizada: ' + nombreSolicitado);
  }

  const sheet = obtenerHojaSegura(nombrePestana);
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length <= 1) return [];

  const headers = values[0].map(header => header.toString().trim());
  return values.slice(1).map(row => {
    const objeto = {};
    headers.forEach((header, index) => {
      let valor = row[index] || '';
      if (typeof valor === 'string') {
        valor = valor.replace(/[\u0000-\u001F\u007F-\u009F]/g, '').trim();
      }
      objeto[header] = valor;
    });
    return objeto;
  });
}

function buscarVisitantesPorDni(dniBuscado) {
  const dni = (dniBuscado || '').toString().replace(/\D/g, '');
  if (dni.length < 3) return [];

  const sheet = obtenerHojaSegura('MOVIMIENTOS');
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length <= 1) return [];

  const headers = values[0].map(header => header.toString().trim().toUpperCase());
  const columnaDatosPersonales = headers.indexOf('DATOS PERSONALES');
  if (columnaDatosPersonales === -1) {
    throw new Error('No se encontró la columna DATOS PERSONALES en la pestaña MOVIMIENTOS.');
  }

  const visitantesPorDni = new Map();
  values.slice(1).forEach(row => {
    const datosPersonales = (row[columnaDatosPersonales] || '').toString().trim();
    const coincidencia = datosPersonales.match(/\bDNI\s*[:#-]?\s*([\d.-]{6,14})/i);
    if (!coincidencia) return;

    const dniVisitante = coincidencia[1].replace(/\D/g, '');
    if (dniVisitante.length < 6 || dniVisitante.length > 9 || !dniVisitante.includes(dni)) return;
    visitantesPorDni.set(dniVisitante, {
      dni: dniVisitante,
      datosPersonales
    });
  });

  return Array.from(visitantesPorDni.values());
}

function doGet(e) {
  try {
    const parametros = e && e.parameter ? e.parameter : {};

    if ((!parametros.hoja && !parametros.tipo) || parametros.vista === 'dashboard') {
      return HtmlService.createHtmlOutputFromFile('Dashboard')
        .setTitle('Control de Visitas - COFARMEN')
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }

    if (parametros.hoja) {
      return responderJson(obtenerFilasComoObjetos(parametros.hoja));
    }

    if (parametros.tipo === 'ultimos_registros') {
      const registros = obtenerFilasComoObjetos('MOVIMIENTOS');
      return responderJson(registros.slice(-15).reverse());
    }

    if (parametros.tipo === 'sectores') {
      return responderJson(Object.keys(obtenerDirectorioCompleto()));
    }

    if (parametros.tipo === 'anfitriones') {
      const sector = parametros.sector || '';
      const directorio = obtenerDirectorioCompleto();
      return responderJson(directorio[sector] || []);
    }

    if (parametros.tipo === 'visitantes_dni') {
      return responderJson(buscarVisitantesPorDni(parametros.dni || ''));
    }

    return responderJson(obtenerFilasComoObjetos('MOVIMIENTOS'));
  } catch (error) {
    return responderJson({
      status: 'error',
      message: error.toString()
    });
  }
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  let lockAcquired = false;

  try {
    lock.waitLock(30000);
    lockAcquired = true;

    const sheetMov = obtenerHojaSegura('MOVIMIENTOS');
    let datos;

    try {
      datos = JSON.parse(e && e.postData && e.postData.contents || '{}');
    } catch (errorJson) {
      const datosJson = e && e.parameter && e.parameter.datosJson;
      if (!datosJson) throw errorJson;
      datos = JSON.parse(datosJson);
    }

    const fechaHora = Utilities.formatDate(
      new Date(),
      Session.getScriptTimeZone(),
      'dd/MM/yyyy HH:mm:ss'
    );
    const datosPersonales = (datos.datosPersonales || datos.nombre || '').toString().trim().toUpperCase();
    const empresa = (datos.empresa || '').toString().trim().toUpperCase();
    const sector = (datos.sector || '').toString().trim().toUpperCase();
    const anfitrion = (datos.anfitrion || '').toString().trim().toUpperCase();
    const observaciones = (datos.observaciones || '').toString().trim().toUpperCase();
    const modoMercadoLibre = datos.modoMercadoLibre === true
      || String(datos.modoMercadoLibre).toLowerCase() === 'true'
      || String(datos.modo || '').toLowerCase().includes('mercado');
    const modoEvento = datos.modoEvento === true
      || String(datos.modoEvento).toLowerCase() === 'true';
    const modoTrabajo = modoMercadoLibre
      ? 'Modo Mercado Libre'
      : (datos.modo || (modoEvento ? 'Modo Evento' : 'Modo Normal'));
    const bultos = modoMercadoLibre
      ? (datos.bultos || '1').toString().trim()
      : '-';
    const codigoFarmacia = (datos.codigoFarmacia || '').toString().trim();

    if (sector === 'MOSTRADOR' && !codigoFarmacia) {
      throw new Error('El código de farmacia es obligatorio para ingresos por Mostrador.');
    }

    const siguienteFila = sheetMov.getLastRow() + 1;

    sheetMov.getRange(siguienteFila, 1, 1, 9).setValues([[
      fechaHora,
      datosPersonales,
      empresa,
      sector,
      anfitrion,
      observaciones,
      modoTrabajo,
      bultos,
      codigoFarmacia
    ]]);

    return responderJson({
      status: 'success',
      message: 'Registrado con éxito'
    });
  } catch (error) {
    console.error('Error interno: ' + error.toString());
    return responderJson({
      status: 'error',
      message: error.toString()
    });
  } finally {
    if (lockAcquired) lock.releaseLock();
  }
}

function construirMensajeWhatsApp(datosPersonales, empresa, sector, anfitrion, observaciones, modo, bultos) {
  if (modo.toString().toLowerCase().includes('mercado')) {
    return '📦 *Estimado/a:*\n\n' +
      '🔔 Tiene un envío de la empresa *' + (empresa || 'MERCADO LIBRE') + '* para ser retirado en la guardia.\n\n' +
      '📦 *Cantidad de bultos:* ' + (bultos || '1') + '\n' +
      '📍 *Lugar de retiro:* Guardia\n\n' +
      '_Atentamente,_\n_*Control de Accesos COFARMEN*_';
  }

  return '👋 *Estimado/a ' + anfitrion + ':*\n\n' +
    '🔔 Se anunció una nueva visita para usted.\n\n' +
    '👤 *Visitante:* ' + datosPersonales + '\n' +
    '🏢 *Empresa:* ' + (empresa || 'VISITA') + '\n' +
    '📍 *Sector:* ' + sector + '\n\n' +
    '🛂 La persona aguarda su autorización para ingresar.\n' +
    '📝 *Observaciones:* ' + (observaciones || 'SIN OBSERVACIONES') + '\n\n' +
    '_Atentamente,_\n_*Control de Accesos COFARMEN*_';
}

function obtenerDirectorioCompleto() {
  return {
    'Mostrador': [{ nombre: 'Retiro de vales' }],
    'PLANTA LOGISTICA': [
      { nombre: 'Mugneco Adrian' },
      { nombre: 'Carbajo Rodrigo' },
      { nombre: 'Di Lorenzo Diego' }
    ],
    'CAPITAL HUMANO': [
      { nombre: 'Fernández Rubén' },
      { nombre: 'Pablo Iacobucci' },
      { nombre: 'Tissera Mariana' }
    ],
    'ADMINISTRACION': [
      { nombre: 'Martin Marcelo' },
      { nombre: 'Bustos Marcos' },
      { nombre: 'Videla Javier' },
      { nombre: 'Agüero Antonio' },
      { nombre: 'Velez Daniel' }
    ],
    'GERENCIA': [
      { nombre: 'Funes Cristian' },
      { nombre: 'Pablo Iacobucci' },
      { nombre: 'Ganem Victoria' },
      { nombre: 'Martin Marcelo' }
    ],
    'CONSEJO': [{ nombre: 'Ganem Victoria' }],
    'FUNSAD': [{ nombre: 'Ganem Victoria' }],
    'LOBBY': [
      { nombre: 'Sanchez Alejandro' },
      { nombre: 'Ganem Victoria' },
      { nombre: 'Escudero Carina' }
    ],
    'OPERADOR LOGISTICO NAVE 2': [
      { nombre: 'Constantino Adriana' },
      { nombre: 'Valdez Liliana' }
    ],
    'COMERCIAL': [
      { nombre: 'Molina Andres' },
      { nombre: 'Tescari Maria Jose' },
      { nombre: 'Reina Julia' },
      { nombre: 'Sepulveda Marcela' },
      { nombre: 'Sanabria Juan' },
      { nombre: 'Perez Agustin' }
    ],
    'CAJAS': [
      { nombre: 'Arce José' },
      { nombre: 'Ponce Matias' }
    ],
    'ADMINISTRACIÓN OSEP': [
      { nombre: 'Pelayes Sergio' },
      { nombre: 'Oropel Walter' },
      { nombre: 'Garay Diego' },
      { nombre: 'Fernandez Jose Luis' },
      { nombre: 'Dominguez Diego' },
      { nombre: 'Peroso Vanesa' }
    ],
    'RECEPCIÓN NAVE 1': [{ nombre: 'operario del sector' }],
    'RECEPCIÓN NAVE 2': [{ nombre: 'operario del sector' }],
    'CRÉDITOS': [
      { nombre: 'Rovatti Dario' },
      { nombre: 'Agüero Rocio' },
      { nombre: 'Andreoni Anabela' }
    ],
    'SISTEMAS': [
      { nombre: 'Lujan Omar' },
      { nombre: 'Puebla Adrian' },
      { nombre: 'Placci Martin' }
    ],
    'DEVOLUCIÓN A PROVEEDOR Y/O DONACIONES': [
      { nombre: 'Alvarez Cecilia' }
    ],
    'DIRECCIÓN TÉCNICA': [
      { nombre: 'Daniel Ríos' },
      { nombre: 'Cecilia Nadal' },
      { nombre: 'Carina Escudero' },
      { nombre: 'Natalia Bustos' },
      { nombre: 'Jennifer Agüero' }
    ],
    'MANTENIMIENTO': [
      { nombre: 'Marsollier Ivan' },
      { nombre: 'Brizuela Tomas' }
    ],
    'GUARDIA': [{ nombre: 'Puesto 1' }],
    'EVENTO': [{ nombre: 'EVENTO' }]
  };
}

function obtenerTelefonoAnfitrion(nombreBuscado) {
  throw new Error('La búsqueda del contacto se realiza manualmente desde la aplicación.');
}

function enviarMensajeServidor(telefono, mensaje) {
  throw new Error('El envío automático está deshabilitado; revise y envíe el mensaje desde WhatsApp.');
}

function enviarReporteFiltradoPorCorreo(correoGerencia, textoBusqueda, sectorFiltro, modoFiltro, fechaInicio, fechaFin) {
  const sheet = obtenerHojaSegura('MOVIMIENTOS');
  const values = sheet.getDataRange().getDisplayValues();
  if (values.length <= 1) return 'No hay datos para enviar.';

  const headers = values[0].map(header => header.toString().trim());
  const filas = values.slice(1).map(row => {
    const objeto = {};
    headers.forEach((header, index) => {
      objeto[header] = (row[index] || '').toString().trim();
    });
    return objeto;
  });

  const filtrados = filas.filter(row => {
    const textoCoincide = !textoBusqueda || Object.values(row).some(val =>
      val.toLowerCase().includes(textoBusqueda.toLowerCase())
    );
    const sectorValor = row['SECTOR A VISITAR'] || row['Sector a Visitar'] || row.Sector || '';
    const sectorCoincide = !sectorFiltro || sectorFiltro.includes('Todos') || sectorValor === sectorFiltro;
    const modoStr = (row['TIPO DE VISITA'] || row.MODO || row.Modo || row['Modo Evento'] || '').toString();
    const modoCoincide = !modoFiltro || modoFiltro.includes('Todos') || modoStr.toLowerCase().includes(modoFiltro.toLowerCase());

    let fechaCoincide = true;
    if (fechaInicio && fechaFin) {
      const fechaFilaStr = row['FECHA Y HORA'] || row.Timestamp || '';
      if (fechaFilaStr) {
        const partesFecha = fechaFilaStr.split(' ')[0].split('/');
        if (partesFecha.length === 3) {
          const fechaFila = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
          const fInicio = new Date(fechaInicio + 'T00:00:00');
          const fFin = new Date(fechaFin + 'T23:59:59');
          fechaCoincide = fechaFila >= fInicio && fechaFila <= fFin;
        } else {
          fechaCoincide = false;
        }
      } else {
        fechaCoincide = false;
      }
    }

    return textoCoincide && sectorCoincide && modoCoincide && fechaCoincide;
  });

  if (filtrados.length === 0) {
    throw new Error('No se encontraron registros con los filtros y fechas seleccionadas.');
  }

  const filasHtml = filtrados.map(row => `
    <tr>
      <td>${row['FECHA Y HORA'] || row.Timestamp || ''}</td>
      <td>${row['DATOS PERSONALES'] || row['Datos Personales'] || ''}</td>
      <td>${row['EMPRESA O FARMACIA'] || row.Empresa || ''}</td>
      <td>${row['SECTOR A VISITAR'] || row['Sector a Visitar'] || row.Sector || ''}</td>
      <td>${row.ANFITRION || row['Anfitrión'] || ''}</td>
      <td>${row.OBSERVACIONES || row.Observaciones || ''}</td>
      <td>${row['TIPO DE VISITA'] || row.MODO || row.Modo || 'Normal'}</td>
    </tr>`).join('');

  const cuerpoHtml = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 900px; margin: 0 auto;">
      <div style="background-color: #212529; color: #ffffff; padding: 20px; text-align: center;">
        <h2>🛡️ Reporte de Control de Visitas - COFARMEN</h2>
        <p>Informe generado con filtros</p>
      </div>
      <div style="padding: 20px; background-color: #f8f9fa;">
        <ul>
          <li><strong>Rango de Fechas:</strong> ${fechaInicio ? fechaInicio + ' al ' + fechaFin : 'Todas'}</li>
          <li><strong>Búsqueda:</strong> ${textoBusqueda || 'Ninguna'}</li>
          <li><strong>Total de registros:</strong> ${filtrados.length}</li>
        </ul>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead><tr>
            <th>Fecha</th><th>Visitante</th><th>Empresa</th><th>Sector</th>
            <th>Anfitrión</th><th>Observaciones</th><th>Modo</th>
          </tr></thead>
          <tbody>${filasHtml}</tbody>
        </table>
      </div>
    </div>`;

  MailApp.sendEmail({
    to: correoGerencia,
    subject: 'Reporte de Visitas Filtrado - COFARMEN',
    htmlBody: cuerpoHtml
  });

  return '¡Listo! Reporte con ' + filtrados.length + ' registros enviado a ' + correoGerencia;
}

function obtenerEventosDelDia() {
  try {
    const idPlanillaEventos = '1RhUPdzsQgrKSeqtsoPQf1RA5it0NqlPfvT7lIwpQE7c';
    const ssEventos = SpreadsheetApp.openById(idPlanillaEventos);
    const hoja = ssEventos.getSheetByName('Respuestas')
      || ssEventos.getSheetByName('FORMULARIO INFORME DE EVENTO')
      || ssEventos.getSheets()[0];
    if (!hoja) return [];

    const valores = hoja.getDataRange().getDisplayValues();
    const hoy = new Date();
    const eventosDelDia = [];

    for (let i = 1; i < valores.length; i++) {
      const fila = valores[i];
      const fechaStr = fila[8] ? fila[8].trim() : '';
      if (!fechaStr) continue;

      let dia;
      let mes;
      let anio;
      if (fechaStr.includes('/')) {
        const partes = fechaStr.split(' ')[0].split('/');
        if (partes.length === 3) {
          dia = parseInt(partes[0], 10);
          mes = parseInt(partes[1], 10);
          anio = parseInt(partes[2], 10);
        }
      } else if (fechaStr.includes('-')) {
        const partes = fechaStr.split('T')[0].split('-');
        if (partes.length === 3) {
          anio = parseInt(partes[0], 10);
          mes = parseInt(partes[1], 10);
          dia = parseInt(partes[2], 10);
        }
      }

      if (dia === hoy.getDate() && mes === hoy.getMonth() + 1 && anio === hoy.getFullYear()) {
        eventosDelDia.push({
          nombre: fila[2] || fila[6] || 'Evento del día',
          horaInicio: fila[9] ? fila[9].trim() : '',
          horaFin: fila[10] ? fila[10].trim() : ''
        });
      }
    }

    return eventosDelDia;
  } catch (error) {
    console.error('Error al consultar eventos: ' + error.toString());
    return [];
  }
}

function getSheet() {
  return obtenerHojaSegura('MOVIMIENTOS');
}

function buildJsonOutput(payload) {
  return responderJson(payload);
}

function normalizeRow(obj) {
  return {
    Timestamp: obj.Timestamp || obj.timestamp || obj['FECHA Y HORA'] || '',
    'Datos Personales': obj['Datos Personales'] || obj['DATOS PERSONALES'] || obj.datosPersonales || '',
    Empresa: obj.Empresa || obj.EMPRESA || obj['EMPRESA O FARMACIA'] || obj.empresa || '',
    'Código de Farmacia': obj['Código de Farmacia'] || obj['CODIGO DE FARMACIA'] || obj.codigoFarmacia || '',
    Sector: obj.Sector || obj.SECTOR || obj['SECTOR A VISITAR'] || obj.sector || '',
    'Anfitrión': obj['Anfitrión'] || obj.ANFITRION || obj.anfitrion || '',
    Observaciones: obj.Observaciones || obj.OBSERVACIONES || obj.observaciones || '',
    Modo: obj.Modo || obj.MODO || obj['TIPO DE VISITA'] || obj['Modo Evento'] || '',
    Bultos: obj.Bultos || obj.BULTOS || obj.bultos || '',
    modoEvento: ['SI', 'TRUE'].includes(String(obj['Modo Evento'] || obj.modoEvento || '').toUpperCase())
      || String(obj.Modo || obj.MODO || obj['TIPO DE VISITA'] || '').toUpperCase().includes('EVENTO')
  };
}

function doOptions(e) {
  return responderJson({ status: 'success' });
}
