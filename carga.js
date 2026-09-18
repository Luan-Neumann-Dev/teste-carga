// Teste de carga da API de produtos.
//
//   k6 run -e VUS=5   carga.js  -> uso tranquilo, passa folgado
//   k6 run -e VUS=50  carga.js  -> no limite: passa, mas 10x mais lento
//   k6 run -e VUS=100 carga.js  -> acima do limite: reprova

import http from 'k6/http';
import { check, sleep } from 'k6';

// Numero de usuarios virtuais simultaneos. Vem da linha de comando.
const VUS = Number(__ENV.VUS || 50);

export const options = {
  // A rampa: sobe ate VUS, sustenta, depois desce.
  stages: [
    { duration: '10s', target: VUS }, // sobe de 0 ate VUS usuarios
    { duration: '20s', target: VUS }, // mantem a carga
    { duration: '5s', target: 0 },    // desce ate 0
  ],

  // O criterio de aprovacao, definido ANTES de rodar o teste.
  // Se qualquer um falhar, o k6 encerra com erro (exit code 99).
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% das respostas abaixo de 500ms
    http_req_failed: ['rate<0.01'],   // menos de 1% de erro
  },
};

export default function () {
  const res = http.get('http://localhost:3000/produtos');

  check(res, {
    'status 200': (r) => r.status === 200,
  });

  // Pausa entre as acoes. Usuario real le a tela, pensa e so entao clica.
  // Sem isso o teste vira uma metralhadora, que nao simula uso real.
  sleep(1);
}
