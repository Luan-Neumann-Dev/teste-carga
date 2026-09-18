// API de exemplo para a demonstracao de teste de carga.
// Node.js puro, sem nenhuma dependencia. Rodar com: node servidor.js

const http = require('node:http');

// Custo artificial de cada requisicao, em milissegundos.
// Simula o trabalho que uma API real faz: consultar o banco, processar,
// montar o JSON. Sem esse custo a API responderia instantaneamente e o
// teste de carga nao teria nada para mostrar.
const CUSTO_MS = 25;

const PORTA = 3000;

const produtos = [
  { id: 1, nome: 'Teclado', preco: 199.9 },
  { id: 2, nome: 'Monitor', preco: 899.0 },
  { id: 3, nome: 'Mouse', preco: 89.9 },
];

// Ocupa o processador por CUSTO_MS. Como o Node atende as requisicoes em
// uma unica thread, quando chegam mais pedidos do que ele consegue
// processar, os pedidos formam fila -- e e exatamente essa fila que faz o
// tempo de resposta subir no teste com 50 usuarios.
function trabalhar(ms) {
  const fim = Date.now() + ms;
  while (Date.now() < fim) {
    // ocupado de proposito
  }
}

const servidor = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/produtos') {
    trabalhar(CUSTO_MS);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(produtos));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ erro: 'nao encontrado' }));
});

servidor.listen(PORTA, () => {
  console.log(`API no ar em http://localhost:${PORTA}/produtos`);
  console.log(`Custo por requisicao: ${CUSTO_MS}ms`);
});
