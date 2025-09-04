const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/compras',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (compatible; Test/1.0)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('\n=== RESPONSE BODY ===');
    
    // Buscar elementos específicos
    const searches = [
      'Compras de Inventario',
      'Nueva Compra', 
      'Historial',
      'Proveedores',
      'Problema Resuelto',
      'Estado del Sistema',
      'Cargando'
    ];
    
    console.log('\n=== FOUND ELEMENTS ===');
    searches.forEach(search => {
      if (data.includes(search)) {
        console.log(`✅ Found: ${search}`);
      } else {
        console.log(`❌ Missing: ${search}`);
      }
    });
    
    // Mostrar una muestra del HTML
    console.log('\n=== HTML SAMPLE ===');
    const lines = data.split('\n');
    lines.slice(0, 20).forEach((line, i) => {
      console.log(`${i+1}: ${line.trim()}`);
    });
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
