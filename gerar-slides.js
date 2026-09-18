// Gera apresentacao.pptx a partir do conteudo de slides.md
// Rodar com: node gerar-slides.js

const pptxgen = require('pptxgenjs');

const pres = new pptxgen();
pres.layout = 'LAYOUT_WIDE'; // 13.333 x 7.5 polegadas
pres.author = 'Luan e Eduardo';
pres.title = 'Teste de Carga';

// ---------------------------------------------------------------- paleta
const ESCURO = '21295C'; // midnight
const AZUL = '065A82'; // deep blue
const TEAL = '1C7293';
const TINTA = '1F2933'; // texto
const MUDO = '5B6B77'; // texto secundario
const CLARO = 'EEF4F7'; // fundo de card
const BRANCO = 'FFFFFF';
const GELO = 'A9C4D6';
const VERDE = '2C6E49';
const VERMELHO = '9E2A2B';

const SERIF = 'Cambria';
const SANS = 'Calibri';
const MONO = 'Courier New';

const M = 0.6; // margem
const LARG = 13.333 - M * 2; // 12.133

// ---------------------------------------------------------------- helpers
function titulo(slide, texto) {
  slide.addText(texto, {
    x: M, y: 0.42, w: LARG, h: 0.85,
    fontFace: SERIF, fontSize: 36, bold: true, color: ESCURO,
    isTextBox: true, margin: 0, valign: 'middle',
  });
}

function card(slide, x, y, w, h, cor) {
  slide.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: cor || CLARO }, line: { color: cor || CLARO, width: 0 },
  });
}

// circulo com numero dentro
function numero(slide, x, y, n, corFundo, corTexto) {
  const d = 0.42;
  slide.addShape(pres.ShapeType.ellipse, {
    x, y, w: d, h: d,
    fill: { color: corFundo || TEAL }, line: { color: corFundo || TEAL, width: 0 },
  });
  slide.addText(String(n), {
    x, y, w: d, h: d,
    fontFace: SANS, fontSize: 13, bold: true, color: corTexto || BRANCO,
    align: 'center', valign: 'middle', isTextBox: true, margin: 0,
  });
}

// motivo visual: rampa de barras crescentes (representa a carga subindo)
function rampa(slide, x, baseY, cor, transp) {
  const n = 12;
  const lw = 0.22, gap = 0.1;
  for (let i = 0; i < n; i++) {
    const h = 0.18 + (i / (n - 1)) * 1.15;
    slide.addShape(pres.ShapeType.rect, {
      x: x + i * (lw + gap), y: baseY - h, w: lw, h,
      fill: { color: cor, transparency: transp === undefined ? 0 : transp },
      line: { color: cor, width: 0, transparency: transp === undefined ? 0 : transp },
    });
  }
}

// lista de itens com marcador quadrado colorido
function lista(slide, itens, x, y, w, opts) {
  const o = opts || {};
  const alturaLinha = o.alturaLinha || 0.62;
  itens.forEach((item, i) => {
    const ly = y + i * alturaLinha;
    slide.addShape(pres.ShapeType.rect, {
      x, y: ly + 0.1, w: 0.11, h: 0.11,
      fill: { color: o.corMarcador || TEAL }, line: { color: o.corMarcador || TEAL, width: 0 },
    });
    slide.addText(item, {
      x: x + 0.28, y: ly - 0.03, w: w - 0.28, h: alturaLinha,
      fontFace: SANS, fontSize: o.fontSize || 15, color: o.cor || TINTA,
      isTextBox: true, margin: 0, valign: 'top',
    });
  });
}

// =============================================================== SLIDE 1
{
  const s = pres.addSlide();
  s.background = { color: ESCURO };

  s.addText('Teste de Carga', {
    x: M, y: 2.0, w: 9.0, h: 1.2,
    fontFace: SERIF, fontSize: 60, bold: true, color: BRANCO,
    isTextBox: true, margin: 0,
  });
  s.addText('Verificação e Validação de Software  ·  Testes não funcionais', {
    x: M, y: 3.25, w: 9.0, h: 0.45,
    fontFace: SANS, fontSize: 18, color: GELO, isTextBox: true, margin: 0,
  });

  s.addText('Luan e Eduardo', {
    x: M, y: 5.55, w: 7.0, h: 0.4,
    fontFace: SANS, fontSize: 17, bold: true, color: BRANCO, isTextBox: true, margin: 0,
  });
  s.addText('Prof. MSc. Junior Marcos Bandeira  ·  2025.6 — 1º Bimestre', {
    x: M, y: 5.95, w: 7.0, h: 0.4,
    fontFace: SANS, fontSize: 13, color: GELO, isTextBox: true, margin: 0,
  });

  rampa(s, 8.6, 6.35, TEAL);

  s.addNotes('Luan: Boa noite. Nosso tema e teste de carga. A ideia e bem direta: descobrir se um sistema aguenta a quantidade de gente que a gente espera que use ele. E no final a gente vai rodar um teste de verdade aqui, ao vivo.');
}

