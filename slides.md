# Teste de Carga — roteiro dos slides

> Disciplina de Verificação e Validação de Software — Prof. MSc. Junior Marcos Bandeira
> Grupo 4: Luan e Eduardo — Apresentação em 18/09 (20 a 25 min)
>
> Cada seção abaixo é um slide. O que está em **bullets** vai para o slide.
> O que está em *Fala:* é só roteiro para vocês, não entra no PowerPoint.

---

## Slide 1 — Capa

**Teste de Carga**
Verificação e Validação de Software — Testes não funcionais

Luan e Eduardo
Prof. MSc. Junior Marcos Bandeira — 2025.6 · 1º Bimestre

*Fala (Luan): "Boa noite. Nosso tema é teste de carga. A ideia é bem direta: descobrir se um sistema aguenta a quantidade de gente que a gente espera que use ele. E no final a gente vai rodar um teste de verdade aqui, ao vivo."*

---

## Slide 2 — Agenda

- O que é teste de carga
- Objetivos e características
- As métricas que importam
- Carga × Estresse × Desempenho
- Quando aplicar e por quê
- **Demonstração prática com k6**
- Conclusão e referências

*Fala (Luan): Passar rápido, uns 20 segundos. Só para a turma saber que tem demo no final e prestar atenção.*

---

## Slide 3 — O que é teste de carga

**Teste de carga é colocar o sistema para funcionar sob a quantidade de uso que a gente espera na vida real — e medir como ele se comporta.**

- Não estamos procurando erro de lógica no código
- Estamos perguntando: **"e quando forem 500 pessoas ao mesmo tempo?"**
- É um **teste não funcional**: não avalia *o que* o sistema faz, e sim *como* ele faz — rápido, estável, sem quebrar

> Analogia: testar uma ponte não é só ver se dá para atravessar a pé.
> É colocar em cima dela o peso de trânsito que ela vai receber todo dia e medir se ela entorta.

*Fala (Luan): O ponto principal é a diferença entre teste funcional e não funcional. Um teste funcional pergunta "o botão de login funciona?". O teste de carga pergunta "o botão de login continua funcionando quando 500 pessoas clicam nele no mesmo minuto?". O sistema pode estar 100% correto e ainda assim ser inutilizável.*

---

## Slide 4 — Objetivos

**O que a gente quer descobrir:**

- O sistema **aguenta** a carga esperada?
- Ele continua **rápido** o suficiente sob essa carga?
- Quantos usuários simultâneos ele suporta **antes de degradar**?
- O sistema se mantém **estável ao longo do tempo** ou vai piorando?
- Onde está o **gargalo**: banco de dados, servidor, rede, código?

**Objetivo final: descobrir o problema antes do usuário descobrir.**

*Fala (Luan): Reforçar a última linha. O custo de achar isso em teste é uma tarde de trabalho. O custo de achar em produção, num dia de pico, é o sistema fora do ar na hora que ele mais importa.*

---

## Slide 5 — Características principais

- **Carga esperada, não exagerada** — a gente simula o uso realista previsto
- **Gradual** — sobe o número de usuários aos poucos (rampa) para ver onde começa a piorar
- **Tem duração** — não é um pico de 2 segundos, é sustentar a carga por um período
- **Automatizado** — impossível fazer manualmente com centenas de usuários
- **Baseado em métricas** — o resultado é número, não opinião
- **Precisa de um critério de aprovação** — definido *antes* de rodar o teste

*Fala (Eduardo): O último item é o mais importante para nossa disciplina. Sem um critério definido antes, o teste vira só "achei o número bonitinho". Com critério, ele vira validação de verdade: passou ou não passou. A gente vai mostrar isso na prática com os thresholds do k6.*

---

## Slide 6 — As métricas que importam

| Métrica | O que é | Em português claro |
|---|---|---|
| **VUs** (Virtual Users) | Usuários virtuais simultâneos | Quantas "pessoas" o teste está simulando |
| **Throughput** | Requisições por segundo | Quanto o sistema consegue atender |
| **Tempo de resposta** | Duração de cada requisição | Quanto o usuário espera na tela |
| **Taxa de erro** | % de requisições que falharam | Quantas pessoas tomaram erro |

*Fala (Eduardo): Explicar VU com calma — é o conceito que mais confunde. Um VU é um usuário simulado que fica repetindo a ação em loop. 50 VUs não é "50 requisições", é "50 pessoas usando o sistema ao mesmo tempo, sem parar". Depois emendar: dessas quatro, a de tempo de resposta é a mais traiçoeira. Próximo slide.*

---

## Slide 7 — O problema da média

**Nunca olhe só a média do tempo de resposta.**

10 requisições, em milissegundos:

`120 · 130 · 140 · 150 · 160 · 170 · 180 · 190 · 200 · 900`

- **Média = 234 ms** — parece ótimo
- Mas **9 das 10** requisições foram mais rápidas que a média
- E teve **um usuário esperando quase 1 segundo**

