# Teste de Carga — demonstração prática

Seminário de Verificação e Validação de Software — Grupo 4 (Luan e Eduardo)

## Arquivos

| Arquivo | O que é |
|---|---|
| `slides.md` | Texto de todos os slides + roteiro de fala |
| `servidor.js` | API de exemplo (Node.js puro, sem dependências) |
| `carga.js` | Script de teste de carga do k6 |
| `resultado-5vus.txt` | Saída completa do teste com 5 usuários |
| `resultado-50vus.txt` | Saída completa do teste com 50 usuários |
| `resultado-100vus.txt` | Saída completa do teste com 100 usuários |

## Como rodar (demo ao vivo)

**Terminal 1** — sobe a API e deixa aberto:

```bash
node servidor.js
```

**Terminal 2** — roda os testes, um por vez (35 segundos cada):

```bash
k6 run -e VUS=5 carga.js
```

```bash
k6 run -e VUS=50 carga.js
```

```bash
k6 run -e VUS=100 carga.js
```

Para encerrar a API: `Ctrl+C` no Terminal 1.

## Resultados obtidos

Critério de aprovação: **p95 < 500 ms** e **erros < 1%**.

| | 5 VUs | 50 VUs | 100 VUs |
|---|---|---|---|
| p50 | 25 ms | 249 ms | 1,49 s |
| p95 | 26 ms | 251 ms | 1,50 s |
| Média | 25 ms | 195 ms | 1,17 s |
| Req/s | 3,9 | 32,7 | 36,6 |
| Erros | 0% | 0% | 0% |
| Threshold | passou | passou | **falhou** |

Quando um threshold falha, o k6 encerra com **exit code 99** — é assim que um
pipeline de CI/CD sabe que deve barrar a versão.

## Como a demo funciona por dentro

O endpoint `/produtos` gasta 25 ms de processador por requisição, simulando o
custo de uma consulta ao banco. O Node.js atende tudo em uma única thread, então
o teto da API é 1000 ÷ 25 = **40 requisições por segundo**.

Como cada usuário virtual dorme 1 segundo entre as ações, N usuários geram
aproximadamente N requisições por segundo:

- **5 usuários** → 5 req/s, ou 12% da capacidade → sem fila, resposta em 25 ms
- **50 usuários** → 40 req/s, 100% da capacidade → fila estável, resposta em 250 ms
- **100 usuários** → demanda o dobro da capacidade → fila grande, resposta em 1,5 s

É por isso que o throughput para de crescer e só o tempo de espera aumenta: a
partir de 40 req/s a API não consegue atender mais ninguém por segundo, ela
apenas faz mais gente esperar na fila.

## Como mostrar o teste ao vivo (painel visual)

O k6 tem um painel web embutido. Em vez de projetar só texto de terminal, a turma
vê gráficos se movendo em tempo real. Basta acrescentar `--out web-dashboard`:

```bash
k6 run --out web-dashboard -e VUS=50 carga.js
```

O k6 imprime o endereço do painel. Abra no navegador e projete essa janela:

```
http://127.0.0.1:5665
```

O painel mostra, atualizando a cada segundo:

- **HTTP Request Duration** — o tempo de resposta subindo conforme a carga entra
- **HTTP Request Rate** — as requisições por segundo travando no teto da API
- **HTTP Request Failed** — a taxa de erro, que fica em 0% o tempo todo
- **VUs** — a rampa de usuários subindo, sustentando e descendo

**Detalhe importante:** quando o teste acaba, o k6 encerra e o painel em
`127.0.0.1:5665` sai do ar junto — os gráficos somem da tela. Para não perder
o resultado, exporte o relatório em toda execução:

```bash
K6_WEB_DASHBOARD_EXPORT=relatorio-50vus.html k6 run --out web-dashboard -e VUS=50 carga.js
```

Isso gera um HTML independente com **os mesmos gráficos** do painel ao vivo
(tempo de resposta, VUs, taxa de transferência), que abre em qualquer navegador
com um duplo clique, sem precisar do k6 nem do servidor rodando.

Na apresentação, exporte os três cenários com nomes diferentes e deixe as três
abas abertas: dá para comparar os resultados lado a lado no final, coisa que o
painel ao vivo não permite.

O painel também tem um botão **REPORT** no canto superior direito que baixa esse
mesmo relatório durante a execução — mas depender de clicar no meio da demo é
mais arriscado do que já ter o arquivo salvo.

## Montagem na hora da apresentação

Três janelas, nesta ordem:

| Janela | O que roda | Fica visível? |
|---|---|---|
| Terminal 1 | `node servidor.js` | pode ficar escondida |
| Terminal 2 | os comandos do k6 | sim — metade da tela |
| Navegador | `http://127.0.0.1:5665` | sim — a outra metade |

Antes de começar, **aumente a fonte do terminal** (`Ctrl` + `+` no Windows
Terminal, ou `Ctrl` + roda do mouse). Fonte de tamanho normal não se lê no
projetor a partir da terceira fileira.

Roteiro dos 6 minutos:

1. Mostrar a API respondendo no navegador: `http://localhost:3000/produtos`
2. Rodar com 5 usuários — apontar o tempo de resposta estável em ~25 ms
3. Rodar com 50 — apontar a curva subindo e parando em ~250 ms
4. Rodar com 100 — apontar que a linha de requisições/segundo **não sobe**,
   só o tempo de resposta. E o threshold reprovando em vermelho no terminal
5. Fechar mostrando o `✗ p(95)<500` e explicando o exit code 99

Abra `http://127.0.0.1:5665` assim que cada teste começar — o painel só existe
enquanto o k6 está rodando. Depois que ele encerra, use o `.html` exportado.

## Plano B na apresentação

Se o notebook der problema na hora, você tem dois backups:

- `resultado-5vus.txt`, `resultado-50vus.txt`, `resultado-100vus.txt` — a saída
  completa dos testes já executados, para abrir no terminal
- `relatorio-50vus.html` — o painel visual já gerado, abre direto no navegador
  sem precisar do k6 nem do servidor

Gere também os relatórios HTML dos outros dois cenários antes da apresentação,
para ter os três à mão.