// =============================================================== SLIDE 2
{
  const s = pres.addSlide();
  titulo(s, 'Agenda');

  const esq = [
    'O que é teste de carga',
    'Objetivos e características',
    'As métricas que importam',
    'Carga × Estresse × Desempenho',
  ];
  const dir = [
    'Quando aplicar e por quê',
    'Demonstração prática com k6',
    'Conclusão e referências',
  ];

  esq.forEach((t, i) => {
    const y = 1.75 + i * 0.95;
    numero(s, M, y, i + 1);
    s.addText(t, {
      x: M + 0.62, y, w: 5.2, h: 0.42,
      fontFace: SANS, fontSize: 16, color: TINTA, bold: i === 0 ? false : false,
      isTextBox: true, margin: 0, valign: 'middle',
    });
  });

  dir.forEach((t, i) => {
    const y = 1.75 + i * 0.95;
    const destaque = t.indexOf('Demonstração') === 0;
    numero(s, 7.1, y, i + 5, destaque ? AZUL : TEAL);
    s.addText(t, {
      x: 7.72, y, w: 5.0, h: 0.42,
      fontFace: SANS, fontSize: 16, bold: destaque, color: destaque ? AZUL : TINTA,
      isTextBox: true, margin: 0, valign: 'middle',
    });
  });

  s.addNotes('Luan: Passar rapido, uns 20 segundos. So para a turma saber que tem demo no final e prestar atencao.');
}

// =============================================================== SLIDE 3
{
  const s = pres.addSlide();
  titulo(s, 'O que é teste de carga');

  s.addText('Colocar o sistema para funcionar sob a quantidade de uso que a gente espera na vida real — e medir como ele se comporta.', {
    x: M, y: 1.5, w: 7.0, h: 1.0,
    fontFace: SANS, fontSize: 18, bold: true, color: AZUL, isTextBox: true, margin: 0,
  });

  lista(s, [
    'Não estamos procurando erro de lógica no código',
    'Estamos perguntando: "e quando forem 500 pessoas ao mesmo tempo?"',
    'É um teste não funcional: não avalia o que o sistema faz, e sim como ele faz — rápido, estável, sem quebrar',
  ], M, 2.75, 7.0, { alturaLinha: 0.85, fontSize: 15 });

  card(s, 8.1, 1.5, 4.63, 3.45);
  s.addText('ANALOGIA', {
    x: 8.45, y: 1.8, w: 3.9, h: 0.3,
    fontFace: SANS, fontSize: 11, bold: true, color: TEAL, charSpacing: 1.5,
    isTextBox: true, margin: 0,
  });
  s.addText('Testar uma ponte não é só ver se dá para atravessar a pé.', {
    x: 8.45, y: 2.25, w: 3.95, h: 1.0,
    fontFace: SERIF, fontSize: 18, bold: true, color: ESCURO, isTextBox: true, margin: 0,
  });
  s.addText('É colocar em cima dela o peso de trânsito que ela vai receber todo dia e medir se ela entorta.', {
    x: 8.45, y: 3.35, w: 3.95, h: 1.2,
    fontFace: SANS, fontSize: 15, color: MUDO, isTextBox: true, margin: 0,
  });

  s.addNotes('Luan: O ponto principal e a diferenca entre teste funcional e nao funcional. Um teste funcional pergunta "o botao de login funciona?". O teste de carga pergunta "o botao de login continua funcionando quando 500 pessoas clicam nele no mesmo minuto?". O sistema pode estar 100% correto e ainda assim ser inutilizavel.');
}

// =============================================================== SLIDE 4
{
  const s = pres.addSlide();
  titulo(s, 'Objetivos');

  s.addText('O que a gente quer descobrir:', {
    x: M, y: 1.35, w: 8.0, h: 0.35,
    fontFace: SANS, fontSize: 15, bold: true, color: MUDO, isTextBox: true, margin: 0,
  });

  const objetivos = [
    'O sistema aguenta a carga esperada?',
    'Ele continua rápido o suficiente sob essa carga?',
    'Quantos usuários simultâneos ele suporta antes de degradar?',
    'O sistema se mantém estável ao longo do tempo ou vai piorando?',
    'Onde está o gargalo: banco de dados, servidor, rede, código?',
  ];

  objetivos.forEach((t, i) => {
    const y = 1.9 + i * 0.72;
    numero(s, M, y, i + 1);
    s.addText(t, {
      x: M + 0.62, y, w: 11.4, h: 0.42,
      fontFace: SANS, fontSize: 16, color: TINTA, isTextBox: true, margin: 0, valign: 'middle',
    });
  });

  card(s, M, 5.75, LARG, 0.95, TEAL);
  s.addText('Objetivo final: descobrir o problema antes do usuário descobrir.', {
    x: M, y: 5.75, w: LARG, h: 0.95,
    fontFace: SERIF, fontSize: 21, bold: true, color: BRANCO,
    align: 'center', valign: 'middle', isTextBox: true, margin: 0,
  });

  s.addNotes('Luan: Reforcar a ultima linha. O custo de achar isso em teste e uma tarde de trabalho. O custo de achar em producao, num dia de pico, e o sistema fora do ar na hora que ele mais importa.');
}

