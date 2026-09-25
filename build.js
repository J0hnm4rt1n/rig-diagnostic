const fs = require('fs');
const path = __dirname;

const shell = fs.readFileSync(path + '/artifact.html', 'utf8');
const parts = ['app_engine.js', 'app_specs.js', 'app_rules.js', 'app_gaming.js', 'app_memory.js', 'app_compare.js', 'app_charts.js'].map(f => fs.readFileSync(path + '/' + f, 'utf8'));
const mainJs = fs.readFileSync(path + '/app_main.js', 'utf8');

const script = `<script>
${parts.join('\n\n')}

${mainJs}
</script>`;

const full = shell + '\n' + script + '\n';
fs.writeFileSync(path + '/index.html', full, 'utf8');
console.log('wrote index.html,', Buffer.byteLength(full), 'bytes');
