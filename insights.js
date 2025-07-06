function gerarGraficoDespesasPorCategoria() {
  // Limpa conteúdo anterior
  const container = $('#insights-page main');
  container.empty();

  // Agrupar e somar despesas por categoria
  const categoriasTotais = {};

  itens.filter(i => i.tipo === 'despesas').forEach(d => {
    if (!categoriasTotais[d.categoria]) {
      categoriasTotais[d.categoria] = 0;
    }
    categoriasTotais[d.categoria] += d.valor;
  });

  const labels = Object.keys(categoriasTotais);
  const data = Object.values(categoriasTotais);

  const backgroundColor = labels.map(() =>
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
  );

  // Cria dinamicamente o canvas
  const canvas = $('<canvas id="grafico-despesas-categoria"></canvas>');
  container.append(canvas);

  // Agora sim o canvas existe no DOM, então pode usar getContext
  const ctx = document.getElementById('grafico-despesas-categoria').getContext('2d');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        label: 'Gasto Total',
        data,
        backgroundColor,
        borderColor: 'transparent'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Gastos por Categoria',
          font: { size: 24 }
        },
        legend: {
          position: 'right'
        }
      }
    }
  });
}

function gerarGraficoMensal() {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const despesas = new Array(12).fill(0);
  const receitas = new Array(12).fill(0);
  const anoAtual = new Date().getFullYear();

  itens.forEach(i => {
    if (!i.data) return;
    const [ano, mes] = i.data.split('-').map(Number);
    if (ano !== anoAtual) return;

    const valor = Number(i.valor);
    const isRecorrente = i.recorrente?.toLowerCase() === 'sim';

    if (isRecorrente) {
      for (let m = 0; m < 12; m++) {
        if (i.tipo === 'despesas') despesas[m] += valor;
        if (i.tipo === 'receitas') receitas[m] += valor;
      }
    } else {
      const index = mes - 1;
      if (i.tipo === 'despesas') despesas[index] += valor;
      if (i.tipo === 'receitas') receitas[index] += valor;
    }
  });

  const ctx = document.createElement('canvas');
  ctx.id = 'grafico-mensal';
  $('#insights-page main').append(ctx);

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: meses,
      datasets: [
        {
          label: 'Despesas',
          data: despesas,
          backgroundColor: 'tomato'
        },
        {
          label: 'Receitas',
          data: receitas,
          backgroundColor: 'mediumseagreen'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: `Despesas e Receitas (${anoAtual})`,
          font: { size: 20 }
        }
      }
    }
  });
}

function gerarGraficoSaldoMensal() {
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const saldo = new Array(12).fill(0);
  const anoAtual = new Date().getFullYear();

  itens.forEach(i => {
    if (!i.data) return;
    const [ano, mes] = i.data.split('-').map(Number);
    if (ano !== anoAtual) return;

    const valor = Number(i.valor);
    const isRecorrente = i.recorrente?.toLowerCase() === 'sim';

    if (isRecorrente) {
      for (let m = 0; m < 12; m++) {
        saldo[m] += i.tipo === 'receitas' ? valor : -valor;
      }
    } else {
      const index = mes - 1;
      saldo[index] += i.tipo === 'receitas' ? valor : -valor;
    }
  });

  const ctx = document.createElement('canvas');
  ctx.id = 'grafico-saldo';
  $('#insights-page main').append(ctx);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: meses,
      datasets: [{
        label: 'Saldo Mensal',
        data: saldo,
        borderColor: '#3b82f6',
        fill: false,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Evolução do Saldo Mensal',
          font: { size: 20 }
        }
      }
    }
  });
}

function gerarTodosGraficos() {
  $('#insights-page main').empty(); // limpa gráficos antigos
  gerarGraficoDespesasPorCategoria();
  gerarGraficoMensal();
  gerarGraficoSaldoMensal();
}