// =============================================================== SLIDE 5
{
  const s = pres.addSlide();
  titulo(s, 'Características principais');

  const itens = [
    ['Carga esperada', 'Simulamos o uso realista previsto — não um exagero'],
    ['Gradual', 'Sobe o número de usuários aos poucos (rampa) para ver onde começa a piorar'],
    ['Tem duração', 'Não é um pico de 2 segundos: é sustentar a carga por um período'],
    ['Automatizado', 'Impossível fazer manualmente com centenas de usuários'],
    ['Baseado em métricas', 'O resultado é número, não opinião'],
    ['Com critério de aprovação', 'Definido antes de rodar o teste'],
  ];

  const cw = 3.81, ch = 1.9, gap = 0.34;
  itens.forEach((it, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = M + col * (cw + gap);
    const y = 1.6 + row * (ch + gap);
    card(s, x, y, cw, ch);
    s.addText(it[0], {
      x: x + 0.28, y: y + 0.24, w: cw - 0.56, h: 0.45,
      fontFace: SANS, fontSize: 16, bold: true, color: AZUL, isTextBox: true, margin: 0,
    });
    s.addText(it[1], {
      x: x + 0.28, y: y + 0.72, w: cw - 0.56, h: 1.0,
      fontFace: SANS, fontSize: 13, color: MUDO, isTextBox: true, margin: 0,
    });
  });

  s.addText('O último item é o que transforma o teste em validação: sem critério definido antes, o teste só mede — não aprova nem reprova.', {
    x: M, y: 6.15, w: LARG, h: 0.5,
    fontFace: SANS, fontSize: 14, italic: true, color: MUDO, isTextBox: true, margin: 0,
  });

  s.addNotes('Eduardo: O ultimo item e o mais importante para nossa disciplina. Sem um criterio definido antes, o teste vira so "achei o numero bonitinho". Com criterio, ele vira validacao de verdade: passou ou nao passou. A gente vai mostrar isso na pratica com os thresholds do k6.');
}

// =============================================================== SLIDE 6
{
  const s = pres.addSlide();
  titulo(s, 'As métricas que importam');

  const linhas = [
    [
      { text: 'Métrica', options: { bold: true, color: BRANCO, fill: { color: ESCURO } } },
      { text: 'O que é', options: { bold: true, color: BRANCO, fill: { color: ESCURO } } },
      { text: 'Em português claro', options: { bold: true, color: BRANCO, fill: { color: ESCURO } } },
    ],
    ['VUs (usuários virtuais)', 'Usuários simultâneos simulados', 'Quantas "pessoas" o teste está simulando'],
    ['Throughput', 'Requisições por segundo', 'Quanto o sistema consegue atender'],
    ['Tempo de resposta', 'Duração de cada requisição', 'Quanto o usuário espera na tela'],
    ['Taxa de erro', '% de requisições que falharam', 'Quantas pessoas tomaram erro'],
  ];

  s.addTable(linhas, {
    x: M, y: 1.6, w: LARG,
    colW: [3.3, 4.0, 4.833],
    rowH: [0.5, 0.72, 0.72, 0.72, 0.72],
    fontFace: SANS, fontSize: 15, color: TINTA,
    valign: 'middle',
    border: { type: 'solid', color: 'D6E1E8', pt: 1 },
    fill: { color: BRANCO },
    margin: 0.12,
  });

  card(s, M, 5.7, LARG, 1.0);
  s.addText('Dessas quatro, a de tempo de resposta é a mais traiçoeira — e é sobre ela que falamos agora.', {
    x: M + 0.3, y: 5.7, w: LARG - 0.6, h: 1.0,
    fontFace: SANS, fontSize: 15, color: TINTA, valign: 'middle', isTextBox: true, margin: 0,
  });

  s.addNotes('Eduardo: Explicar VU com calma, e o conceito que mais confunde. Um VU e um usuario simulado que fica repetindo a acao em loop. 50 VUs nao e "50 requisicoes", e "50 pessoas usando o sistema ao mesmo tempo, sem parar". Depois emendar para o proximo slide.');
}

// =============================================================== SLIDE 7
{
  const s = pres.addSlide();
  titulo(s, 'O problema da média');

  s.addText('Nunca olhe só a média do tempo de resposta.', {
    x: M, y: 1.35, w: LARG, h: 0.4,
    fontFace: SANS, fontSize: 18, bold: true, color: AZUL, isTextBox: true, margin: 0,
  });

  card(s, M, 1.95, LARG, 1.25);
  s.addText('10 requisições, em milissegundos:', {
    x: M + 0.3, y: 2.1, w: 5.0, h: 0.3,
    fontFace: SANS, fontSize: 12, color: MUDO, isTextBox: true, margin: 0,
  });
  s.addText('120   130   140   150   160   170   180   190   200   900', {
    x: M + 0.3, y: 2.45, w: LARG - 0.6, h: 0.6,
    fontFace: MONO, fontSize: 20, bold: true, color: ESCURO, isTextBox: true, margin: 0,
  });

  card(s, M, 3.5, 3.5, 2.0, ESCURO);
  s.addText('234 ms', {
    x: M, y: 3.75, w: 3.5, h: 0.85,
    fontFace: SERIF, fontSize: 44, bold: true, color: BRANCO,
    align: 'center', isTextBox: true, margin: 0,
  });
  s.addText('a média — parece ótimo', {
    x: M, y: 4.6, w: 3.5, h: 0.4,
    fontFace: SANS, fontSize: 14, color: GELO, align: 'center', isTextBox: true, margin: 0,
  });

  lista(s, [
    '9 das 10 requisições foram mais rápidas que a média',
    'E teve um usuário esperando quase 1 segundo',
  ], 4.6, 3.75, 8.1, { alturaLinha: 0.75, fontSize: 16 });

  s.addText('A média esconde os piores casos. E é justamente o pior caso que faz o usuário desistir.', {
    x: 4.6, y: 5.3, w: 8.13, h: 0.5,
    fontFace: SERIF, fontSize: 16, italic: true, bold: true, color: AZUL, isTextBox: true, margin: 0,
  });

  s.addText('Ela é puxada para cima por um único valor ruim e, ao mesmo tempo, esconde que esse valor existiu. Mente nos dois sentidos.', {
    x: M, y: 6.25, w: LARG, h: 0.5,
    fontFace: SANS, fontSize: 14, color: MUDO, isTextBox: true, margin: 0,
  });

  s.addNotes('Eduardo: Deixar a turma olhar os numeros por uns segundos. A media foi puxada para cima por um unico valor ruim, e ao mesmo tempo ela esconde que esse valor ruim existiu. Nos dois sentidos ela mente. Por isso a gente usa percentis.');
}