> A média esconde os piores casos. E é justamente o pior caso que faz o usuário desistir.

*Fala (Eduardo): Deixar a turma olhar os números por uns segundos. A média foi puxada para cima por um único valor ruim, e ao mesmo tempo ela esconde que esse valor ruim existiu. Nos dois sentidos ela mente. Por isso a gente usa percentis.*

---

## Slide 8 — Percentis: p50 e p95

**Percentil = você ordena todos os tempos de resposta do menor para o maior e olha uma posição específica da fila.**

- **p50 (mediana)** — o valor do meio da fila.
  *"Metade dos usuários teve uma experiência melhor ou igual a essa."*
  → É a experiência **típica**, do usuário comum.

- **p95** — de 100 requisições ordenadas, é a 95ª.
  *"95% dos usuários tiveram esse tempo ou melhor. Só 5% foram piores."*
  → É a experiência do **usuário azarado**.

**Exemplo: p50 = 180 ms e p95 = 2.400 ms**
O usuário comum acha o sistema rápido. Mas 1 em cada 20 esperou quase 2 segundos e meio.

*Fala (Eduardo): Essa é a parte que a gente quer que todo mundo saia entendendo. Imaginem 100 pessoas usando o sistema e a gente enfileira todas pelo tempo que esperaram, da mais rápida para a mais lenta. O p50 é a pessoa que está no meio dessa fila. O p95 é a pessoa na posição 95 — quase a pior. A gente se preocupa com ela porque 5% dos usuários é muita gente: num sistema com 10 mil acessos por dia, são 500 pessoas com experiência ruim todo dia.*

---

## Slide 9 — Por que p95 e não o pior caso?

- O **pior caso (máximo)** é um valor só — pode ser ruído: uma travada do sistema operacional, a rede oscilando
- Otimizar por causa de um único ponto fora da curva é desperdício
- O **p95 é o pior caso que acontece com frequência** — esse é real e vale corrigir

**Na prática, o critério do time costuma ser escrito assim:**
> "O p95 do tempo de resposta deve ficar abaixo de 500 ms com 50 usuários simultâneos."

Frase testável. Ou passa, ou não passa. **Isso é validação.**

*Fala (Eduardo): Emendar com: e é exatamente essa frase que a gente vai transformar em código daqui a pouco, no k6. Ela vira uma linha do script, e o k6 devolve verde ou vermelho.*

---

## Slide 10 — Carga × Estresse × Desempenho

| | Pergunta que responde | Carga usada |
|---|---|---|
| **Desempenho** | Guarda-chuva: o sistema é eficiente? | varia |
| **Carga** | Aguenta o uso **esperado**? | a carga prevista do dia a dia |
| **Estresse** | Onde ele **quebra**? E se recupera? | acima do limite, até falhar |

- **Desempenho** é a categoria geral — carga e estresse são tipos dentro dela
- **Carga**: "domingo à noite, 500 pessoas usando. Tudo bem?" → espera-se **sucesso**
- **Estresse**: "e se vierem 5.000?" → espera-se **encontrar o ponto de ruptura**

> No teste de carga, falhar é um problema. No teste de estresse, falhar é o objetivo.

*Fala (Eduardo): Citar os colegas: o Grupo 1 vai falar de desempenho, que é o guarda-chuva onde o nosso tema mora, e o Grupo 3 vai falar de estresse, que é o passo seguinte ao nosso. A frase do rodapé resume a diferença toda.*

*Se perguntarem sobre nomenclatura: na documentação do k6 esse teste aparece como "average-load test" — o teste que avalia o sistema sob as condições normais esperadas. É o mesmo que a literatura em português chama de teste de carga.*

---

## Slide 11 — Quando aplicar e por quê

**Situações em que o teste de carga é indispensável:**

- **Evento de pico previsto** — Black Friday, matrícula na faculdade, venda de ingresso, Enem
- **Antes de lançar** um sistema que vai receber muita gente de uma vez
- **Depois de mudança grande** — trocou o banco, refez uma consulta, migrou de servidor
- **Crescimento de base** — a aplicação dobrou de usuários desde o último teste
- **Contrato de nível de serviço (SLA)** — quando existe tempo de resposta acordado por contrato

**Onde entra no processo de desenvolvimento:**

- Roda em ambiente de **homologação**, parecido com produção
- Idealmente **automatizado no pipeline de CI/CD** — a cada versão, o teste roda sozinho
- Se o critério de desempenho falhar, **a versão não sobe**

*Fala (Eduardo): O exemplo da matrícula é o que mais pega na turma, todo mundo já viu sistema de matrícula cair. É o caso clássico: o sistema funciona perfeitamente 364 dias por ano e cai exatamente no único dia que importa. E ninguém testou aquele dia.*

---

## Slide 12 — Nossa demonstração

**O que vamos fazer, ao vivo:**