// =============================================================== SLIDE 8
{
  const s = pres.addSlide();
  titulo(s, 'Percentis: p50 e p95');

  s.addText('Percentil = você ordena todos os tempos de resposta, do menor para o maior, e olha uma posição específica da fila.', {
    x: M, y: 1.32, w: LARG, h: 0.45,
    fontFace: SANS, fontSize: 16, bold: true, color: AZUL, isTextBox: true, margin: 0,
  });

  const cw = 5.9, cy = 1.95, ch = 2.85;

  card(s, M, cy, cw, ch);
  s.addText('p50', {
    x: M + 0.35, y: cy + 0.22, w: 2.0, h: 0.7,
    fontFace: SERIF, fontSize: 38, bold: true, color: AZUL, isTextBox: true, margin: 0,
  });
  s.addText('a mediana', {
    x: M + 1.75, y: cy + 0.45, w: 3.0, h: 0.4,
    fontFace: SANS, fontSize: 15, color: MUDO, isTextBox: true, margin: 0,
  });
  s.addText('O valor do meio da fila.', {
    x: M + 0.35, y: cy + 1.05, w: cw - 0.7, h: 0.35,
    fontFace: SANS, fontSize: 15, bold: true, color: TINTA, isTextBox: true, margin: 0,
  });
  s.addText('"Metade dos usuários teve uma experiência melhor ou igual a essa."', {
    x: M + 0.35, y: cy + 1.42, w: cw - 0.7, h: 0.65,
    fontFace: SANS, fontSize: 14, italic: true, color: MUDO, isTextBox: true, margin: 0,
  });
  s.addText('É a experiência típica, do usuário comum.', {
    x: M + 0.35, y: cy + 2.15, w: cw - 0.7, h: 0.4,
    fontFace: SANS, fontSize: 14, bold: true, color: TEAL, isTextBox: true, margin: 0,
  });

  card(s, M + cw + 0.35, cy, cw, ch);
  const x2 = M + cw + 0.35;
  s.addText('p95', {
    x: x2 + 0.35, y: cy + 0.22, w: 2.0, h: 0.7,
    fontFace: SERIF, fontSize: 38, bold: true, color: AZUL, isTextBox: true, margin: 0,
  });
  s.addText('a 95ª de 100', {
    x: x2 + 1.75, y: cy + 0.45, w: 3.2, h: 0.4,
    fontFace: SANS, fontSize: 15, color: MUDO, isTextBox: true, margin: 0,
  });
  s.addText('De 100 requisições ordenadas, é a 95ª.', {
    x: x2 + 0.35, y: cy + 1.05, w: cw - 0.7, h: 0.35,
    fontFace: SANS, fontSize: 15, bold: true, color: TINTA, isTextBox: true, margin: 0,
  });
  s.addText('"95% dos usuários tiveram esse tempo ou melhor. Só 5% foram piores."', {
    x: x2 + 0.35, y: cy + 1.42, w: cw - 0.7, h: 0.65,
    fontFace: SANS, fontSize: 14, italic: true, color: MUDO, isTextBox: true, margin: 0,
  });
  s.addText('É a experiência do usuário azarado.', {
    x: x2 + 0.35, y: cy + 2.15, w: cw - 0.7, h: 0.4,
    fontFace: SANS, fontSize: 14, bold: true, color: TEAL, isTextBox: true, margin: 0,
  });

  card(s, M, 5.1, LARG, 1.55, ESCURO);
  s.addText('p50 = 180 ms        p95 = 2.400 ms', {
    x: M + 0.45, y: 5.3, w: 6.0, h: 0.5,
    fontFace: MONO, fontSize: 19, bold: true, color: BRANCO, isTextBox: true, margin: 0,
  });
  s.addText('O usuário comum acha o sistema rápido. Mas 1 em cada 20 esperou quase 2 segundos e meio.', {
    x: M + 0.45, y: 5.85, w: 11.2, h: 0.6,
    fontFace: SANS, fontSize: 15, color: GELO, isTextBox: true, margin: 0,
  });

  s.addNotes('Eduardo: Essa e a parte que a gente quer que todo mundo saia entendendo. Imaginem 100 pessoas usando o sistema e a gente enfileira todas pelo tempo que esperaram, da mais rapida para a mais lenta. O p50 e a pessoa que esta no meio dessa fila. O p95 e a pessoa na posicao 95, quase a pior. A gente se preocupa com ela porque 5% dos usuarios e muita gente: num sistema com 10 mil acessos por dia, sao 500 pessoas com experiencia ruim todo dia.');
}

// =============================================================== SLIDE 9
{
  const s = pres.addSlide();
  titulo(s, 'Por que p95 e não o pior caso?');

  lista(s, [
    'O pior caso (o máximo) é um valor só — pode ser ruído: uma travada do sistema operacional, a rede oscilando',
    'Otimizar por causa de um único ponto fora da curva é desperdício de trabalho',
    'O p95 é o pior caso que acontece com frequência — esse é real e vale corrigir',
  ], M, 1.85, 6.9, { alturaLinha: 1.35, fontSize: 16 });

  card(s, 7.9, 1.6, 4.83, 5.05, ESCURO);
  s.addText('NA PRÁTICA, O CRITÉRIO DO TIME VIRA ESTA FRASE', {
    x: 8.2, y: 1.9, w: 4.2, h: 0.55,
    fontFace: SANS, fontSize: 10.5, bold: true, color: GELO, charSpacing: 1.2,
    isTextBox: true, margin: 0,
  });
  s.addText('"O p95 do tempo de resposta deve ficar abaixo de 500 ms com 50 usuários simultâneos."', {
    x: 8.2, y: 2.55, w: 4.25, h: 1.7,
    fontFace: SERIF, fontSize: 18, bold: true, color: BRANCO, isTextBox: true, margin: 0,
  });
  s.addText('Ou passa, ou não passa.', {
    x: 8.2, y: 4.35, w: 4.25, h: 0.4,
    fontFace: SANS, fontSize: 15, color: GELO, isTextBox: true, margin: 0,
  });

  s.addText('Frase testável. Isso é validação.', {
    x: 8.2, y: 5.25, w: 4.25, h: 0.45,
    fontFace: SERIF, fontSize: 19, bold: true, color: BRANCO, isTextBox: true, margin: 0,
  });
  s.addText('É exatamente ela que vira uma linha de código no k6 daqui a pouco.', {
    x: 8.2, y: 5.75, w: 4.25, h: 0.7,
    fontFace: SANS, fontSize: 13.5, color: GELO, isTextBox: true, margin: 0,
  });

  s.addNotes('Eduardo: Emendar com: e exatamente essa frase que a gente vai transformar em codigo daqui a pouco, no k6. Ela vira uma linha do script, e o k6 devolve verde ou vermelho.');
}

// =============================================================== SLIDE 10
{
  const s = pres.addSlide();
  titulo(s, 'Carga × Estresse × Desempenho');

  const linhas = [
    [
      { text: '', options: { fill: { color: ESCURO } } },
      { text: 'Pergunta que responde', options: { bold: true, color: BRANCO, fill: { color: ESCURO } } },
      { text: 'Carga usada', options: { bold: true, color: BRANCO, fill: { color: ESCURO } } },
      { text: 'Resultado esperado', options: { bold: true, color: BRANCO, fill: { color: ESCURO } } },
    ],
    [
      { text: 'Desempenho', options: { bold: true, color: AZUL } },
      'Guarda-chuva: o sistema é eficiente?',
      'varia',
      '—',
    ],
    [
      { text: 'Carga', options: { bold: true, color: AZUL } },
      'Aguenta o uso esperado?',
      'a carga prevista do dia a dia',
      { text: 'sucesso', options: { bold: true, color: VERDE } },
    ],
    [
      { text: 'Estresse', options: { bold: true, color: AZUL } },
      'Onde ele quebra? E se recupera?',
      'acima do limite, até falhar',
      { text: 'achar a ruptura', options: { bold: true, color: VERMELHO } },
    ],
  ];

  s.addTable(linhas, {
    x: M, y: 1.6, w: LARG,
    colW: [2.4, 3.9, 3.2, 2.633],
    rowH: [0.5, 0.75, 0.75, 0.75],
    fontFace: SANS, fontSize: 14, color: TINTA,
    valign: 'middle',
    border: { type: 'solid', color: 'D6E1E8', pt: 1 },
    fill: { color: BRANCO },
    margin: 0.12,
  });

  lista(s, [
    'Carga: "domingo à noite, 500 pessoas usando. Tudo bem?"',
    'Estresse: "e se vierem 5.000?" — o passo seguinte ao nosso tema',
  ], M, 4.5, 11.5, { alturaLinha: 0.55, fontSize: 15 });

  card(s, M, 5.65, LARG, 1.0, TEAL);
  s.addText('No teste de carga, falhar é um problema. No teste de estresse, falhar é o objetivo.', {
    x: M, y: 5.65, w: LARG, h: 1.0,
    fontFace: SERIF, fontSize: 20, bold: true, color: BRANCO,
    align: 'center', valign: 'middle', isTextBox: true, margin: 0,
  });

  s.addNotes('Eduardo: Citar os colegas: o Grupo 1 vai falar de desempenho, que e o guarda-chuva onde o nosso tema mora, e o Grupo 3 vai falar de estresse, que e o passo seguinte ao nosso. A frase do rodape resume a diferenca toda. Se perguntarem sobre nomenclatura: na documentacao do k6 esse teste aparece como "average-load test", o teste que avalia o sistema sob as condicoes normais esperadas. E o mesmo que a literatura em portugues chama de teste de carga.');
}