1. Subir uma **API simples** com um endpoint `GET /produtos`
2. Rodar o k6 com **5 usuários** → uso tranquilo
3. Rodar com **50 usuários** → o limite da API
4. Rodar com **100 usuários** → acima do limite
5. Ler os relatórios e comparar os três

**Critério de aprovação definido antes do teste:**
- p95 do tempo de resposta **< 500 ms**
- taxa de erro **< 1%**

**Ferramenta: k6** (Grafana Labs) — open source, teste escrito em JavaScript, roda pelo terminal.

*Fala (Luan): Dizer que a gente não sabia de antemão onde essa API ia quebrar — a gente descobriu rodando. E é exatamente isso que um teste de carga faz: a gente não adivinha o limite, a gente mede. Avisar também que o terceiro teste reprova, porque um teste que nunca falha não prova nada.*

---

## Slide 13 — O script explicado

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

const VUS = Number(__ENV.VUS || 50); // usuários virtuais, vem do terminal

export const options = {
  stages: [
    { duration: '10s', target: VUS }, // sobe de 0 até VUS usuários
    { duration: '20s', target: VUS }, // mantém a carga
    { duration: '5s',  target: 0 },   // desce até 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% abaixo de 500ms
    http_req_failed:   ['rate<0.01'], // menos de 1% de erro
  },
};

export default function () {
  const res = http.get('http://localhost:3000/produtos');
  check(res, { 'status 200': (r) => r.status === 200 });
  sleep(1); // pausa entre as ações, como um usuário real
}
```

- **stages** → a rampa: sobe, sustenta, desce
- **thresholds** → o critério de aprovação virando código
- **check** → verifica se a resposta veio correta
- **sleep** → sem isso o teste vira robô metralhadora, não usuário

O mesmo arquivo roda os três cenários: `k6 run -e VUS=5 carga.js`

*Fala (Luan): Ir linha por linha, sem pressa. O sleep é o detalhe que mais gente esquece: usuário real lê a tela, pensa, clica. Sem a pausa você não está simulando carga realista, está fazendo outra coisa.*

---

## Slide 14 — Lendo o resultado

**Resultados reais dos nossos três testes:**

| | 5 usuários | 50 usuários | 100 usuários |
|---|---|---|---|
| **p50** (usuário típico) | 25 ms | 249 ms | 1,49 s |
| **p95** (usuário azarado) | 26 ms | 251 ms | **1,50 s** |
| **Média** | 25 ms | 195 ms | 1,17 s |
| **Requisições/segundo** | 3,9 | 32,7 | 36,6 |
| **Taxa de erro** | 0% | 0% | 0% |
| **Veredito** | ✓ passou | ✓ passou | **✗ REPROVOU** |

**Três coisas para notar:**

- **A taxa de erro nunca saiu de 0%.** O sistema não caiu — só ficou lento. Um teste que só olha "deu erro?" aprovaria os três
- **O throughput travou em ~37 req/s.** Dobramos os usuários e o sistema não atendeu mais ninguém — só fez todos esperarem mais. **Esse é o limite da API**
- **A média mentiu de novo:** com 50 usuários a média (195 ms) ficou bem abaixo do p50 (249 ms), porque ela incluiu as respostas rápidas da subida da rampa

*Fala (Eduardo): O segundo ponto é o mais forte. Do teste de 50 para o de 100, o número de requisições atendidas praticamente não mudou: 32 para 36 por segundo. Mas o tempo de espera foi de 250ms para 1,5 segundo — seis vezes pior. O sistema não ganhou capacidade nenhuma, só formou fila. Encontrar esse ponto é o objetivo do teste de carga.*

---

## Slide 15 — Conclusão

- Teste de carga responde uma pergunta que o teste funcional não responde: **"aguenta?"**
- **Média engana. Use percentis** — p50 para o usuário típico, p95 para o usuário azarado
- Um bom teste de carga tem **critério definido antes** de rodar
- Achar o gargalo em teste é barato. Achar em produção, no dia do pico, é caro
- Teste de carga não é luxo de sistema grande: **é parte da validação**

*Fala (Luan): Fechar com a frase do custo. E abrir para perguntas.*

---

## Slide 16 — Referências

- **ISO/IEC 25010:2023** — *Systems and software engineering — SQuaRE — Product quality model.* Característica *Performance efficiency* (substitui a edição de 2011)
- **ISTQB** — *Certified Tester Foundation Level Syllabus*, v4.0.1, 2024 — testes não funcionais
- **GRAFANA LABS** — *k6 Documentation: Load test types.* Disponível em: grafana.com/docs/k6/latest/testing-guides/test-types
- **MOLYNEAUX, Ian.** *The Art of Application Performance Testing.* 2. ed. O'Reilly, 2014
- **DELAMARO, M.; MALDONADO, J.; JINO, M.** *Introdução ao Teste de Software.* 2. ed. Rio de Janeiro: Elsevier, 2016

*Todas conferidas em 17/09/2026.*