// =============================================================== SLIDE 11
{
  const s = pres.addSlide();
  titulo(s, 'Quando aplicar e por quê');

  s.addText('Situações em que o teste de carga é indispensável', {
    x: M, y: 1.4, w: 7.0, h: 0.4,
    fontFace: SANS, fontSize: 16, bold: true, color: AZUL, isTextBox: true, margin: 0,
  });

  lista(s, [
    'Evento de pico previsto — Black Friday, matrícula na faculdade, venda de ingresso',
    'Antes de lançar um sistema que vai receber muita gente de uma vez',
    'Depois de mudança grande — trocou o banco, refez uma consulta, migrou de servidor',
    'Crescimento de base — a aplicação dobrou de usuários desde o último teste',
    'Contrato de nível de serviço (SLA) com tempo de resposta acordado',
  ], M, 2.0, 7.0, { alturaLinha: 0.9, fontSize: 15 });

  card(s, 7.9, 1.4, 4.83, 5.25);
  s.addText('ONDE ENTRA NO PROCESSO', {
    x: 8.2, y: 1.75, w: 4.2, h: 0.35,
    fontFace: SANS, fontSize: 11, bold: true, color: TEAL, charSpacing: 1.5,
    isTextBox: true, margin: 0,
  });
  lista(s, [
    'Roda em ambiente de homologação, parecido com produção',
    'Idealmente automatizado no pipeline de CI/CD — a cada versão, o teste roda sozinho',
    'Se o critério de desempenho falhar, a versão não sobe',
  ], 8.2, 2.35, 4.2, { alturaLinha: 1.25, fontSize: 14 });

  s.addText('O sistema de matrícula é o caso clássico: funciona 364 dias por ano e cai exatamente no único dia que importa.', {
    x: 8.2, y: 5.85, w: 4.25, h: 0.6,
    fontFace: SANS, fontSize: 13, italic: true, color: MUDO, isTextBox: true, margin: 0,
  });

  s.addNotes('Eduardo: O exemplo da matricula e o que mais pega na turma, todo mundo ja viu sistema de matricula cair. E o caso classico: o sistema funciona perfeitamente 364 dias por ano e cai exatamente no unico dia que importa. E ninguem testou aquele dia.');
}

// =============================================================== SLIDE 12
{
  const s = pres.addSlide();
  titulo(s, 'Nossa demonstração');

  const passos = [
    'Subir uma API simples com um endpoint GET /produtos',
    'Rodar o k6 com 5 usuários — uso tranquilo',
    'Rodar com 50 usuários — o limite da API',
    'Rodar com 100 usuários — acima do limite',
    'Ler os relatórios e comparar os três',
  ];
  passos.forEach((t, i) => {
    const y = 1.6 + i * 0.78;
    numero(s, M, y, i + 1);
    s.addText(t, {
      x: M + 0.62, y, w: 6.5, h: 0.42,
      fontFace: SANS, fontSize: 15, color: TINTA, isTextBox: true, margin: 0, valign: 'middle',
    });
  });

  card(s, 7.9, 1.6, 4.83, 2.65, ESCURO);
  s.addText('CRITÉRIO DE APROVAÇÃO, DEFINIDO ANTES DO TESTE', {
    x: 8.2, y: 1.85, w: 4.25, h: 0.5,
    fontFace: SANS, fontSize: 10.5, bold: true, color: GELO, charSpacing: 1.2,
    isTextBox: true, margin: 0,
  });
  s.addText('p95 < 500 ms', {
    x: 8.2, y: 2.45, w: 4.25, h: 0.55,
    fontFace: MONO, fontSize: 22, bold: true, color: BRANCO, isTextBox: true, margin: 0,
  });
  s.addText('taxa de erro < 1%', {
    x: 8.2, y: 3.0, w: 4.25, h: 0.55,
    fontFace: MONO, fontSize: 22, bold: true, color: BRANCO, isTextBox: true, margin: 0,
  });
  s.addText('tempo de resposta e falhas', {
    x: 8.2, y: 3.62, w: 4.25, h: 0.4,
    fontFace: SANS, fontSize: 13, color: GELO, isTextBox: true, margin: 0,
  });

  card(s, 7.9, 4.5, 4.83, 2.15);
  s.addText('Ferramenta: k6', {
    x: 8.2, y: 4.78, w: 4.25, h: 0.45,
    fontFace: SANS, fontSize: 17, bold: true, color: AZUL, isTextBox: true, margin: 0,
  });
  s.addText('Grafana Labs — open source, teste escrito em JavaScript, roda pelo terminal.', {
    x: 8.2, y: 5.25, w: 4.25, h: 1.1,
    fontFace: SANS, fontSize: 14, color: MUDO, isTextBox: true, margin: 0,
  });

  s.addText('Não sabíamos onde essa API ia quebrar — descobrimos rodando. É isso que o teste de carga faz: a gente não adivinha o limite, a gente mede.', {
    x: M, y: 5.75, w: 7.0, h: 0.9,
    fontFace: SANS, fontSize: 14, italic: true, color: MUDO, isTextBox: true, margin: 0,
  });

  s.addNotes('Luan: Dizer que a gente nao sabia de antemao onde essa API ia quebrar, a gente descobriu rodando. E exatamente isso que um teste de carga faz: a gente nao adivinha o limite, a gente mede. Avisar tambem que o terceiro teste reprova, porque um teste que nunca falha nao prova nada.');
}

// =============================================================== SLIDE 13
{
  const s = pres.addSlide();
  titulo(s, 'O script, linha por linha');

  const codigo = [
    "import http from 'k6/http';",
    "import { check, sleep } from 'k6';",
    '',
    'const VUS = Number(__ENV.VUS || 50);',
    '',
    'export const options = {',
    '  stages: [',
    "    { duration: '10s', target: VUS },  // sobe até VUS",
    "    { duration: '20s', target: VUS },  // mantém a carga",
    "    { duration: '5s',  target: 0 },    // desce até 0",
    '  ],',
    '  thresholds: {',
    "    http_req_duration: ['p(95)<500'],",
    "    http_req_failed:   ['rate<0.01'],",
    '  },',
    '};',
    '',
    'export default function () {',
    "  const res = http.get('http://localhost:3000/produtos');",
    "  check(res, { 'status 200': (r) => r.status === 200 });",
    '  sleep(1);',
    '}',
  ].join('\n');

  card(s, M, 1.5, 7.6, 5.15, ESCURO);
  s.addText(codigo, {
    x: M + 0.3, y: 1.72, w: 7.1, h: 4.75,
    fontFace: MONO, fontSize: 11, color: 'E8F1F5',
    isTextBox: true, margin: 0, valign: 'top', lineSpacingMultiple: 1.15,
  });

  const x = 8.5, w = 4.23;
  const expl = [
    ['stages', 'a rampa: sobe, sustenta, desce'],
    ['thresholds', 'o critério de aprovação virando código'],
    ['check', 'verifica se a resposta veio correta'],
    ['sleep', 'sem isso o teste vira metralhadora, não usuário'],
  ];
  expl.forEach((e, i) => {
    const y = 1.55 + i * 1.02;
    s.addText(e[0], {
      x, y, w, h: 0.35,
      fontFace: MONO, fontSize: 15, bold: true, color: AZUL, isTextBox: true, margin: 0,
    });
    s.addText(e[1], {
      x, y: y + 0.34, w, h: 0.6,
      fontFace: SANS, fontSize: 13.5, color: MUDO, isTextBox: true, margin: 0,
    });
  });

  card(s, x, 5.7, w, 0.95);
  s.addText('O mesmo arquivo roda os três cenários:', {
    x: x + 0.22, y: 5.82, w: w - 0.44, h: 0.3,
    fontFace: SANS, fontSize: 11.5, color: MUDO, isTextBox: true, margin: 0,
  });
  s.addText('k6 run -e VUS=5 carga.js', {
    x: x + 0.22, y: 6.14, w: w - 0.44, h: 0.35,
    fontFace: MONO, fontSize: 13, bold: true, color: ESCURO, isTextBox: true, margin: 0,
  });

  s.addNotes('Luan: Ir linha por linha, sem pressa. O sleep e o detalhe que mais gente esquece: usuario real le a tela, pensa, clica. Sem a pausa voce nao esta simulando carga realista, esta fazendo outra coisa.');
}

// =============================================================== SLIDE 14
{
  const s = pres.addSlide();
  titulo(s, 'Lendo os resultados');

  const cab = (t) => ({ text: t, options: { bold: true, color: BRANCO, fill: { color: ESCURO }, align: 'center' } });
  const rot = (t, sub) => ({
    text: [
      { text: t, options: { bold: true, color: TINTA } },
      { text: sub ? '  ' + sub : '', options: { color: MUDO, fontSize: 12 } },
    ],
  });
  const num = (t, cor, negrito) => ({ text: t, options: { align: 'center', color: cor || TINTA, bold: !!negrito } });

  const linhas = [
    [cab(''), cab('5 usuários'), cab('50 usuários'), cab('100 usuários')],
    [rot('p50', '(usuário típico)'), num('25 ms'), num('249 ms'), num('1,49 s')],
    [rot('p95', '(usuário azarado)'), num('26 ms'), num('251 ms'), num('1,50 s', VERMELHO, true)],
    [rot('Média'), num('25 ms'), num('195 ms'), num('1,17 s')],
    [rot('Requisições / segundo'), num('3,9'), num('32,7'), num('36,6')],
    [rot('Taxa de erro'), num('0%'), num('0%'), num('0%')],
    [rot('Veredito'), num('✓ passou', VERDE, true), num('✓ passou', VERDE, true), num('✗ REPROVOU', VERMELHO, true)],
  ];

  s.addTable(linhas, {
    x: M, y: 1.45, w: LARG,
    colW: [3.733, 2.8, 2.8, 2.8],
    rowH: [0.42, 0.44, 0.44, 0.44, 0.44, 0.44, 0.5],
    fontFace: SANS, fontSize: 14, color: TINTA,
    valign: 'middle',
    border: { type: 'solid', color: 'D6E1E8', pt: 1 },
    fill: { color: BRANCO },
    margin: 0.1,
  });

  const obs = [
    ['Erro de 0% nos três', 'O sistema não caiu — só ficou lento. Um teste que só olha "deu erro?" aprovaria os três'],
    ['Throughput travou em ~37/s', 'Dobramos os usuários e o sistema não atendeu mais ninguém. Esse é o limite da API'],
    ['A média mentiu de novo', 'Com 50 usuários ela ficou em 195 ms, abaixo do p50 de 249 ms'],
  ];
  const cw = 3.81, gap = 0.34;
  obs.forEach((o, i) => {
    const x = M + i * (cw + gap);
    card(s, x, 4.75, cw, 1.9);
    s.addText(o[0], {
      x: x + 0.25, y: 4.95, w: cw - 0.5, h: 0.6,
      fontFace: SANS, fontSize: 14.5, bold: true, color: AZUL, isTextBox: true, margin: 0,
    });
    s.addText(o[1], {
      x: x + 0.25, y: 5.5, w: cw - 0.5, h: 1.0,
      fontFace: SANS, fontSize: 12.5, color: MUDO, isTextBox: true, margin: 0,
    });
  });

  s.addNotes('Eduardo: O segundo ponto e o mais forte. Do teste de 50 para o de 100, o numero de requisicoes atendidas praticamente nao mudou: 32 para 36 por segundo. Mas o tempo de espera foi de 250ms para 1,5 segundo, seis vezes pior. O sistema nao ganhou capacidade nenhuma, so formou fila. Encontrar esse ponto e o objetivo do teste de carga. Lembrar tambem: quando um threshold falha, o k6 sai com codigo 99, e assim que um pipeline de CI barra a versao.');
}

// =============================================================== SLIDE 15
{
  const s = pres.addSlide();
  s.background = { color: ESCURO };

  s.addText('Conclusão', {
    x: M, y: 0.6, w: LARG, h: 0.9,
    fontFace: SERIF, fontSize: 38, bold: true, color: BRANCO, isTextBox: true, margin: 0,
  });

  lista(s, [
    'Teste de carga responde a pergunta que o teste funcional não responde: "aguenta?"',
    'Média engana. Use percentis — p50 para o usuário típico, p95 para o usuário azarado',
    'Um bom teste de carga tem critério de aprovação definido antes de rodar',
    'O sistema pode não dar nenhum erro e ainda assim estar reprovado',
    'Achar o gargalo em teste é barato. Achar em produção, no dia do pico, é caro',
  ], M, 1.95, 11.0, { alturaLinha: 0.78, fontSize: 17, cor: BRANCO, corMarcador: GELO });

  s.addText('Teste de carga não é luxo de sistema grande: é parte da validação.', {
    x: M, y: 5.95, w: 8.0, h: 0.5,
    fontFace: SERIF, fontSize: 19, bold: true, italic: true, color: GELO, isTextBox: true, margin: 0,
  });

  rampa(s, 9.4, 7.0, TEAL, 35);

  s.addNotes('Luan: Fechar com a frase do custo. E abrir para perguntas.');
}

// =============================================================== SLIDE 16
{
  const s = pres.addSlide();
  titulo(s, 'Referências');

  const refs = [
    ['ISO/IEC 25010:2023', 'Systems and software engineering — SQuaRE — Product quality model. Característica Performance efficiency'],
    ['ISTQB', 'Certified Tester Foundation Level Syllabus, v4.0.1, 2024 — testes não funcionais'],
    ['GRAFANA LABS', 'k6 Documentation: Load test types. Disponível em: grafana.com/docs/k6/latest/testing-guides/test-types'],
    ['MOLYNEAUX, Ian', 'The Art of Application Performance Testing. 2. ed. O’Reilly, 2014'],
    ['DELAMARO, M.; MALDONADO, J.; JINO, M.', 'Introdução ao Teste de Software. 2. ed. Rio de Janeiro: Elsevier, 2016'],
  ];

  refs.forEach((r, i) => {
    const y = 1.7 + i * 0.95;
    s.addText(r[0], {
      x: M, y, w: 11.8, h: 0.35,
      fontFace: SANS, fontSize: 15, bold: true, color: AZUL, isTextBox: true, margin: 0,
    });
    s.addText(r[1], {
      x: M, y: y + 0.33, w: 11.8, h: 0.4,
      fontFace: SANS, fontSize: 14, color: MUDO, isTextBox: true, margin: 0,
    });
  });

  s.addText('Grupo 4 — Luan e Eduardo  ·  Verificação e Validação de Software  ·  18/09', {
    x: M, y: 6.6, w: LARG, h: 0.4,
    fontFace: SANS, fontSize: 12, color: MUDO, isTextBox: true, margin: 0,
  });

  s.addNotes('Referencias conferidas em 17/09/2026. A ISO/IEC 25010 foi revisada em 2023: a edicao de 2011 esta substituida, e performance efficiency continua sendo uma das caracteristicas. O syllabus do ISTQB esta na v4.0.1, de setembro de 2024, que e uma errata da v4.0 de abril de 2023.');
}

pres.writeFile({ fileName: 'apresentacao.pptx' }).then((f) => {
  console.log('Gerado:', f);
});
